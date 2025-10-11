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

