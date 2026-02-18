const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

router.post("/login-cliente", authController.loginCliente);
router.post("/login-admin", authController.loginAdmin);

module.exports = router;