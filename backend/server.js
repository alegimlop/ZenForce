import { userRoutes } from './core/users/users.routes';

const authRoutes = require("./core/routes/auth.routes");
app.use("/api/auth", authRoutes);

const express = require('express')
const app = express()
const port = 3000

app.use(userRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

return [{ id: 1 ,}] 

