import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "lib/middlewares";
import method from "micro-method-router";
import { editUser, getUserFromId } from "controller/users";
import { authMiddlewareCors } from "lib/init-middleware";
import * as yup from "yup";

async function getUser(req: NextApiRequest, res: NextApiResponse, token) {
  const user = await getUserFromId(token.userId);

  res.send(user.data);
}

// let bodySchema = yup
//   .object()
//   .shape({
//     name: yup.string(),
//     adress: yup.string(),
//     description: yup.string(),
//     photo: yup.string(),
//     phone: yup.number(),
//   })
//   .noUnknown(true)
//   .strict();

async function setUser(req: NextApiRequest, res: NextApiResponse, token) {
  const user = await getUserFromId(token.userId);

  if (req.body) {
    await editUser(req.body, user);
  } else {
    return res.status(400).send({
      message: "FALTAN DATOS",
    });
  }
  res.send(true);
}

const handlerAuth = method({
  get: getUser,
  patch: setUser,
});

export default authMiddlewareCors(authMiddleware(handlerAuth));
