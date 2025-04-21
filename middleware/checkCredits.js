const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const checkCredits = async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.user.id } });
        if (user.rechargedOnce && user.credits <= 0) {
            return res.status(403).json({ error: "Credits exhausted. Cannot recharge again." });
        }
        next();
    } catch (error) {
        console.error("Error in checkCredits middleware:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = checkCredits; 