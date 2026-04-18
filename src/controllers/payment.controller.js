import { makePayment } from "../services/payment.service.js";
import { successResponse } from "../helper/response.js";
import prisma from "../config/prisma.js";

export const createPayment = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const result = await makePayment(bookingId, req.user.id);

    return successResponse(res, 201, "Success", result);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const handleWebhook = async (req, res) => {
  try {
    const webhookToken = req.headers["x-callback-token"];
    if (webhookToken !== process.env.XENDIT_WEBHOOK_TOKEN) {
      return res.status(401).json({
        success: false,
        message: "Invalid webhook token",
      });
    }

    const event = req.body;

    if (event.status === "PAID" || event.status === "SETTLED") {
      const payment = await prisma.payment.findFirst({
        where: { xenditInvoiceId: event.id },
      });

      if (payment) {
        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: "PAID",
            paymentMethod: event.payment_method,
            paidAt: new Date(event.paid_at || Date.now()),
          },
        });

        await prisma.booking.update({
          where: { id: payment.bookingId },
          data: {
            status: "CONFIRMED",
          },
        });
      }
    } else if (event.status === "EXPIRED") {
      const payment = await prisma.payment.findFirst({
        where: { xenditInvoiceId: event.id },
      });

      if (payment) {
        await prisma.payment.update({
          where: { id: payment.id },
          data: { status: "EXPIRED" },
        });
        await prisma.booking.update({
          where: { id: payment.bookingId },
          data: {
            status: "CANCELLED",
          },
        });
      }
    }

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Webhook Processing Failed",
    });
  }
};
