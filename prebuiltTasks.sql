CREATE TABLE tasks (
id serial PRIMARY KEY,
task varchar(200),
due date,
completed boolean
);

INSERT INTO "tasks" ("task", "due", "completed")
VALUES ('Take out trash', '2017-10-20', false),
('Wash Dishes', '2017-10-19', true),
('Clean out car', '2017-10-21', true),
('Go out to dinner with in-laws', '2017-5-18', false),
('Vacation!', '2017-12-20', false), ('Drag race buddies', '2017-6-29', false), 
('Buy girlfriend present', '2017-8-30', true), 
('Oil change', '2017-5-26', true), ('Buy drone', '2017-10-22', false), 
('Star Gazing', '2017-9-30', true), 
('Buy Christmas Gifts', '2017-12-20', false);