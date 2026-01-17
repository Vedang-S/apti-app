import { prisma } from "../lib/prisma.js";

export const getProfile = async (req, res) => {
  try {
    const { id, email } = req.user;

    const user = await prisma.user.findUnique({
      where: { id: id },
    });

    if (!user) {
      user = await prisma.user.create({
        data: { id: id, email: email },
      });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error lol", error: error.message });
  }
};

