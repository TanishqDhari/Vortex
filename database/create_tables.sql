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