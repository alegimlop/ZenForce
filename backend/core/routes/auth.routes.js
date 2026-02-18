import express from "express";
import {lAdmin, login, register} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login-cliente", login);
router.post("/login-admin", lAdmin);
router.post("/registro", register);

export default router;
