import "dotenv/config";
import path from "path";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";
import express from "express";
import cors from "cors";
import multer from "multer";
import bcrypt from "bcryptjs";
import { db, query, withTransaction } from "./db.js";
import { createToken, optionalAuth, requireAuth } from "./auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "uploads");
const clientDistDir = path.join(__dirname, "..", "dist");
const clientIndexPath = path.join(clientDistDir, "index.html");
const hasClientBuild = await fs
  .access(clientIndexPath)
  .then(() => true)
  .catch(() => false);
const apiPort = Number(process.env.PORT || process.env.API_PORT || 3001);
const apiPublicUrl = process.env.API_PUBLIC_URL || `http://localhost:${apiPort}`;
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:8080,http://localhost:8081")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

await fs.mkdir(uploadsDir, { recursive: true });

const app = express();

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin ${origin} is not allowed by CORS.`));
    },
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json({ limit: "10mb" }));
app.use("/uploads", express.static(uploadsDir));

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, callback) => callback(null, uploadsDir),
    filename: (_req, file, callback) => {
      const extension = path.extname(file.originalname || "").toLowerCase();
      callback(null, `${Date.now()}-${randomUUID()}${extension}`);
    },
  }),
  limits: {
    fileSize: 25 * 1024 * 1024,
  },
});

function asyncHandler(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

function badRequest(message) {
  const error = new Error(message);
  error.status = 400;
  return error;
}

function mapUser(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    avatarUrl: row.avatar_url,
    createdAt: row.created_at,
  };
}

function mapProfile(row) {
  return {
    id: row.id,
    user_id: row.id,
    display_name: row.display_name,
    avatar_url: row.avatar_url,
    created_at: row.created_at,
  };
}

function mapPost(row) {
  return {
    id: row.id,
    user_id: row.user_id,
    content: row.content,
    media_url: row.media_url,
    media_type: row.media_type,
    created_at: row.created_at,
    profiles: {
      display_name: row.display_name,
      avatar_url: row.avatar_url,
    },
  };
}

function mapComment(row) {
  return {
    id: row.id,
    content: row.content,
    created_at: row.created_at,
    user_id: row.user_id,
    profiles: {
      display_name: row.display_name,
      avatar_url: row.avatar_url,
    },
  };
}

function mapReview(row) {
  return {
    id: row.id,
    rating: row.rating,
    comment: row.comment,
    created_at: row.created_at,
    profiles: {
      display_name: row.display_name,
      avatar_url: row.avatar_url,
    },
  };
}

async function loadUser(userId) {
  const rows = await query(
    `SELECT id, email, display_name, avatar_url, created_at
     FROM users
     WHERE id = ?
     LIMIT 1`,
    [userId],
  );

  return rows[0] ?? null;
}

async function assertConversationParticipant(conversationId, userId) {
  const rows = await query(
    `SELECT id
     FROM conversation_participants
     WHERE conversation_id = ? AND user_id = ?
     LIMIT 1`,
    [conversationId, userId],
  );

  if (!rows[0]) {
    const error = new Error("Conversation not found.");
    error.status = 404;
    throw error;
  }
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post(
  "/api/auth/signup",
  asyncHandler(async (req, res) => {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    const name = String(req.body.name || "").trim();

    if (!email || !password || !name) {
      throw badRequest("Name, email, and password are required.");
    }

    if (password.length < 6) {
      throw badRequest("Password must be at least 6 characters.");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = randomUUID();

    try {
      await query(
        `INSERT INTO users (id, email, password_hash, display_name)
         VALUES (?, ?, ?, ?)`,
        [userId, email, passwordHash, name],
      );
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        res.status(409).json({ error: "An account with this email already exists." });
        return;
      }

      throw error;
    }

    const user = await loadUser(userId);
    res.status(201).json({ token: createToken(user), user: mapUser(user) });
  }),
);

app.post(
  "/api/auth/login",
  asyncHandler(async (req, res) => {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (!email || !password) {
      throw badRequest("Email and password are required.");
    }

    const rows = await query(
      `SELECT id, email, password_hash, display_name, avatar_url, created_at
       FROM users
       WHERE email = ?
       LIMIT 1`,
      [email],
    );

    const user = rows[0];
    if (!user) {
      res.status(401).json({ error: "Invalid email or password." });
      return;
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches) {
      res.status(401).json({ error: "Invalid email or password." });
      return;
    }

    res.json({ token: createToken(user), user: mapUser(user) });
  }),
);

app.get(
  "/api/auth/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = await loadUser(req.auth.sub);

    if (!user) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    res.json({ user: mapUser(user) });
  }),
);

app.get(
  "/api/businesses",
  asyncHandler(async (req, res) => {
    const category = String(req.query.category || "").trim();
    const params = [];
    let sql = `
      SELECT id, owner_id, name, slug, category, description, phone, website, address, image_url, verified, created_at, updated_at
      FROM businesses
    `;

    if (category) {
      sql += " WHERE category = ?";
      params.push(category);
    }

    sql += " ORDER BY name ASC";

    const rows = await query(sql, params);
    res.json({ businesses: rows });
  }),
);

app.get(
  "/api/businesses/:slug",
  asyncHandler(async (req, res) => {
    const rows = await query(
      `SELECT id, owner_id, name, slug, category, description, phone, website, address, image_url, verified, created_at, updated_at
       FROM businesses
       WHERE slug = ?
       LIMIT 1`,
      [req.params.slug],
    );

    if (!rows[0]) {
      res.status(404).json({ error: "Business not found." });
      return;
    }

    res.json({ business: rows[0] });
  }),
);

app.get(
  "/api/businesses/:businessId/reviews",
  asyncHandler(async (req, res) => {
    const rows = await query(
      `SELECT r.id, r.rating, r.comment, r.created_at, u.display_name, u.avatar_url
       FROM reviews r
       JOIN users u ON u.id = r.user_id
       WHERE r.business_id = ?
       ORDER BY r.created_at DESC`,
      [req.params.businessId],
    );

    res.json({ reviews: rows.map(mapReview) });
  }),
);

app.post(
  "/api/businesses/:businessId/reviews",
  requireAuth,
  asyncHandler(async (req, res) => {
    const rating = Number(req.body.rating);
    const comment = String(req.body.comment || "").trim();

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      throw badRequest("Rating must be between 1 and 5.");
    }

    if (!comment || comment.length > 2000) {
      throw badRequest("Review must be between 1 and 2000 characters.");
    }

    try {
      await query(
        `INSERT INTO reviews (id, business_id, user_id, rating, comment)
         VALUES (?, ?, ?, ?, ?)`,
        [randomUUID(), req.params.businessId, req.auth.sub, rating, comment],
      );
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        res.status(409).json({ error: "You've already reviewed this business.", code: "DUPLICATE_REVIEW" });
        return;
      }

      throw error;
    }

    res.status(201).json({ ok: true });
  }),
);

app.get(
  "/api/posts",
  optionalAuth,
  asyncHandler(async (_req, res) => {
    const rows = await query(
      `SELECT p.id, p.user_id, p.content, p.media_url, p.media_type, p.created_at, u.display_name, u.avatar_url
       FROM posts p
       JOIN users u ON u.id = p.user_id
       ORDER BY p.created_at DESC
       LIMIT 50`,
    );

    res.json({ posts: rows.map(mapPost) });
  }),
);

app.post(
  "/api/posts",
  requireAuth,
  asyncHandler(async (req, res) => {
    const content = typeof req.body.content === "string" ? req.body.content.trim() : "";
    const mediaUrl = req.body.mediaUrl ? String(req.body.mediaUrl) : null;
    const mediaType = req.body.mediaType ? String(req.body.mediaType) : null;

    if (!content && !mediaUrl) {
      throw badRequest("A post needs content or media.");
    }

    const postId = randomUUID();
    await query(
      `INSERT INTO posts (id, user_id, content, media_url, media_type)
       VALUES (?, ?, ?, ?, ?)`,
      [postId, req.auth.sub, content || null, mediaUrl, mediaType],
    );

    res.status(201).json({ id: postId });
  }),
);

app.delete(
  "/api/posts/:postId",
  requireAuth,
  asyncHandler(async (req, res) => {
    const result = await db.execute(
      `DELETE FROM posts
       WHERE id = ? AND user_id = ?`,
      [req.params.postId, req.auth.sub],
    );
    const [{ affectedRows }] = result;

    if (!affectedRows) {
      res.status(404).json({ error: "Post not found." });
      return;
    }

    res.status(204).end();
  }),
);

app.get(
  "/api/posts/:postId/likes",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const countRows = await query(
      `SELECT COUNT(*) AS count
       FROM likes
       WHERE post_id = ?`,
      [req.params.postId],
    );

    let liked = false;
    if (req.auth?.sub) {
      const likedRows = await query(
        `SELECT id
         FROM likes
         WHERE post_id = ? AND user_id = ?
         LIMIT 1`,
        [req.params.postId, req.auth.sub],
      );
      liked = Boolean(likedRows[0]);
    }

    res.json({ count: Number(countRows[0]?.count || 0), liked });
  }),
);

app.post(
  "/api/posts/:postId/likes",
  requireAuth,
  asyncHandler(async (req, res) => {
    await query(
      `INSERT IGNORE INTO likes (id, post_id, user_id)
       VALUES (?, ?, ?)`,
      [randomUUID(), req.params.postId, req.auth.sub],
    );

    res.status(201).json({ ok: true });
  }),
);

app.delete(
  "/api/posts/:postId/likes",
  requireAuth,
  asyncHandler(async (req, res) => {
    await query(
      `DELETE FROM likes
       WHERE post_id = ? AND user_id = ?`,
      [req.params.postId, req.auth.sub],
    );

    res.status(204).end();
  }),
);

app.get(
  "/api/posts/:postId/comments",
  asyncHandler(async (req, res) => {
    const rows = await query(
      `SELECT c.id, c.content, c.created_at, c.user_id, u.display_name, u.avatar_url
       FROM comments c
       JOIN users u ON u.id = c.user_id
       WHERE c.post_id = ?
       ORDER BY c.created_at ASC`,
      [req.params.postId],
    );

    res.json({ comments: rows.map(mapComment) });
  }),
);

app.post(
  "/api/posts/:postId/comments",
  requireAuth,
  asyncHandler(async (req, res) => {
    const content = String(req.body.content || "").trim();

    if (!content) {
      throw badRequest("Comment content is required.");
    }

    await query(
      `INSERT INTO comments (id, post_id, user_id, content)
       VALUES (?, ?, ?, ?)`,
      [randomUUID(), req.params.postId, req.auth.sub, content],
    );

    res.status(201).json({ ok: true });
  }),
);

app.post(
  "/api/uploads/media",
  requireAuth,
  upload.single("file"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      throw badRequest("File upload is required.");
    }

    const mediaType = req.file.mimetype.startsWith("video/") ? "video" : "image";
    res.status(201).json({
      url: `${apiPublicUrl}/uploads/${req.file.filename}`,
      mediaType,
    });
  }),
);

app.get(
  "/api/people",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const params = [];
    let sql = `
      SELECT id, email, display_name, avatar_url, created_at
      FROM users
    `;

    if (req.auth?.sub) {
      sql += " WHERE id <> ?";
      params.push(req.auth.sub);
    }

    sql += " ORDER BY created_at DESC LIMIT 50";

    const rows = await query(sql, params);
    res.json({ people: rows.map(mapProfile) });
  }),
);

app.get(
  "/api/friendships",
  requireAuth,
  asyncHandler(async (req, res) => {
    const rows = await query(
      `SELECT id, requester_id, addressee_id, status, created_at, updated_at
       FROM friendships
       WHERE requester_id = ? OR addressee_id = ?`,
      [req.auth.sub, req.auth.sub],
    );

    res.json({ friendships: rows });
  }),
);

app.post(
  "/api/friendships",
  requireAuth,
  asyncHandler(async (req, res) => {
    const addresseeId = String(req.body.addresseeId || "").trim();

    if (!addresseeId) {
      throw badRequest("Addressee is required.");
    }

    if (addresseeId === req.auth.sub) {
      throw badRequest("You cannot friend yourself.");
    }

    try {
      await query(
        `INSERT INTO friendships (id, requester_id, addressee_id, status)
         VALUES (?, ?, ?, 'pending')`,
        [randomUUID(), req.auth.sub, addresseeId],
      );
    } catch (error) {
      if (error.code !== "ER_DUP_ENTRY") {
        throw error;
      }
    }

    res.status(201).json({ ok: true });
  }),
);

app.patch(
  "/api/friendships/accept",
  requireAuth,
  asyncHandler(async (req, res) => {
    const requesterId = String(req.body.requesterId || "").trim();

    if (!requesterId) {
      throw badRequest("Requester is required.");
    }

    await query(
      `UPDATE friendships
       SET status = 'accepted', updated_at = CURRENT_TIMESTAMP
       WHERE requester_id = ? AND addressee_id = ?`,
      [requesterId, req.auth.sub],
    );

    res.json({ ok: true });
  }),
);

app.post(
  "/api/conversations",
  requireAuth,
  asyncHandler(async (req, res) => {
    const participantIds = Array.isArray(req.body.participantIds) ? req.body.participantIds : [];
    const allParticipants = Array.from(new Set([req.auth.sub, ...participantIds.filter(Boolean)]));

    if (allParticipants.length < 2) {
      throw badRequest("A conversation needs at least two participants.");
    }

    const conversationId = randomUUID();

    await withTransaction(async (connection) => {
      await connection.query(
        `INSERT INTO conversations (id)
         VALUES (?)`,
        [conversationId],
      );

      for (const participantId of allParticipants) {
        await connection.query(
          `INSERT INTO conversation_participants (id, conversation_id, user_id)
           VALUES (?, ?, ?)`,
          [randomUUID(), conversationId, participantId],
        );
      }
    });

    res.status(201).json({ conversation: { id: conversationId } });
  }),
);

app.get(
  "/api/conversations",
  requireAuth,
  asyncHandler(async (req, res) => {
    const rows = await query(
      `SELECT c.id, c.updated_at
       FROM conversations c
       JOIN conversation_participants cp ON cp.conversation_id = c.id
       WHERE cp.user_id = ?
       ORDER BY c.updated_at DESC`,
      [req.auth.sub],
    );

    res.json({ conversations: rows });
  }),
);

app.get(
  "/api/conversations/:conversationId/messages",
  requireAuth,
  asyncHandler(async (req, res) => {
    await assertConversationParticipant(req.params.conversationId, req.auth.sub);

    const rows = await query(
      `SELECT m.id, m.content, m.created_at, m.sender_id, u.display_name
       FROM messages m
       JOIN users u ON u.id = m.sender_id
       WHERE m.conversation_id = ?
       ORDER BY m.created_at ASC`,
      [req.params.conversationId],
    );

    const messages = rows.map((row) => ({
      id: row.id,
      content: row.content,
      created_at: row.created_at,
      sender_id: row.sender_id,
      profiles: {
        display_name: row.display_name,
      },
    }));

    res.json({ messages });
  }),
);

app.post(
  "/api/conversations/:conversationId/messages",
  requireAuth,
  asyncHandler(async (req, res) => {
    const content = String(req.body.content || "").trim();

    if (!content) {
      throw badRequest("Message content is required.");
    }

    await assertConversationParticipant(req.params.conversationId, req.auth.sub);

    await withTransaction(async (connection) => {
      await connection.query(
        `INSERT INTO messages (id, conversation_id, sender_id, content)
         VALUES (?, ?, ?, ?)`,
        [randomUUID(), req.params.conversationId, req.auth.sub, content],
      );

      await connection.query(
        `UPDATE conversations
         SET updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [req.params.conversationId],
      );
    });

    res.status(201).json({ ok: true });
  }),
);

app.get(
  "/api/groups",
  asyncHandler(async (_req, res) => {
    const rows = await query(
      `SELECT g.id, g.name, g.description, g.cover_image_url, g.created_by, g.is_public, g.created_at, g.updated_at,
              COUNT(gm.id) AS member_count
       FROM \`groups\` g
       LEFT JOIN group_members gm ON gm.group_id = g.id
       WHERE g.is_public = 1
       GROUP BY g.id
       ORDER BY g.created_at DESC`,
    );

    const groups = rows.map((row) => ({
      ...row,
      group_members: [{ count: Number(row.member_count || 0) }],
    }));

    res.json({ groups });
  }),
);

app.post(
  "/api/groups",
  requireAuth,
  asyncHandler(async (req, res) => {
    const name = String(req.body.name || "").trim();
    const description = String(req.body.description || "").trim();

    if (!name) {
      throw badRequest("Group name is required.");
    }

    const groupId = randomUUID();

    await withTransaction(async (connection) => {
      await connection.query(
        `INSERT INTO \`groups\` (id, name, description, created_by, is_public)
         VALUES (?, ?, ?, ?, 1)`,
        [groupId, name, description || null, req.auth.sub],
      );

      await connection.query(
        `INSERT INTO group_members (id, group_id, user_id, role)
         VALUES (?, ?, ?, 'admin')`,
        [randomUUID(), groupId, req.auth.sub],
      );
    });

    res.status(201).json({ group: { id: groupId } });
  }),
);

app.post(
  "/api/groups/:groupId/join",
  requireAuth,
  asyncHandler(async (req, res) => {
    await query(
      `INSERT IGNORE INTO group_members (id, group_id, user_id, role)
       VALUES (?, ?, ?, 'member')`,
      [randomUUID(), req.params.groupId, req.auth.sub],
    );

    res.status(201).json({ ok: true });
  }),
);

if (hasClientBuild) {
  app.use(express.static(clientDistDir));

  app.use((req, res, next) => {
    if (req.method !== "GET") {
      next();
      return;
    }

    if (req.path.startsWith("/api") || req.path.startsWith("/uploads")) {
      next();
      return;
    }

    res.sendFile(clientIndexPath);
  });
}

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(error.status || 500).json({
    error: error.message || "Internal server error.",
  });
});

app.listen(apiPort, () => {
  console.log(`MySQL API listening on ${apiPublicUrl}`);
});
