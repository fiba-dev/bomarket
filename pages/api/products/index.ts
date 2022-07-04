import * as yup from "yup";
import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { getAllProducts, setOrUpdateProduct } from "controller/products";
import { authMiddlewareCors } from "lib/init-middleware";
import { authMiddleware } from "lib/middlewares";

export async function getHandler(req: NextApiRequest, res: NextApiResponse) {
  const products = await getAllProducts();
  res.send(products);
}

let product = yup
  .object()
  .shape({
    id: yup.string(),
    name: yup.string(),
    description: yup.string(),
    price: yup.number(),
    images: yup.string(),
    category: yup.string(),
    stock: yup.number(),
  })
  .noUnknown(true)
  .strict();
async function postHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  userBody
) {
  try {
    await product.validate(req.body);
    await setOrUpdateProduct(req.body, userBody.userId);
  } catch (error) {
    res.status(404).send(error);
  }

  res.send(true);
}

const handler = methods({
  get: getHandler,
  post: authMiddleware(postHandler),
});

export default authMiddlewareCors(handler);
