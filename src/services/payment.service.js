import { Currency } from "xendit-node/balance_and_transaction/models/Currency.js";
import prisma from "../config/prisma.js";

const XENDIT_SECRET_KEY = process.env.XENDIT_SECRET_KEY;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

const xenditRequest = async (endpoint, method, body) => {
  const credentials = Buffer.from(XENDIT_SECRET_KEY + ":").toString("base64");
  const response = await fetch(`https://api.xendit.co${endpoint}`, {
    method,
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  return response.json();
};

export const makePayment = async (bookingId, userId) => {
  try {
    const booking = await prisma.booking.findFirst({
      where: { id: bookingId, userId: userId },
      include: {
        service: true,
        user: true,
      },
    });

    if (booking.status !== "WAITING_PAYMENT") {
      throw {
        status: 400,
        message: "Payment Already Processed!",
      };
    }

    const existingPayment = await prisma.payment.findUnique({
      where: {
        bookingId: booking.id,
      },
    });

    if (
      existingPayment &&
      existingPayment.status === "UNPAID" &&
      existingPayment.xenditPaymentUrl
    ) {
      return existingPayment;
    }

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const invoiceData = await xenditRequest("/v2/invoices", "POST", {
      external_id: `booking_${booking.id}_${Date.now()}`,
      amount: Number(booking.totalAmount),
      description: `Booking for ${booking.service.name}`,
      invoice_duration: 86400,
      customer: {
        given_names: booking.user.name,
        email: booking.user.email,
      },
      customer_notification_preference: {
        invoice_created: ["email"],
        invoice_reminder: ["email"],
        invoice_paid: ["email"],
      },
      success_redirect_url: `${CLIENT_URL}/bookings/${booking.id}?payment=success`,
      success_redirect_url: `${CLIENT_URL}/bookings/${booking.id}?payment=failed`,
      currency: "IDR",
      items: [
        {
          name: booking.service.name,
          quantity: 1,
          price: Number(booking.totalAmount),
          category: "Service",
        },
      ],
    });

    if (invoiceData.error_code) {
      console.log("Xendit Error : ", invoiceData);

      throw {
        status: 500,
        message: "Payment Gateway Error " + invoiceData.message,
      };
    }

    const payment = await prisma.payment.upsert({
      where: { bookingId: booking.id },
      update: {
        xenditInvoiceId: invoiceData.id,
        xenditPaymentUrl: invoiceData.invoice_url,
        amount: booking.totalAmount,
        status: "UNPAID",
        expiresAt,
      },
      create: {
        bookingId: booking.id,
        xenditInvoiceId: invoiceData.id,
        xenditPaymentUrl: invoiceData.invoice_url,
        amount: booking.totalAmount,
        status: "UNPAID",
        expiresAt,
      },
    });

    await prisma.booking.update({
      where: { id: booking.id },
      data: {
        status: "PENDING",
      },
    });

    return payment;
  } catch (err) {
    throw {
      status: 500,
      message: err,
    };
  }
};
