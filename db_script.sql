DROP SCHEMA savingjim CASCADE;

CREATE SCHEMA savingjim;

/* 
account_type
0 = admin ->  1 admin db
1 = worker -> 2 worker db
2 = person_of_contact -> 3 contacts db
3 = child -> 3 children db
 */

CREATE TABLE IF NOT EXISTS savingjim.users(
    id serial PRIMARY KEY NOT NULL,
    account_type INTEGER NOT NULL,
    first_name VARCHAR(70) NOT NULL,
    last_name VARCHAR(70) NOT NULL,
    username VARCHAR(70) NOT NULL UNIQUE,
    password VARCHAR(60) NOT NULL,
    active BOOLEAN NOT NULL,
    modified_on TIMESTAMP,
    modified_by INTEGER,
    version INTEGER,
    FOREIGN KEY (modified_by) REFERENCES savingjim.users (id)
);

/* 
dominant_hand
0 = right-handed
1 = left-handed
2 = ambidextrous
3 = adominant

school
0 = normal
1 = specialized
2 = integration
*/
CREATE TABLE IF NOT EXISTS savingjim.children(
    id SERIAL PRIMARY KEY,
    account_id INTEGER,
    birth_date DATE,
    language VARCHAR(30),
    dominant_hand INTEGER,
    school INTEGER,
    school_type VARCHAR(60),
    current_school_degree VARCHAR(60),
    visual_difficulty BOOLEAN,
    no_visual BOOLEAN,
    hearing_difficulty BOOLEAN,
    no_hearing BOOLEAN,
    movement_difficulty BOOLEAN,
    md_right BOOLEAN,
    md_left BOOLEAN,
    md_both BOOLEAN,
    no_movement_hands BOOLEAN,
    nmh_right BOOLEAN,
    nmh_left BOOLEAN,
    nmh_both BOOLEAN,
    communication_difficulty BOOLEAN,
    no_communication BOOLEAN,
    hearing_comprehension_difficulty BOOLEAN,
    game_flow_comprehension_difficulty BOOLEAN,
    space_awarness_difficulty BOOLEAN,
    other VARCHAR(300),
    modified_by INTEGER,
    modified_on TIMESTAMP,
    version INTEGER,
    FOREIGN KEY (account_id) REFERENCES savingjim.users (id),
    FOREIGN KEY (modified_by) REFERENCES savingjim.users (id)
);

CREATE TABLE IF NOT EXISTS savingjim.persons_of_contact(
	id SERIAL PRIMARY KEY,
    account_id INTEGER NOT NULL,
    child_id INTEGER NOT NULL,
    phone_number VARCHAR(20),
    email_address VARCHAR(120),
    relation_to_child VARCHAR(30) NOT NULL,
    modified_by INTEGER,
    modified_on TIMESTAMP,
    version INTEGER,
    FOREIGN KEY (account_id) REFERENCES savingjim.users (id),
    FOREIGN KEY (child_id) REFERENCES savingjim.users (id),
    FOREIGN KEY (modified_by) REFERENCES savingjim.users (id)
);

CREATE TABLE IF NOT EXISTS savingjim.workers_to_children(
    id SERIAL PRIMARY KEY,
    account_id INTEGER NOT NULL,
    child_id INTEGER NOT NULL,
    modified_by INTEGER,
    modified_on TIMESTAMP,
    version INTEGER,
    FOREIGN KEY (account_id) REFERENCES savingjim.users (id),
    FOREIGN KEY (child_id) REFERENCES savingjim.users (id),
    FOREIGN KEY (modified_by) REFERENCES savingjim.users (id)
);

CREATE TABLE IF NOT EXISTS savingjim.games_history(
    id SERIAL PRIMARY KEY,
    worker_id INTEGER NOT NULL,
    child_id INTEGER NOT NULL,
    date DATE,
    data json,
    modified_by INTEGER,
    modified_on TIMESTAMP,
    version INTEGER,
    FOREIGN KEY (worker_id) REFERENCES savingjim.users (id),
    FOREIGN KEY (child_id) REFERENCES savingjim.users (id),
    FOREIGN KEY (modified_by) REFERENCES savingjim.users (id)
); 

CREATE TABLE IF NOT EXISTS savingjim.games_open(
    id SERIAL PRIMARY KEY,
    worker_id INTEGER NOT NULL,
    child_id INTEGER NOT NULL,
    date DATE,
    data json,
    modified_by INTEGER,
    modified_on TIMESTAMP,
    version INTEGER,
    FOREIGN KEY (worker_id) REFERENCES savingjim.users (id),
    FOREIGN KEY (child_id) REFERENCES savingjim.users (id),
    FOREIGN KEY (modified_by) REFERENCES savingjim.users (id)
);


/*
 * Users insert. 1 admin, 2 workers, 3 contacts, 3 children 
 */ 
INSERT INTO savingjim.users (id, account_type, first_name, last_name, username, password, active, modified_on, modified_by, version)
VALUES (DEFAULT, 0, 'admin','admin', 'admin', '$2a$04$7imHLhVTFYzFp4B7NC3Ku.GpXlJA8gMiwy.Gg2ktVVaEEwwYRq16q',true, NULL, NULL, 0);

INSERT INTO savingjim.users (id, account_type, first_name, last_name, username, password, active, modified_on, modified_by, version)
VALUES (DEFAULT, 1, 'worker1','worker1', 'worker1', '$2a$04$d2tpvGfYdrC.iezqR8epeuvY.ARYokCcIR0JYtl4IY9xbRGe7d6Kq',true, NULL, NULL, 0);

INSERT INTO savingjim.users (id, account_type, first_name, last_name, username, password, active, modified_on, modified_by, version)
VALUES (DEFAULT, 1, 'worker2','worker2', 'worker2', '$2a$04$CKwAXJKBawdsJJAJEikBYOmanXzqEzecGjJ0P0YL/3boq/V3WAij6',true, NULL, NULL, 0);

INSERT INTO savingjim.users (id, account_type, first_name, last_name, username, password, active, modified_on, modified_by, version)
VALUES (DEFAULT, 2, 'contact1','contact1', 'contact1', '$2a$04$lFZaw1tvKVZw3k2utNN7E.dTreJO4DN6.CgcJnaS85lwIp6ezyzD2',true, NULL, NULL, 0);

INSERT INTO savingjim.users (id, account_type, first_name, last_name, username, password, active, modified_on, modified_by, version)
VALUES (DEFAULT, 2, 'contact2','contact2', 'contact2', '$2a$04$N/HtODk2CwmEN6M9nqRxFeKfnWzVr3Gs6bljHz1J5eUsWhyrcjwo2',true, NULL, NULL, 0);

INSERT INTO savingjim.users (id, account_type, first_name, last_name, username, password, active, modified_on, modified_by, version)
VALUES (DEFAULT, 2, 'contact3','contact3', 'contact3', '$2a$04$wn3zhnmjUy6l6guWrh7Py.DSypTNGOThJtLLYOgTIR.RzfH43PQeW',true, NULL, NULL, 0);

INSERT INTO savingjim.users (id, account_type, first_name, last_name, username, password, active, modified_on, modified_by, version)
VALUES (DEFAULT, 3, 'child1','child1', 'child1', '$2a$04$Ggy.l4lYmt8.nNCGtL3aOewqO2gHUb5SYRqqoMf6MfBYeFMdTfb/K',true, NULL, NULL, 0);

INSERT INTO savingjim.users (id, account_type, first_name, last_name, username, password, active, modified_on, modified_by, version)
VALUES (DEFAULT, 3, 'child2','child2', 'child2', '$2a$04$sa8GBlmsbSrX1.fhnhQaMuxTMORDz7pYDckZ7X6L3geiXriPT7OoC',true, NULL, NULL, 0);

INSERT INTO savingjim.users (id, account_type, first_name, last_name, username, password, active, modified_on, modified_by, version)
VALUES (DEFAULT, 3, 'child3','child3', 'child3', '$2a$04$y5LSpEC7tnmmoXqtnxHE3.JEAZ3r4e38mqXE6Af2IvqzN.Am1fmDa',true, NULL, NULL, 0);
 
/*
 * Contacts insert. 3 contacts
 *
 * Contact1 id = 4 has 1 child, child1 id = 7
 * Contact2 id = 5 has 1 child, child2 id = 8 --> mum but not register for the child3
 * Contact3 id = 6 has 2 child, child2 id = 8 && child3 id = 9 --> dad
 *
 */
INSERT INTO savingjim.persons_of_contact (id, account_id, child_id, phone_number, email_address, relation_to_child, modified_by, modified_on, version)
VALUES (DEFAULT, 4, 7, '0411223344', 'contact1@gmail.com', 'papa', NULL, NULL, 0);

INSERT INTO savingjim.persons_of_contact (id, account_id, child_id, phone_number, email_address, relation_to_child, modified_by, modified_on, version)
VALUES (DEFAULT, 5, 8, '0422334455', 'contact2@gmail.com', 'maman', NULL, NULL, 0);

INSERT INTO savingjim.persons_of_contact (id, account_id, child_id, phone_number, email_address, relation_to_child, modified_by, modified_on, version)
VALUES (DEFAULT, 6, 8, '0433445566', 'contact3@gmail.com', 'papa', NULL, NULL, 0);

INSERT INTO savingjim.persons_of_contact (id, account_id, child_id, phone_number, email_address, relation_to_child, modified_by, modified_on, version)
VALUES (DEFAULT, 6, 9, '0433445566', 'contact3@gmail.com', 'papa', NULL, NULL, 0);


/*
 * Workers insert. 2 workers
 *
 * Worker1 id = 2 manages 2 children (id = 7, id = 8)
 * Worker2 id = 3 manages 1 children (id = 9)
 */
INSERT INTO savingjim.workers_to_children (id, account_id, child_id, modified_by, modified_on, version)
VALUES (DEFAULT, 2, 7, NULL, NULL, 0);

INSERT INTO savingjim.workers_to_children (id, account_id, child_id, modified_by, modified_on, version)
VALUES (DEFAULT, 2, 8, NULL, NULL, 0);

INSERT INTO savingjim.workers_to_children (id, account_id, child_id, modified_by, modified_on, version)
VALUES (DEFAULT, 3, 9, NULL, NULL, 0);


/*
 * Children insert. 3 children.
 *
 * id 7 -> 9 in users
 *
 * All boolean are set to false
 * 2 children are in specialized school program, the last one is in an integration program
 *
 */
INSERT INTO savingjim.children (id, account_id, birth_date, language, dominant_hand, school, school_type, current_school_degree, visual_difficulty, no_visual, 
hearing_difficulty, no_hearing, movement_difficulty, md_right, md_left, md_both, no_movement_hands, nmh_right, nmh_left, nmh_both, communication_difficulty, 
no_communication, hearing_comprehension_difficulty, game_flow_comprehension_difficulty, space_awarness_difficulty, other, modified_by, modified_on, version)
VALUES (DEFAULT, 7, '2000-10-9', 'fr', 1, 1, 'Specialise', '6eme secondaire', FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, 'Child1', NULL, NULL, 0);


INSERT INTO savingjim.children (id, account_id, birth_date, language, dominant_hand, school, school_type, current_school_degree, visual_difficulty, no_visual, 
hearing_difficulty, no_hearing, movement_difficulty, md_right, md_left, md_both, no_movement_hands, nmh_right, nmh_left, nmh_both, communication_difficulty, 
no_communication, hearing_comprehension_difficulty, game_flow_comprehension_difficulty, space_awarness_difficulty, other, modified_by, modified_on, version)
VALUES (DEFAULT, 8, '2003-11-15', 'fr', 1, 2, 'Integre', '3eme secondaire', FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, 'Child2', NULL, NULL, 0);


INSERT INTO savingjim.children (id, account_id, birth_date, language, dominant_hand, school, school_type, current_school_degree, visual_difficulty, no_visual, 
hearing_difficulty, no_hearing, movement_difficulty, md_right, md_left, md_both, no_movement_hands, nmh_right, nmh_left, nmh_both, communication_difficulty, 
no_communication, hearing_comprehension_difficulty, game_flow_comprehension_difficulty, space_awarness_difficulty, other, modified_by, modified_on, version)
VALUES (DEFAULT, 9, '2005-8-9', 'ndls', 1, 1, 'Specialise', '1eme secondaire', FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, 'Child3', NULL, NULL, 0);

/*
 * Games-open insert. each child has 2 games.   data : [ligneId : [activity : [like, help, happy]]] 
 *
 * Game 1 => child1 on 20-10-2019 
 *      line 1 : LIKE to make velo and he DON'T NEED help, and he is HAPPY of how it works here.
 *      line 2 : DON'T LIKE to eat and he NEED help. He doesn't say how it is going for now.
 *      line 3 : DON'T LIKE to go to the toilette, he NEEDS help and he is NOT HAPPY of how it works.
 * ...
 *           
 */
INSERT INTO savingjim.games_open (worker_id, child_id, date, data, modified_by, modified_on, version) VALUES (2, 7, '2019-10-20', '{ "1" : {"velo" : {"like":"true", "help":"false", "happy":"true"}, "2": {"serviraliments" : {"like":"false", "help":"true", "happy":"-1"}}, "3": {"toilettes" : {"like":"false", "help":"true", "happy":"false"}}}}', NULL, NULL, 0);

INSERT INTO savingjim.games_open (worker_id, child_id, date, data, modified_by, modified_on, version) VALUES (2, 7, '2019-10-23', '{ "1" : {"velo" : {"like":"true", "help":"false", "happy":"true"}, "2": {"serviraliments" : {"like":"true", "help":"true", "happy":"true"}}, "3": {"urgence" : {"like":"false", "help":"true", "happy":"false"}}}}', NULL, NULL, 0);

INSERT INTO savingjim.games_open (worker_id, child_id, date, data, modified_by, modified_on, version) VALUES (2, 8, '2019-01-20', '{ "1" : {"telephone" : {"like":"true", "help":"false", "happy":"true"}, "2": {"lire" : {"like":"false", "help":"true", "happy":"-1"}}, "3": {"balayer" : {"like":"false", "help":"true", "happy":"false"}}}}', NULL, NULL, 0);

INSERT INTO savingjim.games_open (worker_id, child_id, date, data, modified_by, modified_on, version) VALUES (2, 8, '2019-05-17', '{ "1" : {"television" : {"like":"true", "help":"false", "happy":"true"}, "2" : {"prothese" : {"like":"false", "help":"true", "happy":"false"}}, "3": {"toilettes" : {"like":"false", "help":"true", "happy":"false"}}}}', NULL, NULL, 0);

INSERT INTO savingjim.games_open (worker_id, child_id, date, data, modified_by, modified_on, version) VALUES (3, 9, '2019-11-23', '{ "1" : {"acheter" : {"like":"true", "help":"true", "happy":"false"}, "2": {"serviraliments" : {"like":"false", "help":"true", "happy":"-1"}}, "3": {"allumer lumiere" : {"like":"true", "help":"false", "happy":"true"}}}}', NULL, NULL, 0);

INSERT INTO savingjim.games_open (worker_id, child_id, date, data, modified_by, modified_on, version) VALUES (3, 9, '2019-10-20', '{ "1" : {"machine a laver" : {"like":"false", "help":"true", "happy":"false"}, "2": {"serviraliments" : {"like":"true", "help":"false", "happy":"true"}}, "3": {"toilettes" : {"like":"false", "help":"true", "happy":"false"}}}}', NULL, NULL, 0);


