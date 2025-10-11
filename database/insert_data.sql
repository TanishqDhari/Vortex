INSERT INTO users (email, fname, lname, login_type, user_password, dob) VALUES
('anshu@.com', 'anshu', 'kumar', 'email', 'password', '2006-03-30'),
('bruce.wayne@example.com', 'Bruce', 'Wayne', 'email', 'batman123', '1985-02-19'),
('arthur.curry@example.com', 'Arthur', 'Curry', 'email', 'atlantis456', '1990-07-13'),
('clark.kent@example.com', 'Clark', 'Kent', 'email', 'superman789', '1988-06-18'),
('diana.prince@example.com', 'Diana', 'Prince', 'email', 'wonderwoman000', '1992-03-30');

INSERT INTO media (title, release_date, duration, synopsis, image) VALUES
('The Dark Knight', '2008-07-18 00:00:00', '02:32:00', 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham...', '/dark-knight-poster.png'),
('Inception', '2010-07-16 00:00:00', '02:28:00', 'A thief who steals corporate secrets through dream-sharing technology...', '/inception-movie-poster.png'),
('Interstellar', '2014-11-07 00:00:00', '02:49:00', 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity''s survival...', '/interstellar-movie-poster.jpg');

INSERT INTO genre (title, genre_desc) VALUES
('Action', 'High-octane thrills'),
('Adventure', 'Adrenaline-pumping adventures'),
('Comedy', 'Laugh-out-loud moments and feel-good entertainment'),
('Drama', 'Compelling stories and emotional journeys'),
('Horror', 'Spine-chilling scares and supernatural thrills'),
('Romance', 'Love stories and heartwarming relationships'),
('Sci-Fi', 'Futuristic worlds and technological wonders'),
('Thriller', 'Edge-of-your-seat suspense and mystery'),
('Documentary', 'Real stories and educational content');


-- The Dark Knight (id = 1)
INSERT INTO media_genre (media_id, genre_id)
VALUES
(1, 1),  -- Action
(1, 8),  -- Thriller
(1, 3);  -- Drama

-- Inception (id = 2)
INSERT INTO media_genre (media_id, genre_id)
VALUES
(2, 1),  -- Action
(2, 7),  -- Sci-Fi
(2, 8);  -- Thriller

-- Interstellar (id = 3)
INSERT INTO media_genre (media_id, genre_id)
VALUES
(3, 2),  -- Adventure
(3, 4),  -- Drama
(3, 7);  -- Sci-Fi

INSERT INTO review (media_id, user_id, rating, review_desc, review_type) VALUES
(1, 1, 10, 'One of the best superhero movies ever made. Heath Ledger was phenomenal.', 'liked'),
(1, 2, 9, 'Dark, intense, and masterfully directed by Nolan.', 'liked'),
(1, 3, 9, 'Great performances and story, though a bit long.', 'liked');

INSERT INTO review (media_id, user_id, rating, review_desc, review_type) VALUES
(2, 1, 9, 'Mind-bending visuals and brilliant concept.', 'liked'),
(2, 2, 8, 'Took a few watches to understand, but loved it.', 'liked'),
(2, 3, 6, 'Visually stunning but confusing plot.', 'disliked');

INSERT INTO review (media_id, user_id, rating, review_desc, review_type) VALUES
(3, 1, 9, 'A beautiful story about time, love, and space.', 'liked'),
(3, 2, 7, 'Great music and visuals, but pacing felt slow.', 'liked'),
(3, 3, 10, 'Incredible emotional depth and cinematography.', 'liked');
