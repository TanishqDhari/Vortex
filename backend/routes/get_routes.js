import express from "express";
import db from "../db/connection.js";

const router = express.Router();

// Helper function
function queryDb(sql, params, res) {
  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
}

// USERS
router.get("/users", (req, res) => {
  queryDb("SELECT * FROM users", [], res);
});
router.get("/users/:id", (req, res) => {
  queryDb("SELECT * FROM users WHERE user_id = ?", [req.params.id], res);
});

// ADMINS
router.get("/admins", (req, res) => {
  queryDb("SELECT * FROM admins", [], res);
});
router.get("/admins/:id", (req, res) => {
  queryDb("SELECT * FROM admins WHERE admin_id = ?", [req.params.id], res);
});

// MEDIA
router.get("/media", (req, res) => {
  queryDb("SELECT * FROM media", [], res);
});
router.get("/media/:id", (req, res) => {
  queryDb("SELECT * FROM media WHERE media_id = ?", [req.params.id], res);
});

// MOVIE
router.get("/movie", (req, res) => {
  queryDb("SELECT * FROM movie", [], res);
});
router.get("/movie/:id", (req, res) => {
  queryDb("SELECT * FROM movie WHERE movie_id = ?", [req.params.id], res);
});

// SERIES
router.get("/series", (req, res) => {
  queryDb("SELECT * FROM series", [], res);
});
router.get("/series/:id", (req, res) => {
  queryDb("SELECT * FROM series WHERE series_id = ?", [req.params.id], res);
});

// SEASON
router.get("/season", (req, res) => {
  queryDb("SELECT * FROM season", [], res);
});
router.get("/season/:id", (req, res) => {
  queryDb("SELECT * FROM season WHERE season_id = ?", [req.params.id], res);
});

// EPISODE
router.get("/episode", (req, res) => {
  queryDb("SELECT * FROM episode", [], res);
});
router.get("/episode/:id", (req, res) => {
  queryDb("SELECT * FROM episode WHERE episode_id = ?", [req.params.id], res);
});

// STUDIO
router.get("/studio", (req, res) => {
  queryDb("SELECT * FROM studio", [], res);
});
router.get("/studio/:id", (req, res) => {
  queryDb("SELECT * FROM studio WHERE studio_id = ?", [req.params.id], res);
});

// CREW
router.get("/crew", (req, res) => {
  queryDb("SELECT * FROM crew", [], res);
});
router.get("/crew/:id", (req, res) => {
  queryDb("SELECT * FROM crew WHERE crew_id = ?", [req.params.id], res);
});

// FEEDBACK
router.get("/feedback", (req, res) => {
  queryDb("SELECT * FROM feedback", [], res);
});
router.get("/feedback/:id", (req, res) => {
  queryDb("SELECT * FROM feedback WHERE feedback_id = ?", [req.params.id], res);
});

// GENRE
router.get("/genre", (req, res) => {
  queryDb("SELECT * FROM genre", [], res);
});
router.get("/genre/:id", (req, res) => {
  queryDb("SELECT * FROM genre WHERE genre_id = ?", [req.params.id], res);
});

// PAYMENT
router.get("/payment", (req, res) => {
  queryDb("SELECT * FROM payment", [], res);
});
router.get("/payment/:id", (req, res) => {
  queryDb("SELECT * FROM payment WHERE payment_id = ?", [req.params.id], res);
});

// SUBSCRIPTION PLAN
router.get("/subscription_plan", (req, res) => {
  queryDb("SELECT * FROM subscription_plan", [], res);
});
router.get("/subscription_plan/:id", (req, res) => {
  queryDb("SELECT * FROM subscription_plan WHERE plan_id = ?", [req.params.id], res);
});

// MEDIA COLLECTION
router.get("/media_collection", (req, res) => {
  queryDb("SELECT * FROM media_collection", [], res);
});
router.get("/media_collection/:id", (req, res) => {
  queryDb("SELECT * FROM media_collection WHERE collection_id = ?", [req.params.id], res);
});

// WATCHLIST
router.get("/watchlist", (req, res) => {
  queryDb("SELECT * FROM watchlist", [], res);
});
router.get("/watchlist/:id", (req, res) => {
  queryDb("SELECT * FROM watchlist WHERE watchlist_id = ?", [req.params.id], res);
});

// queries on relations

// LOGS
// get all log
router.get("/admin_log", (req, res) => {
  queryDb("SELECT * FROM admin_log", [], res);
});

// get logs of an admin
router.get("/admin_log/admin/:admin_id", (req, res) => {
  queryDb("SELECT * FROM admin_log WHERE admin_id = ?", [req.params.admin_id], res);
});

// COLLECTION MEDIA
// get all media in a collection
router.get("/collections/:collection_id/media", async (req, res) => {
  const collectionId = req.params.collection_id;
  const result = await db.query(
    `
    SELECT m.*
    FROM collection_media cm
    JOIN media m ON cm.media_id = m.media_id
    WHERE cm.collection_id = ?
    `,
    [collectionId]
  );
  res.json(result);
});

// get all collections containing a media
router.get("/media/:media_id/collections", async (req, res) => {
  const mediaId = req.params.media_id;
  const result = await db.query(
    `
    SELECT c.*
    FROM collection_media cm
    JOIN media_collection c ON cm.collection_id = c.collection_id
    WHERE cm.media_id = ?
    `,
    [mediaId]
  );
  res.json(result);
});

// WATCHLIST
// Get all media in a watchlist
router.get("/watchlists/:watchlist_id/media", async (req, res) => {
  const watchlistId = req.params.watchlist_id;
  const result = await db.query(
    `
    SELECT m.*
    FROM watchlist_media wm
    JOIN media m ON wm.media_id = m.media_id
    WHERE wm.watchlist_id = ?
    `,
    [watchlistId]
  );
  res.json(result);
});

// Get all watchlists containing a media
router.get("/media/:media_id/watchlists", async (req, res) => {
  const mediaId = req.params.media_id;
  const result = await db.query(
    `
    SELECT w.*
    FROM watchlist_media wm
    JOIN watchlist w ON wm.watchlist_id = w.watchlist_id
    WHERE wm.media_id = ?
    `,
    [mediaId]
  );
  res.json(result);
});

// WATCH HISTORY
// Get all watched media of a user
router.get("/users/:user_id/watch-history", async (req, res) => {
  const userId = req.params.user_id;
  const result = await db.query(
    `
    SELECT m.*
    FROM watch_history wh
    JOIN media m ON wh.media_id = m.media_id
    WHERE wh.user_id = ?
    `,
    [userId]
  );
  res.json(result);
});

// Get all users who watched a media
router.get("/media/:media_id/watch-history", async (req, res) => {
  const mediaId = req.params.media_id;
  const result = await db.query(
    `
    SELECT w.*, wh.progress, wh.last_seen
    FROM watch_history wh
    JOIN users w ON wh.user_id = w.user_id
    WHERE wh.media_id = ?
    `,
    [mediaId]
  );
  res.json(result);
});

// DISTRIBUTED BY
// Get all studios distributing a media
router.get("/media/:media_id/studios", async (req, res) => {
  const mediaId = req.params.media_id;
  const result = await db.query(
    `
    SELECT s.*
    FROM distributed_by db
    JOIN studio s ON db.studio_id = s.studio_id
    WHERE db.media_id = ?
    `,
    [mediaId]
  );
  res.json(result);
});

// Get all media distributed by a studio
router.get("/studios/:studio_id/media", async (req, res) => {
  const studioId = req.params.studio_id;
  const result = await db.query(
    `
    SELECT m.*
    FROM distributed_by db
    JOIN media m ON db.media_id = m.media_id
    WHERE db.studio_id = ?
    `,
    [studioId]
  );
  res.json(result);
});

// PREFERS
// Get all genres preferred by a user
router.get("/users/:user_id/genres", async (req, res) => {
  const userId = req.params.user_id;
  const result = await db.query(
    `
    SELECT g.*
    FROM prefers p
    JOIN genre g ON p.genre_id = g.genre_id
    WHERE p.user_id = ?
    `,
    [userId]
  );
  res.json(result);
});

// Get all users who prefer a genre
router.get("/genres/:genre_id/users", async (req, res) => {
  const genreId = req.params.genre_id;
  const result = await db.query(
    `
    SELECT u.*
    FROM prefers p
    JOIN users u ON p.user_id = u.user_id
    WHERE p.genre_id = ?
    `,
    [genreId]
  );
  res.json(result);
});

// CONTRIBUTIONS
// Get all contributions of a crew member
router.get("/crew/:crew_id/contributions", async (req, res) => {
  const crewId = req.params.crew_id;
  const result = await db.query(
    `
    SELECT m.*, con.crew_role
    FROM contribution con
    JOIN media m ON con.media_id = m.media_id
    WHERE con.crew_id = ?
    `,
    [crewId]
  );
  res.json(result);
});

// Get all crew contributions for a media
router.get("/media/:media_id/contributions", async (req, res) => {
  const mediaId = req.params.media_id;
  const result = await db.query(
    `
    SELECT c.*, con.crew_role
    FROM contribution con
    JOIN crew c ON con.crew_id = c.crew_id
    WHERE con.media_id = ?
    `,
    [mediaId]
  );
  res.json(result);
});

// REVIEWS
// Get all reviews by a user
router.get("/users/:user_id/reviews", async (req, res) => {
  const userId = req.params.user_id;
  const result = await db.query(
    `
    SELECT m.*, r.rating, r.review_desc, r.review_type
    FROM review r
    JOIN media m ON r.media_id = m.media_id
    WHERE r.user_id = ?
    `,
    [userId]
  );
  res.json(result);
});

// Get all reviews for a media
router.get("/media/:media_id/reviews", async (req, res) => {
  const mediaId = req.params.media_id;
  const result = await db.query(
    `
    SELECT u.*,  r.rating, r.review_desc, r.review_type
    FROM review r
    JOIN users u ON r.user_id = u.user_id
    WHERE r.media_id = ?
    `,
    [mediaId]
  );
  res.json(result);
});

// SUBSCRIPTIONS
router.get("/users/:user_id/subscriptions", async (req, res) => {
  const userId = req.params.user_id;
  const result = await db.query(
    `
    SELECT sp.*, p.*, s.start_date, s.end_date
    FROM subscription s
    JOIN payment p ON s.payment_id = p.payment_id
    JOIN subscription_plan sp ON s.plan_id = sp.plan_id
    WHERE s.user_id = ?`,
    [userId]
  );
  res.json(result);
});

router.get("/subscriptions/:plan_id/users", async (req, res) => {
  const planId = req.params.plan_id;
  const result = await db.query(
    `
    SELECT u.*, p.*, s.start_date, s.end_date
    FROM subscription s
    JOIN users u ON s.user_id = u.user_id
    JOIN payment p ON s.payment_id = p.payment_id
    WHERE s.plan_id = ?`,
    [planId]
  );
  res.json(result);
});

router.get("/payments/:payment_id/subscription", async (req, res) => {
  const paymentId = req.params.payment_id;
  const result = await db.query(
    `
    SELECT u.*, sp.*, s.start_date, s.end_date
    FROM subscription s
    JOIN users u ON s.user_id = u.user_id
    JOIN subscription_plan sp ON s.plan_id = sp.plan_id
    WHERE s.payment_id = ?`,
    [paymentId]
  );
  res.json(result);
});

export default router;
