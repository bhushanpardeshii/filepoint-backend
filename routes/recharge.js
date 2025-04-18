const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.post("/request", async (req, res) => {
    const { apiKey } = req.body;
    if (!apiKey) return res.status(400).json({ error: "API key required" });
    const user = await prisma.user.findUnique({ where: { apiKey } });
    if (!user) return res.status(403).json({ error: "Invalid API key" });
    if (user.rechargedOnce) return res.json({ message: "Credits exhausted. Cannot recharge again." });
    await prisma.user.update({
        where: { id: user.id },
        data: { credits: 4, rechargedOnce: true },
    });
    res.json({ message: "Credits recharged successfully." });
});

module.exports = router;
