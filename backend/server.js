import express from "express";
import authRoutes from "./core/routes/auth.routes.js";
// import { router } from "./core/users/users.routes.js";

const app = express();
const port = 3000;

app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
