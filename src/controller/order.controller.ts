import { Response, Request, NextFunction } from "express";
import Stripe from "stripe";
import HttpError from "../model/http-error";
import {
  GetSessionInput,
  NewOrderInput,
  UpdateOrderInput,
} from "../schema/order.schema";
import { findProductById } from "../service/menu.service";
import {
  createOrder,
  findOrderById,
  findOrders,
  updateOrder,
} from "../service/order.service";
import { ExtraItemModel } from "../model";
import { ByIdInput } from "../schema/global.schema";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

export async function findOrdersHandler(
  req: Request<{}, {}, {}>,
  res: Response,
  next: NextFunction
) {
  const orders = await findOrders();

  if (!orders) {
    return next(new HttpError("Orders not found", 404));
  }

  res.json(orders);
}

export async function findOrderByIdHandler(
  req: Request<ByIdInput, {}, {}>,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;

  const order = await findOrderById(id!);

  if (!order) {
    return next(new HttpError("Order not found", 404));
  }

  res.json(order);
}

export async function newOrderHandler(
  req: Request<{}, {}, NewOrderInput>,

  res: Response,
  next: NextFunction
) {
  const body = req.body;

  const order = await createOrder(body);

  if (!order) {
    return next(new HttpError("Error creating new order", 404));
  }

  res.json({ url: `${process.env.CLIENT_BASE_URL}/payment?success=true` });
}

export async function stripeNewSessionHandler(
  req: Request<{}, {}, NewOrderInput>,
  res: Response,
  next: NextFunction
) {
  const body = req.body;

  const productLineItems:
    | Stripe.Checkout.SessionCreateParams.LineItem[]
    | undefined = await Promise.all(
    body.orderItems.map(async (item) => {
      const product = await findProductById(item.product);
      const productPrice = product?.sizes.find(
        (size) => size.size === item.size
      );

      return {
        price_data: {
          currency: "eur",
          product_data: {
            name: product?.name!,
          },
          unit_amount: productPrice!.price! * 100,
        },
        quantity: item.quantity,
      };
    })
  );

  const extraItems = await Promise.all(
    body.orderItems.map(async (item) => {
      const extras = await ExtraItemModel.find({
        _id: { $in: item.extras },
      });

      return extras.map((extra) => {
        return {
          price_data: {
            currency: "eur",
            product_data: {
              name: extra?.name,
            },
            unit_amount: extra?.price! * 100,
          },
          quantity: item.quantity,
        };
      });
    })
  );

  const extraLineItems:
    | Stripe.Checkout.SessionCreateParams.LineItem[]
    | undefined = extraItems.map((item) => item).flat();

  const session = await stripe.checkout.sessions.create({
    line_items: [...productLineItems, ...extraLineItems],
    mode: "payment",
    success_url: `${process.env.CLIENT_BASE_URL}/payment?success=true`,
    cancel_url: `${process.env.CLIENT_BASE_URL}/payment?success=false`,
    payment_method_types: ["card"],
  });

  const url = session.url;

  if (!url) {
    return next(new HttpError("Error creating stripe url", 500));
  }

  const order = await createOrder(body);

  if (!order) {
    return next(new HttpError("Error creating new order", 500));
  }

  res
    .status(200)
    .json({ url, sessionId: session.id, orderId: order._id.toString() });
}

export async function findSessionByIdHandler(
  req: Request<GetSessionInput, {}, {}>,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;

  const session = await stripe.checkout.sessions.retrieve(id);

  if (!session) {
    return next(new HttpError("Session not found", 404));
  }

  res.json(session);
}

export async function updateOrderHandler(
  req: Request<UpdateOrderInput["params"], {}, UpdateOrderInput["body"]>,
  res: Response,
  next: NextFunction
) {
  const message = "Error updating Order";
  const body = req.body;
  const { id } = req.params;

  const order = await updateOrder(
    { _id: id },
    {
      ...body,
    }
  );

  if (!order) {
    return next(new HttpError(message, 404));
  }

  res.json(order);
}
