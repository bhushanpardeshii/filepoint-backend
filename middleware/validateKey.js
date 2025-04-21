const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function validateApiKey(req, res, next) {
    const apiKey = req.headers["x-api-key"] || req.body.apiKey;
    if (!apiKey) return res.status(401).json({ error: "API key missing" });
    const user = await prisma.user.findUnique({ where: { apiKey } });
    if (!user) return res.status(403).json({ error: "Invalid API key" });
    req.user = user;
    next();
}


module.exports = { validateApiKey };