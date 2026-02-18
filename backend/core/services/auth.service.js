const prisma = require("../prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.loginCliente = async ({ email, password }) => {
  const cliente = await prisma.cliente.findUnique({
    where: { email }
  });

  if (!cliente) {
    throw new Error("Cliente no encontrado");
  }

  const validPassword = await bcrypt.compare(password, cliente.password);

  if (!validPassword) {
    throw new Error("Contraseña incorrecta");
  }

  return jwt.sign(
    { id: cliente.dni, role: "CLIENTE" },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );
};

exports.loginAdmin = async ({ email, password }) => {
  const admin = await prisma.admin.findUnique({
    where: { correo: email }
  });

  if (!admin) {
    throw new Error("Admin no encontrado");
  }

  const validPassword = await bcrypt.compare(password, admin.password);

  if (!validPassword) {
    throw new Error("Contraseña incorrecta");
  }

  return jwt.sign(
    { id: admin.id, role: "ADMIN" },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );
};
