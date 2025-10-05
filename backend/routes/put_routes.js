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
router.put("/users/:id", (req, res) => {
  const { email, fname, lname, login_type, user_password, dob } = req.body;
  queryDb(
    "UPDATE users SET email = ?, fname = ?, lname = ?, login_type = ?, user_password = ?, dob = ? WHERE user_id = ?",
    [email, fname, lname, login_type, user_password, dob, req.params.id],
    res
  );
});

// ADMINS
router.put("/admins/:id", (req, res) => {
  const { admin_status, email, f_name, l_name, login_type, admin_password } = req.body;
  queryDb(
    "UPDATE admins SET admin_status = ?, email = ?, f_name = ?, l_name = ?, login_type = ?, admin_password = ? WHERE admin_id = ?",
    [admin_status, email, f_name, l_name, login_type, admin_password, req.params.id],
    res
  );
});

// MEDIA
router.put("/media/:id", (req, res) => {
  const { views, title, media_desc, licence_expire_date } = req.body;
  queryDb(
    "UPDATE media SET views = ?, title = ?, media_desc = ?, licence_expire_date = ? WHERE media_id = ?",
    [views, title, media_desc, licence_expire_date, req.params.id],
    res
  );
});

// MOVIE
router.put("/movies/:id", (req, res) => {
  const { file_link, age_rating, duration } = req.body;
  queryDb(
    "UPDATE movie SET file_link = ?, age_rating = ?, duration = ? WHERE movie_id = ?",
    [file_link, age_rating, duration, req.params.id],
    res
  );
});

// SERIES
router.put("/series/:id", (req, res) => {
  const { age_rating } = req.body;
  queryDb("UPDATE series SET age_rating = ? WHERE series_id = ?", [age_rating, req.params.id], res);
});

// SEASON
router.put("/season/:id", (req, res) => {
  const { series_id, season_no } = req.body;
  queryDb(
    "UPDATE season SET series_id = ?, season_no = ? WHERE season_id = ?",
    [series_id, season_no, req.params.id],
    res
  );
});

// EPISODE
router.put("/episode/:id", (req, res) => {
  const { season_id, episode_no, file_link, duration } = req.body;
  queryDb(
    "UPDATE episode SET season_id = ?, episode_no = ?, file_link = ?, duration = ? WHERE episode_id = ?",
    [season_id, episode_no, file_link, duration, req.params.id],
    res
  );
});

// STUDIO
router.put("/studio/:id", (req, res) => {
  const { studio_name, studio_desc } = req.body;
  queryDb(
    "UPDATE studio SET studio_name = ?, studio_desc = ? WHERE studio_id = ?",
    [studio_name, studio_desc, req.params.id],
    res
  );
});

// CREW
router.put("/crew/:id", (req, res) => {
  const { fname, lname, nationality, crew_desc, image_link, dob } = req.body;
  queryDb(
    "UPDATE crew SET fname = ?, lname = ?, nationality = ?, crew_desc = ?, image_link = ?, dob = ? WHERE crew_id = ?",
    [fname, lname, nationality, crew_desc, image_link, dob, req.params.id],
    res
  );
});

// FEEDBACK
router.put("/feedback/:id", (req, res) => {
  const { given_by, category, feedback_desc, post_date } = req.body;
  queryDb(
    "UPDATE feedback SET given_by = ?, category = ?, feedback_desc = ?, post_date = ? WHERE feedback_id = ?",
    [given_by, category, feedback_desc, post_date, req.params.id],
    res
  );
});

// GENRE
router.put("/genre/:id", (req, res) => {
  const { title } = req.body;
  queryDb("UPDATE genre SET title = ? WHERE genre_id = ?", [title, req.params.id], res);
});

// PAYMENT
router.put("/payment/:id", (req, res) => {
  const { payment_amount, parment_mode } = req.body;
  queryDb(
    "UPDATE payment SET payment_amount = ?, parment_mode = ? WHERE payment_id = ?",
    [payment_amount, parment_mode, req.params.id],
    res
  );
});

// SUBSCRIPTION PLAN
router.put("/subscription_plan/:id", (req, res) => {
  const { price, billing_cycle, device_limit, video_quality, currency, plan_name } = req.body;
  queryDb(
    "UPDATE subscription_plan SET price = ?, billing_cycle = ?, device_limit = ?, video_quality = ?, currency = ?, plan_name = ? WHERE plan_id = ?",
    [price, billing_cycle, device_limit, video_quality, currency, plan_name, req.params.id],
    res
  );
});

// MEDIA COLLECTION
router.put("/media_collection/:id", (req, res) => {
  const { collection_name, collection_desc } = req.body;
  queryDb(
    "UPDATE media_collection SET collection_name = ?, collection_desc = ? WHERE collection_id = ?",
    [collection_name, collection_desc, req.params.id],
    res
  );
});

// WATCHLIST
router.put("/watchlist/:id", (req, res) => {
  const { created_by, title, watchlist_desc, visibility } = req.body;
  queryDb(
    "UPDATE watchlist SET created_by = ?, title = ?, watchlist_desc = ?, visibility = ? WHERE watchlist_id = ?",
    [created_by, title, watchlist_desc, visibility, req.params.id],
    res
  );
});

// WATCH HISTORY
router.put("/watch_history/:user_id/:media_id", (req, res) => {
  const { progress, last_seen } = req.body;
  queryDb(
    "UPDATE watch_history SET progress = ?, last_seen = ? WHERE user_id = ? AND media_id = ?",
    [progress, last_seen, req.params.user_id, req.params.media_id],
    res
  );
});

// SUBSCRIPTION
router.put("/subscription/:user_id/:plan_id/:payment_id", (req, res) => {
  const { start_date, end_date } = req.body;
  queryDb(
    "UPDATE subscription SET start_date = ?, end_date = ? WHERE user_id = ? AND plan_id = ? AND payment_id = ?",
    [start_date, end_date, req.params.user_id, req.params.plan_id, req.params.payment_id],
    res
  );
});

// REVIEW
router.put("/review/:media_id/:user_id", (req, res) => {
  const { rating, review_desc, review_type } = req.body;
  queryDb(
    "UPDATE review SET rating = ?, review_desc = ?, review_type = ? WHERE media_id = ? AND user_id = ?",
    [rating, review_desc, review_type, req.params.media_id, req.params.user_id],
    res
  );
});

export default router;