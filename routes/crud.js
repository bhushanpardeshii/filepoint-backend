const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const checkCredits = require("../middleware/checkCredits");
const { validateApiKey } = require("../middleware/validateKey");

// Only apply credit check to create route
router.post("/create", checkCredits, async (req, res) => {
    try {
        const { value, txHash } = req.body;

        // Validate input
        if (value == null || !txHash) {
            return res.status(400).json({ error: "Value and txHash are required" });
        }

        // Convert value to number
        const numericValue = parseFloat(value);
        if (isNaN(numericValue)) {
            return res.status(400).json({ error: "Value must be a number" });
        }

        // Check if user is attached to request
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        // Create todo with numeric value
        const todo = await prisma.todo.create({
            data: {
                value: numericValue,
                txHash,
                userId: req.user.id
            }
        });

        res.json({ id: todo.id, status: "created successfully" });
    } catch (error) {
        console.error("Create todo error:", error);
        res.status(500).json({ error: "Failed to create todo" });
    }
});

router.get("/get/:id", validateApiKey, async (req, res) => {
    try {
        const todo = await prisma.todo.findFirst({
            where: {
                id: req.params.id,
                userId: req.user.id
            }
        });
        if (!todo) return res.status(404).json({ error: "Not found" });
        res.json({
            id: todo.id,
            value: todo.value,
            txHash: todo.txHash
        });
    } catch (error) {
        console.error("Get todo error:", error);
        res.status(500).json({ error: "Failed to get todo" });
    }
});

router.patch("/update/:id", validateApiKey, async (req, res) => {
    try {
        const { value } = req.body;
        if (value == null) return res.status(400).json({ error: "Value required" });

        // Convert value to number
        const numericValue = parseFloat(value);
        if (isNaN(numericValue)) {
            return res.status(400).json({ error: "Value must be a number" });
        }

        const todo = await prisma.todo.updateMany({
            where: { id: req.params.id, userId: req.user.id },
            data: { value: numericValue },
        });
        if (todo.count === 0) return res.status(404).json({ error: "Not found or unauthorized" });
        res.json({ status: "updated successfully" });
    } catch (error) {
        console.error("Update todo error:", error);
        res.status(500).json({ error: "Failed to update todo" });
    }
});

router.delete("/delete/:id", async (req, res) => {
    const todo = await prisma.todo.deleteMany({ where: { id: req.params.id, userId: req.user.id } });
    if (todo.count === 0) return res.status(404).json({ error: "Not found or unauthorized" });
    res.json({ status: "deleted successfully" });
});

module.exports = router;