import "dotenv/config";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "change-me-in-production";

function readBearerToken(header = "") {
  if (!header.startsWith("Bearer ")) {
    return null;
  }

  return header.slice("Bearer ".length);
}

export function createToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      displayName: user.display_name,
    },
    JWT_SECRET,
    { expiresIn: "7d" },
  );
}

export function optionalAuth(req, _res, next) {
  const token = readBearerToken(req.headers.authorization);

  if (!token) {
    req.auth = null;
    next();
    return;
  }

  try {
    req.auth = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    req.auth = null;
    next();
  }
}

export function requireAuth(req, res, next) {
  const token = readBearerToken(req.headers.authorization);

  if (!token) {
    res.status(401).json({ error: "Authentication required." });
    return;
  }

  try {
    req.auth = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token." });
  }
}
