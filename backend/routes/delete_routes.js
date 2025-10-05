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
router.delete("/users/:id", (req, res) => {
  queryDb("DELETE FROM users WHERE user_id = ?", [req.params.id], res);
});

// ADMINS
router.delete("/admins/:id", (req, res) => {
  queryDb("DELETE FROM admins WHERE admin_id = ?", [req.params.id], res);
});

// MEDIA
router.delete("/media/:id", (req, res) => {
  queryDb("DELETE FROM media WHERE media_id = ?", [req.params.id], res);
});

// MOVIE
router.delete("/movies/:id", (req, res) => {
  queryDb("DELETE FROM movie WHERE movie_id = ?", [req.params.id], res);
});

// SERIES
router.delete("/series/:id", (req, res) => {
  queryDb("DELETE FROM series WHERE series_id = ?", [req.params.id], res);
});

// SEASON
router.delete("/season/:id", (req, res) => {
  queryDb("DELETE FROM season WHERE season_id = ?", [req.params.id], res);
});

// EPISODE
router.delete("/episode/:id", (req, res) => {
  queryDb("DELETE FROM episode WHERE episode_id = ?", [req.params.id], res);
});

// STUDIO
router.delete("/studio/:id", (req, res) => {
  queryDb("DELETE FROM studio WHERE studio_id = ?", [req.params.id], res);
});

// CREW
router.delete("/crew/:id", (req, res) => {
  queryDb("DELETE FROM crew WHERE crew_id = ?", [req.params.id], res);
});

// FEEDBACK
router.delete("/feedback/:id", (req, res) => {
  queryDb("DELETE FROM feedback WHERE feedback_id = ?", [req.params.id], res);
});

// GENRE
router.delete("/genre/:id", (req, res) => {
  queryDb("DELETE FROM genre WHERE genre_id = ?", [req.params.id], res);
});

// PAYMENT
router.delete("/payment/:id", (req, res) => {
  queryDb("DELETE FROM payment WHERE payment_id = ?", [req.params.id], res);
});

// SUBSCRIPTION PLAN
router.delete("/subscription_plan/:id", (req, res) => {
  queryDb("DELETE FROM subscription_plan WHERE plan_id = ?", [req.params.id], res);
});

// MEDIA COLLECTION
router.delete("/media_collection/:id", (req, res) => {
  queryDb("DELETE FROM media_collection WHERE collection_id = ?", [req.params.id], res);
});

// WATCHLIST
router.delete("/watchlist/:id", (req, res) => {
  queryDb("DELETE FROM watchlist WHERE watchlist_id = ?", [req.params.id], res);
});

// LOGS
router.delete("/admin_log/:log_id", (req, res) => {
  queryDb("DELETE FROM admin_log WHERE log_id = ?", [req.params.log_id], res);
});

// COLLECTION MEDIA
router.delete("/collection_media/:collection_id/:media_id", (req, res) => {
  queryDb(
    "DELETE FROM collection_media WHERE collection_id = ? AND media_id = ?",
    [req.params.collection_id, req.params.media_id],
    res
  );
});

// WATCHLIST MEDIA
router.delete("/watchlist_media/:watchlist_id/:media_id", (req, res) => {
  queryDb(
    "DELETE FROM watchlist_media WHERE watchlist_id = ? AND media_id = ?",
    [req.params.watchlist_id, req.params.media_id],
    res
  );
});

// WATCH HISTORY
router.post("/watch_history", (req, res) => {
  const { user_id, media_id, progress, last_seen } = req.body;
  queryDb(
    "INSERT INTO watch_history (user_id, media_id, progress, last_seen) VALUES (?, ?, ?, ?)",
    [user_id, media_id, progress, last_seen],
    res
  );
});

// DISTRIBUTED BY
router.delete("/distributed_by/:media_id/:studio_id", (req, res) => {
  queryDb(
    "DELETE FROM distributed_by WHERE media_id = ? AND studio_id = ?",
    [req.params.media_id, req.params.studio_id],
    res
  );
});

// PREFERS
router.delete("/prefers/:user_id/:genre_id", (req, res) => {
  queryDb("DELETE FROM prefers WHERE user_id = ? AND genre_id = ?", [req.params.user_id, req.params.genre_id], res);
});

// CONTRIBUTION
router.delete("/contribution/:crew_id/:media_id/:crew_role", (req, res) => {
  queryDb(
    "DELETE FROM contribution WHERE crew_id = ? AND media_id = ? AND crew_role = ?",
    [req.params.crew_id, req.params.media_id, req.params.crew_role],
    res
  );
});

// SUBSCRIPTION
router.delete("/subscription/:user_id/:plan_id/:payment_id", (req, res) => {
  queryDb(
    "DELETE FROM subscription WHERE user_id = ? AND plan_id = ? AND payment_id = ?",
    [req.params.user_id, req.params.plan_id, req.params.payment_id],
    res
  );
});

// REVIEW
router.delete("/review/:media_id/:user_id", (req, res) => {
  queryDb("DELETE FROM review WHERE media_id = ? AND user_id = ?", [req.params.media_id, req.params.user_id], res);
});

export default router;
