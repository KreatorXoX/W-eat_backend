import { Response, Request, NextFunction } from "express";
import Stripe from "stripe";
import HttpError from "../model/http-error";
import { NewOrderInput } from "../schema/order.schema";
import {
  findExtraById,
  findExtraItemById,
  findProductById,
} from "../service/menu.service";
import { ExtraItemModel } from "../model";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

export async function newOrderHandler(
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

  const extraLineIItems:
    | Stripe.Checkout.SessionCreateParams.LineItem[]
    | undefined = extraItems.map((item) => item).flat();

  // const session = await stripe.checkout.sessions.create({
  //   line_items: [
  //     ...productLineItems,
  //     ...extraLineIItems,
  //     // {
  //     //   // // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
  //     //   // price: "{{PRICE_ID}}",
  //     //   // quantity: 1,

  //     // },
  //   ],
  //   mode: "payment",
  //   success_url: `${process.env.CLIENT_BASE_URL}/payment?success=true`,
  //   cancel_url: `${process.env.CLIENT_BASE_URL}/payment?success=false`,
  //   payment_method_types: ["card"],
  // });

  res.json({ lineItems: [...extraLineIItems, ...productLineItems] });
}
