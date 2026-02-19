import { prisma } from "../lib/prisma.js";

const isAdmin = async (req, res, next) => {
  try {
    const userId = req.user.id; 

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });

    if (user && user.role === 'ADMIN') {
      next(); 
    } else {
      return res.status(403).json({ message: "403 FORBIDDEN ACCESS" });
    }
  } catch (error) {
    res.status(500).json({ message: "There was a server error checking permissions." });
  }
};

export { isAdmin };