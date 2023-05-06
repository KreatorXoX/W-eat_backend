import express from "express";

import user from "./user.routes";
import auth from "./auth.routes";
import menu from "./menu.routes";
import restaurant from "./restaurant.routes";
const router = express.Router();

router.get("/healthcheck", (_, res) => res.sendStatus(200));

router.use(user);
router.use(auth);
router.use(menu);
router.use(restaurant);

export default router;
