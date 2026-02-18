const authService = require("../services/auth.service");

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
