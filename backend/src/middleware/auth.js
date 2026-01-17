import { supabase } from "../lib/supabase.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    const { data, error } = await supabase.auth.getClaims(token);

    if (error || !data) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = {
      id: data.claims.sub,
      email: data.claims.email,
      role: data.claims.role,
    };

    next();
  } catch (error) {
    res.status(500).json({ message: "Server error during authentication" });
  }
};

