const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");
const authRoutes = require("./routes/auth");
const crudRoutes = require("./routes/crud");
const rechargeRoutes = require("./routes/recharge");
const validateApiKey = require("./middleware/validateKey");
const checkCredits = require("./middleware/checkCredits");

dotenv.config();
const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

// Public routes
app.use("/auth", authRoutes);

// Protected routes
app.use("/recharge", validateApiKey, rechargeRoutes);
app.use("/", validateApiKey, checkCredits, crudRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));