import express from "express";
const router = express.Router();
import { isAdmin } from "../middleware/adminAuth.js";
import { authMiddleware } from "../middleware/auth.js";
import { prisma } from "../lib/prisma.js";

router.post("/addQuestion", authMiddleware, isAdmin, async (req, res) => {
  try {
    const {
      examId,
      yearAsked,
      questionText,
      optionA,
      optionB,
      optionC,
      optionD,
      correctAnswer,
      solution,
    } = req.body;

    const question = await prisma.question.create({
      data: {
        examId,
        yearAsked: Number(yearAsked),
        questionText,
        optionA,
        optionB,
        optionC,
        optionD,
        correctAnswer,
        solution,
      },
    });

    res.status(201).json(question);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add question" });
  }
});

export default router;
