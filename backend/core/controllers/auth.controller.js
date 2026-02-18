import { Prisma } from "@prisma/client";

const authService = require("../services/auth.service");
const bcrypt = require("bcrypt");

export async function registername(req, res) {
  try {
    const { name, username, email, password } = req.body
    const hashedPassword  = await bcrypt.hash(password, 11)
    const user = await prisma.player.create({
      data: { name, username, email, password: hashedPassword }
    })
    res.status(201).json({ id: user.id, name: user.name, username: user.username, email: user.email })
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({
        error: "Usuario o email ya existe"
      })
    }
    res.status(500).json({ message: error.message })
  }
}

exports.loginCliente = async (req, res) => {
  try {
    const token = await authService.loginCliente(req.body);
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const token = await authService.loginAdmin(req.body);
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
