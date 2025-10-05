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
router.post("/users", (req, res) => {
  const { email, fname, lname, login_type, user_password, dob } = req.body;
  queryDb(
    "INSERT INTO users (email, fname, lname, login_type, user_password, dob) VALUES (?, ?, ?, ?, ?, ?)",
    [email, fname, lname, login_type, user_password, dob],
    res
  );
});

// ADMINS
router.post("/admins", (req, res) => {
  const { admin_status, email, f_name, l_name, login_type, admin_password } = req.body;
  queryDb(
    "INSERT INTO admins (admin_status, email, f_name, l_name, login_type, admin_password) VALUES (?, ?, ?, ?, ?, ?)",
    [admin_status, email, f_name, l_name, login_type, admin_password],
    res
  );
});

// MEDIA
router.post("/media", (req, res) => {
  const { media_id, views, title, media_desc, licence_expire_date } = req.body;
  queryDb(
    "INSERT INTO media (media_id, views, title, media_desc, licence_expire_date) VALUES (?, ?, ?, ?, ?)",
    [media_id, views, title, media_desc, licence_expire_date],
    res
  );
});

// MOVIE
router.post("/movie", (req, res) => {
  const { movie_id, file_link, age_rating, duration } = req.body;
  queryDb(
    "INSERT INTO movie (movie_id, file_link, age_rating, duration) VALUES (?, ?, ?, ?)",
    [movie_id, file_link, age_rating, duration],
    res
  );
});

// SERIES
router.post("/series", (req, res) => {
  const { series_id, age_rating } = req.body;
  queryDb("INSERT INTO series (series_id, age_rating) VALUES (?, ?)", [series_id, age_rating], res);
});

// SEASON
router.post("/season", (req, res) => {
  const { season_id, series_id, season_no } = req.body;
  queryDb(
    "INSERT INTO season (season_id, series_id, season_no) VALUES (?, ?, ?)",
    [season_id, series_id, season_no],
    res
  );
});

// EPISODE
router.post("/episode", (req, res) => {
  const { episode_id, season_id, episode_no, file_link, duration } = req.body;
  queryDb(
    "INSERT INTO episode (episode_id, season_id, episode_no, file_link, duration) VALUES (?, ?, ?, ?, ?)",
    [episode_id, season_id, episode_no, file_link, duration],
    res
  );
});

// STUDIO
router.post("/studio", (req, res) => {
  const { studio_name, studio_desc } = req.body;
  queryDb("INSERT INTO studio (studio_name, studio_desc) VALUES (?, ?)", [studio_name, studio_desc], res);
});

// CREW
router.post("/crew", (req, res) => {
  const { fname, lname, nationality, crew_desc, image_link, dob } = req.body;
  queryDb(
    "INSERT INTO crew (fname, lname, nationality, crew_desc, image_link, dob) VALUES (?, ?, ?, ?, ?, ?)",
    [fname, lname, nationality, crew_desc, image_link, dob],
    res
  );
});

// FEEDBACK
router.post("/feedback", (req, res) => {
  const { given_by, category, feedback_desc, post_date } = req.body;
  queryDb(
    "INSERT INTO feedback (given_by, category, feedback_desc, post_date) VALUES (?, ?, ?, ?)",
    [given_by, category, feedback_desc, post_date],
    res
  );
});

// GENRE
router.post("/genre", (req, res) => {
  const { title } = req.body;
  queryDb("INSERT INTO genre (title) VALUES (?)", [title], res);
});

// PAYMENT
router.post("/payment", (req, res) => {
  const { payment_amount, parment_mode } = req.body;
  queryDb("INSERT INTO payment (payment_amount, parment_mode) VALUES (?, ?)", [payment_amount, parment_mode], res);
});

// SUBSCRIPTION PLAN
router.post("/subscription_plan", (req, res) => {
  const { price, billing_cycle, device_limit, video_quality, currency, plan_name } = req.body;
  queryDb(
    "INSERT INTO subscription_plan (price, billing_cycle, device_limit, video_quality, currency, plan_name) VALUES (?, ?, ?, ?, ?, ?)",
    [price, billing_cycle, device_limit, video_quality, currency, plan_name],
    res
  );
});

// MEDIA COLLECTION
router.post("/media_collection", (req, res) => {
  const { collection_name, collection_desc } = req.body;
  queryDb(
    "INSERT INTO media_collection (collection_name, collection_desc) VALUES (?, ?)",
    [collection_name, collection_desc],
    res
  );
});

// WATCHLIST
router.post("/watchlist", (req, res) => {
  const { created_by, title, watchlist_desc, visibility } = req.body;
  queryDb(
    "INSERT INTO watchlist (created_by, title, watchlist_desc, visibility) VALUES (?, ?, ?, ?)",
    [created_by, title, watchlist_desc, visibility],
    res
  );
});


// LOGS
router.post("/admin_log", (req, res) => {
  const { admin_id, media_id, user_id, operation_type, operation_date } = req.body;
  queryDb(
    "INSERT INTO admin_log (admin_id, media_id, user_id, operation_type, operation_date) VALUES (?, ?, ?, ?, ?)",
    [admin_id, media_id || null, user_id || null, operation_type, operation_date],
    res
  );
});

// COLLECTION MEDIA
router.post("/collection_media", (req, res) => {
  const { collection_id, media_id } = req.body;
  queryDb("INSERT INTO collection_media (collection_id, media_id) VALUES (?, ?)", [collection_id, media_id], res);
});

// WATCHLIST MEDIA
router.post("/watchlist_media", (req, res) => {
  const { watchlist_id, media_id } = req.body;
  queryDb("INSERT INTO watchlist_media (watchlist_id, media_id) VALUES (?, ?)", [watchlist_id, media_id], res);
});

// WATCH HISTORY
router.delete("/watch_history/:user_id/:media_id", (req, res) => {
  queryDb(
    "DELETE FROM watch_history WHERE user_id = ? AND media_id = ?",
    [req.params.user_id, req.params.media_id],
    res
  );
});

// DISTRIBUTED BY
router.post("/distributed_by", (req, res) => {
  const { media_id, studio_id } = req.body;
  queryDb(
    "INSERT INTO distributed_by (media_id, studio_id) VALUES (?, ?)",
    [media_id, studio_id],
    res
  );
});

// PREFERS
router.post("/prefers", (req, res) => {
  const { user_id, genre_id } = req.body;
  queryDb("INSERT INTO prefers (user_id, genre_id) VALUES (?, ?)", [user_id, genre_id], res);
});

// CONTRIBUTION
router.post("/contribution", (req, res) => {
  const { crew_id, media_id, crew_role } = req.body;
  queryDb(
    "INSERT INTO contribution (crew_id, media_id, crew_role) VALUES (?, ?, ?)",
    [crew_id, media_id, crew_role],
    res
  );
});

// SUBSCRIPTION
router.post("/subscription", (req, res) => {
  const { user_id, plan_id, payment_id, start_date, end_date } = req.body;
  queryDb(
    "INSERT INTO subscription (user_id, plan_id, payment_id, start_date, end_date) VALUES (?, ?, ?, ?, ?)",
    [user_id, plan_id, payment_id, start_date, end_date],
    res
  );
});

// REVIEW
router.post("/review", (req, res) => {
  const { media_id, user_id, rating, review_desc, review_type } = req.body;
  queryDb(
    "INSERT INTO review (media_id, user_id, rating, review_desc, review_type) VALUES (?, ?, ?, ?, ?)",
    [media_id, user_id, rating, review_desc, review_type],
    res
  );
});


export default router;
