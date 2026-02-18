import { PrismaClient } from "@prisma/client";
import { loginAdmin, loginCliente } from "../services/auth.service.js";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const register = async (req, res) => {
  try {
    const {dni, nombre, email, password, tarifa, gimnasioId } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.cliente.create({
      data: { dni, nombre, email, password: hashedPassword, tarifa, gimnasioId }
    });

    res.status(201).json({
      dni: user.dni,
      nombre: user.nombre,      
      email: user.email,
      tarifa: user.tarifa,
      gimnasioId: user.gimnasioId
    });

  } catch (error) {

    if (error.code === "P2002") {
      return res.status(400).json({
        error: "Usuario o email ya existe"
      });
    }

    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const token = await loginCliente(req.body);
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const lAdmin = async (req, res) => {
  try {
    const token = await loginAdmin(req.body);
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
