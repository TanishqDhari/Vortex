DROP DATABASE IF EXISTS cinema;
CREATE DATABASE cinema;
USE cinema;

CREATE TABLE users(
	user_id int auto_increment,
    email varchar(255),
    fname varchar(255),
    lname varchar(255),
    login_type varchar(255),
    user_password varchar(100),
    dob date,
    primary key(user_id)
);

CREATE TABLE admins(
	admin_id int auto_increment,
    admin_status varchar(255),
    email varchar(255),
    f_name varchar(255),
    l_name varchar(255),
    login_type varchar(255),
    admin_password varchar(100),
    primary key(admin_id)
);

CREATE TABLE media(
	media_id int auto_increment,
    title varchar(255),
    release_date date,
    duration time,
    age_rating varchar(255),
    synopsis varchar(255),
    image varchar(255),
    licence_expire_date datetime,
    views int,
    primary key (media_id)
);

CREATE TABLE movie(
	movie_id int,
    file_link varchar(255),
    age_rating varchar(255),
    duration time,
    foreign key(movie_id) references media(media_id)
    on delete cascade
    on update cascade,
    primary key(movie_id)
);

CREATE TABLE series(
	series_id int,
    age_rating varchar(255),
    foreign key(series_id) references media(media_id)
    on delete cascade
    on update cascade,
    primary key(series_id)
);

CREATE TABLE season(
	season_id int,
    series_id int,
    season_no int,
    foreign key(season_id) references media(media_id)
    on delete cascade
    on update cascade,
    foreign key(series_id) references series(series_id)
    on delete cascade
    on update cascade,
    primary key(season_id)
);

CREATE TABLE episode(
	episode_id int,
    season_id int,
    episode_no int,
    file_link varchar(255),
    duration time,
    foreign key(episode_id) references media(media_id)
    on delete cascade
    on update cascade,
    foreign key(season_id) references season(season_id)
    on delete cascade
    on update cascade,
    primary key(episode_id)
);

CREATE TABLE studio(
	studio_id int auto_increment,
    studio_name varchar(255),
    studio_desc varchar(255),
    primary key(studio_id)
);

CREATE TABLE crew(
	crew_id int auto_increment,
    fname varchar(255),
    lname varchar(255),
    nationality varchar(255),
    crew_desc varchar(255),
    image varchar(255),
    dob date,
    primary key (crew_id)
);

CREATE TABLE feedback(
	feedback_id int auto_increment,
    given_by int,
    category varchar(10),
    feedback_desc varchar(255),
    post_date datetime,
    foreign key(given_by) references users(user_id)
    on delete cascade
    on update cascade,
    primary key(feedback_id)
);

CREATE TABLE genre(
	genre_id int auto_increment,
    title varchar(255),
    genre_desc varchar(255),
    color varchar(255),
    primary key(genre_id)
);

CREATE TABLE payment(
	payment_id int auto_increment,
    payment_amount int,
    parment_mode varchar(10),
    primary key(payment_id)
);

CREATE TABLE subscription_plan(
	plan_id int auto_increment,
    price int,
    billing_cycle  int,
    device_limit int,
    video_quality varchar(10),
    currency varchar(10),
    plan_name varchar(255),
    primary key(plan_id)
);

CREATE TABLE media_collection(
	collection_id int auto_increment,
    collection_name varchar(255),
    collection_desc varchar(255),
    primary key(collection_id)
);

CREATE TABLE watchlist (
	watchlist_id int auto_increment,
    created_by int,
    title varchar(150),
    watchlist_desc varchar(150),
    visibility boolean default false,
    foreign key (created_by) references users(user_id)
    on delete cascade
    on update cascade,
    primary key(watchlist_id)
);

CREATE TABLE collection_media(
	collection_id int,
    media_id int,
    foreign key(collection_id) references media_collection(collection_id),
    foreign key(media_id) references media(media_id),
    primary key(collection_id, media_id)
);
CREATE TABLE media_genre(
	media_id int,
    genre_id int,
    foreign key(media_id) references media(media_id),
    foreign key(genre_id) references genre(genre_id),
    primary key(media_id, genre_id)
);

CREATE TABLE watchlist_media (
    watchlist_id int not null,
    media_id int not null,
    foreign key (watchlist_id) references watchlist(watchlist_id)
    on delete cascade
    on update cascade,
    foreign key (media_id) references media(media_id)
    on delete cascade
    on update cascade,
    primary key(watchlist_id, media_id)
);

CREATE TABLE watch_history(
    user_id int,
    media_id int,
    progress varchar(20),
    last_seen datetime,
    foreign key(user_id) references users(user_id),
    foreign key(media_id) references media(media_id),
    primary key(user_id, media_id)
);

CREATE TABLE distributed_by(
    media_id int,
    studio_id int,
    foreign key(media_id) references media(media_id),
    foreign key(studio_id) references studio(studio_id),
    primary key(media_id, studio_id)
);

CREATE TABLE prefers(
	user_id int,
	genre_id int,
    primary key(user_id, genre_id)
);

CREATE TABLE trailer(
	trailer_id int auto_increment,
    media_id int,
    title varchar(255),
    url varchar(255),
    thumbnail varchar(255),
    primary key(trailer_id),
    foreign key(media_id) references media(media_id)
);

CREATE TABLE contribution(
	crew_id int,
    media_id int,
    crew_role varchar(255),
    foreign key(crew_id) references crew(crew_id),
    foreign key(media_id) references media(media_id),
    primary key(crew_id, media_id, crew_role)
);

CREATE TABLE review(
    media_id int,
    user_id int,
    rating int,
    review_desc varchar(255),
    review_type enum('liked', 'disliked'),
    foreign key(media_id) references media(media_id),
    foreign key(user_id) references users(user_id),
    primary key(media_id, user_id)
);

CREATE TABLE subscription(
    user_id int,
    plan_id int,
    payment_id int,
    start_date datetime,
    end_date datetime,
    foreign key(user_id) references users(user_id),
    foreign key(plan_id) references subscription_plan(plan_id),
    foreign key(payment_id) references payment(payment_id),
    primary key(user_id, plan_id,payment_id)
);

CREATE TABLE admin_log (
    log_id      int auto_increment,
    admin_id    int not null,
    media_id    int null,
    user_id     int null,
    operation_type   varchar(50) not null,
    operation_date datetime,
    foreign key (media_id) references media(media_id),
    foreign key (admin_id) references admins(admin_id),
    foreign key (user_id) references users(user_id),
    primary key(log_id)
);


-- users Table
INSERT INTO users (email, fname, lname, login_type, user_password, dob) VALUES
('john.doe@example.com', 'John', 'Doe', 'email', 'hashed_password_123', '1990-05-15'),
('jane.smith@example.com', 'Jane', 'Smith', 'google', 'google_auth_token', '1992-08-22'),
('alice.jones@example.com', 'Alice', 'Jones', 'email', 'hashed_password_456', '1985-11-30'),
('bob.brown@example.com', 'Bob', 'Brown', 'facebook', 'facebook_auth_token', '2000-01-20'),
('charlie.davis@example.com', 'Charlie', 'Davis', 'email', 'hashed_password_789', '1998-03-10');

-- admins Table
INSERT INTO admins (admin_status, email, f_name, l_name, login_type, admin_password) VALUES
('active', 'admin.one@cinema.com', 'Admin', 'One', 'email', 'secure_admin_pass_1'),
('active', 'super.admin@cinema.com', 'Super', 'Admin', 'email', 'secure_admin_pass_2');

-- studio Table
INSERT INTO studio (studio_name, studio_desc) VALUES
('Warner Bros.', 'An American film and entertainment studio.'),
('Universal Pictures', 'An American film studio owned by Comcast.'),
('Paramount Pictures', 'A major American film studio.'),
('A24', 'An American independent entertainment company.');

-- crew Table
INSERT INTO crew (fname, lname, nationality, crew_desc, image, dob) VALUES
('Christopher', 'Nolan', 'British', 'Film director, producer, and screenwriter.', '/images/crew/nolan.jpg', '1970-07-30'),
('Leonardo', 'DiCaprio', 'American', 'Actor and film producer.', '/images/crew/dicaprio.jpg', '1974-11-11'),
('Quentin', 'Tarantino', 'American', 'Film director, writer, and actor.', '/images/crew/tarantino.jpg', '1963-03-27'),
('Scarlett', 'Johansson', 'American', 'Actress and singer.', '/images/crew/johansson.jpg', '1984-11-22'),
('Hans', 'Zimmer', 'German', 'Film score composer.', '/images/crew/zimmer.jpg', '1957-09-12'),
('Greta', 'Gerwig', 'American', 'Actress, writer, and director.', '/images/crew/gerwig.jpg', '1983-08-04');

-- genre Table
INSERT INTO genre (title, genre_desc, color) VALUES
('Sci-Fi', 'Science fiction, dealing with imaginative concepts.', '#00AEEF'),
('Action', 'High energy, stunts, and adventure.', '#ED1C24'),
('Drama', 'Serious, plot-driven presentations.', '#F7941D'),
('Comedy', 'Light-hearted and humorous.', '#FFF200'),
('Thriller', 'Creates suspense, excitement, and anxiety.', '#662D91');

-- payment Table
INSERT INTO payment (payment_amount, parment_mode) VALUES
(499, 'card'),
(999, 'upi'),
(1499, 'netbanking'),
(499, 'upi'),
(99, 'card');

-- subscription_plan Table
INSERT INTO subscription_plan (price, billing_cycle, device_limit, video_quality, currency, plan_name) VALUES
(499, 30, 2, '1080p', 'INR', 'Premium'),
(999, 90, 4, '4K', 'INR', 'Family'),
(99, 30, 1, '720p', 'INR', 'Mobile');

-- media_collection Table
INSERT INTO media_collection (collection_name, collection_desc) VALUES
('Nolan Masterpieces', 'A collection of films directed by Christopher Nolan.'),
('Oscar Winners 2024', 'Best picture nominees and winners from the 2024 Oscars.'),
('Mind-Bending Movies', 'Movies that will make you think.');

-- media Table
-- Note: IDs 1-4 are movies, 5 is a series, 6 is a season, 7-8 are episodes, 9 is a series, 10 is a season
INSERT INTO media (media_id, title, release_date, duration, age_rating, synopsis, image, licence_expire_date, views) VALUES
(1, 'Inception', '2010-07-16', '02:28:00', 'PG-13', 'A thief who steals corporate secrets through dream-sharing technology.', '/images/media/inception.jpg', '2030-12-31 23:59:59', 1500000),
(2, 'The Dark Knight', '2008-07-18', '02:32:00', 'PG-13', 'Batman faces the Joker, a criminal mastermind.', '/images/media/dark_knight.jpg', '2029-12-31 23:59:59', 2500000),
(3, 'Pulp Fiction', '1994-10-14', '02:34:00', 'R', 'The lives of two mob hitmen, a boxer, a gangster and his wife.', '/images/media/pulp_fiction.jpg', '2028-12-31 23:59:59', 1800000),
(4, 'Forrest Gump', '1994-07-06', '02:22:00', 'PG-13', 'The life of a slow-witted but kind-hearted man.', '/images/media/forrest_gump.jpg', '2027-12-31 23:59:59', 3000000),
(5, 'Breaking Bad', '2008-01-20', NULL, 'TV-MA', 'A high school chemistry teacher turned methamphetamine manufacturer.', '/images/media/breaking_bad.jpg', '2035-12-31 23:59:59', 5000000),
(6, 'Breaking Bad - Season 1', '2008-01-20', NULL, 'TV-MA', 'Season 1 of Breaking Bad.', '/images/media/bb_s1.jpg', '2035-12-31 23:59:59', 4500000),
(7, 'Pilot', '2008-01-20', '00:58:00', 'TV-MA', 'The first episode of Breaking Bad.', '/images/media/bb_s1e1.jpg', '2035-12-31 23:59:59', 4800000),
(8, 'Cat''s in the Bag...', '2008-01-27', '00:48:00', 'TV-MA', 'The second episode of Breaking Bad.', '/images/media/bb_s1e2.jpg', '2035-12-31 23:59:59', 4600000),
(9, 'Stranger Things', '2016-07-15', NULL, 'TV-14', 'A group of kids uncover supernatural mysteries in their small town.', '/images/media/stranger_things.jpg', '2040-12-31 23:59:59', 6000000),
(10, 'Stranger Things - Season 1', '2016-07-15', NULL, 'TV-14', 'Season 1 of Stranger Things.', '/images/media/st_s1.jpg', '2040-12-31 23:59:59', 5800000);

-- =============================================
-- POPULATE DEPENDENT TABLES (LEVEL 1)
-- =============================================

-- movie Table
INSERT INTO movie (movie_id, file_link, age_rating, duration) VALUES
(1, '/media/movies/inception.mp4', 'PG-13', '02:28:00'),
(2, '/media/movies/dark_knight.mp4', 'PG-13', '02:32:00'),
(3, '/media/movies/pulp_fiction.mp4', 'R', '02:34:00'),
(4, '/media/movies/forrest_gump.mp4', 'PG-13', '02:22:00');

-- series Table
INSERT INTO series (series_id, age_rating) VALUES
(5, 'TV-MA'),
(9, 'TV-14');

-- feedback Table
INSERT INTO feedback (given_by, category, feedback_desc, post_date) VALUES
(1, 'UI', 'The new user interface is a bit confusing.', '2025-10-06 07:10:00'),
(2, 'Bug', 'The video player crashes on my device.', '2025-10-05 15:30:00'),
(3, 'Feature', 'Please add a feature to download series for offline viewing.', '2025-10-04 12:00:00');

-- watchlist Table
INSERT INTO watchlist (created_by, title, watchlist_desc, visibility) VALUES
(1, 'My Favorites', 'A list of my all-time favorite movies.', true),
(2, 'To Watch', 'Movies and series I plan to watch soon.', false);

-- trailer Table
INSERT INTO trailer (media_id, title, url, thumbnail) VALUES
(1, 'Inception - Official Trailer', 'https://www.youtube.com/watch?v=YoHD9XEInc0', '/images/trailers/inception_thumb.jpg'),
(2, 'The Dark Knight - Official Trailer', 'https://www.youtube.com/watch?v=EXeTwQWrcwY', '/images/trailers/dk_thumb.jpg'),
(5, 'Breaking Bad - Series Trailer', 'https://www.youtube.com/watch?v=HhesaQXLuRY', '/images/trailers/bb_thumb.jpg'),
(9, 'Stranger Things - Season 1 Trailer', 'https://www.youtube.com/watch?v=b9EkMc79ZSU', '/images/trailers/st_thumb.jpg');


-- =============================================
-- POPULATE DEPENDENT TABLES (LEVEL 2)
-- =============================================

-- season Table
INSERT INTO season (season_id, series_id, season_no) VALUES
(6, 5, 1),
(10, 9, 1);

-- review Table
INSERT INTO review (media_id, user_id, rating, review_desc, review_type) VALUES
(1, 1, 10, 'Absolute masterpiece! The best movie I have ever seen.', 'liked'),
(1, 2, 9, 'Complex but rewarding. Worth a second watch.', 'liked'),
(2, 3, 10, 'Heath Ledger was phenomenal as the Joker.', 'liked'),
(5, 4, 8, 'Great series, very addictive from the start.', 'liked'),
(3, 1, 7, 'A bit too violent for my taste, but well-made.', 'disliked');

-- subscription Table
INSERT INTO subscription (user_id, plan_id, payment_id, start_date, end_date) VALUES
(1, 1, 1, '2025-09-15 10:00:00', '2025-10-15 10:00:00'),
(2, 2, 2, '2025-08-01 12:00:00', '2025-11-01 12:00:00'),
(3, 3, 5, '2025-10-01 18:00:00', '2025-11-01 18:00:00');

-- admin_log Table
INSERT INTO admin_log (admin_id, media_id, user_id, operation_type, operation_date) VALUES
(1, 1, NULL, 'ADD_MEDIA', '2025-01-10 09:00:00'),
(1, 3, NULL, 'UPDATE_MEDIA_SYNOPSIS', '2025-02-15 11:30:00'),
(2, NULL, 4, 'SUSPEND_USER_ACCOUNT', '2025-03-20 14:00:00');

-- watch_history Table
INSERT INTO watch_history (user_id, media_id, progress, last_seen) VALUES
(1, 1, '01:14:30', '2025-10-05 22:10:00'),
(1, 7, 'COMPLETED', '2025-10-04 20:30:00'),
(2, 2, '00:45:10', '2025-10-06 01:15:00');

-- =============================================
-- POPULATE JUNCTION TABLES (MANY-TO-MANY)
-- =============================================

-- distributed_by Table
INSERT INTO distributed_by (media_id, studio_id) VALUES
(1, 1),
(2, 1),
(3, 3),
(4, 3),
(9, 4);

-- prefers Table
INSERT INTO prefers (user_id, genre_id) VALUES
(1, 1), -- John prefers Sci-Fi
(1, 5), -- John prefers Thriller
(2, 3), -- Jane prefers Drama
(3, 4); -- Alice prefers Comedy

-- media_genre Table
INSERT INTO media_genre (media_id, genre_id) VALUES
(1, 1), (1, 2), (1, 5), -- Inception: Sci-Fi, Action, Thriller
(2, 2), (2, 3), -- The Dark Knight: Action, Drama
(3, 3), (3, 5), -- Pulp Fiction: Drama, Thriller
(4, 3), -- Forrest Gump: Drama
(5, 3), (5, 5), -- Breaking Bad: Drama, Thriller
(9, 1), (9, 3), (9, 5); -- Stranger Things: Sci-Fi, Drama, Thriller

-- collection_media Table
INSERT INTO collection_media (collection_id, media_id) VALUES
(1, 1), -- Nolan Masterpieces: Inception
(1, 2), -- Nolan Masterpieces: The Dark Knight
(3, 1); -- Mind-Bending Movies: Inception

-- watchlist_media Table
INSERT INTO watchlist_media (watchlist_id, media_id) VALUES
(1, 1), -- My Favorites: Inception
(1, 2), -- My Favorites: The Dark Knight
(2, 3), -- To Watch: Pulp Fiction
(2, 5); -- To Watch: Breaking Bad

-- contribution Table
INSERT INTO contribution (crew_id, media_id, crew_role) VALUES
(1, 1, 'Director'),
(1, 1, 'Writer'),
(1, 2, 'Director'),
(2, 1, 'Actor'),
(3, 3, 'Director'),
(3, 3, 'Writer'),
(5, 1, 'Composer'),
(5, 2, 'Composer'),
(4, 2, 'Actor'); -- Not accurate (Black Widow in Dark Knight), but for data diversity

-- =============================================
-- POPULATE DEPENDENT TABLES (LEVEL 3)
-- =============================================

-- episode Table
INSERT INTO episode (episode_id, season_id, episode_no, file_link, duration) VALUES
(7, 6, 1, '/media/series/bb/s01e01.mp4', '00:58:00'),
(8, 6, 2, '/media/series/bb/s01e02.mp4', '00:48:00');