const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.post("/create", async (req, res) => {
    const { value, txHash } = req.body;
    if (value == null || !txHash) return res.status(400).json({ error: "Invalid input" });
    const todo = await prisma.todo.create({ data: { value, txHash, userId: req.user.id } });
    res.json({ id: todo.id, status: "created successfully" });
});

router.get("/get/:id", async (req, res) => {
    const todo = await prisma.todo.findFirst({ where: { id: req.params.id, userId: req.user.id } });
    if (!todo) return res.status(404).json({ error: "Not found" });
    res.json({ value: todo.value, txHash: todo.txHash });
});

router.patch("/update/:id", async (req, res) => {
    const { value } = req.body;
    if (value == null) return res.status(400).json({ error: "Value required" });
    const todo = await prisma.todo.updateMany({
        where: { id: req.params.id, userId: req.user.id },
        data: { value },
    });
    if (todo.count === 0) return res.status(404).json({ error: "Not found or unauthorized" });
    res.json({ status: "updated successfully" });
});

router.delete("/delete/:id", async (req, res) => {
    const todo = await prisma.todo.deleteMany({ where: { id: req.params.id, userId: req.user.id } });
    if (todo.count === 0) return res.status(404).json({ error: "Not found or unauthorized" });
    res.json({ status: "deleted successfully" });
});

module.exports = router;