const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const crypto = require("crypto");

// Simulate Google login
router.post("/google", async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        const apiKey = crypto.randomBytes(16).toString("hex");
        user = await prisma.user.create({ data: { email, apiKey } });
    }
    res.json({ apiUrl: process.env.API_URL, credits: user.credits });
});

module.exports = router;
