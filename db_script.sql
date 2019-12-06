DROP SCHEMA IF EXISTS savingjim;

CREATE SCHEMA savingjim;

/* 
account_type
0 = admin
1 = worker
2 = person_of_contact
3 = child
 */

CREATE TABLE IF NOT EXISTS savingjim.users(
    id serial PRIMARY KEY NOT NULL,
    account_type INTEGER NOT NULL,
    first_name VARCHAR(70) NOT NULL,
    last_name VARCHAR(70) NOT NULL,
    login VARCHAR(70) NOT NULL,
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
    worker_id INTEGER NOT NULL,
    child_id INTEGER NOT NULL,
    modified_by INTEGER,
    modified_on TIMESTAMP,
    version INTEGER,
    FOREIGN KEY (worker_id) REFERENCES savingjim.users (id),
    FOREIGN KEY (child_id) REFERENCES savingjim.users (id),
    FOREIGN KEY (modified_by) REFERENCES savingjim.users (id)
);

CREATE TABLE IF NOT EXISTS savingjim.games_history(
    id SERIAL PRIMARY KEY,
    worker_id INTEGER NOT NULL,
    child_id INTEGER NOT NULL,
    date DATE,
    data VARCHAR(600),
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
    data VARCHAR(600),
    modified_by INTEGER,
    modified_on TIMESTAMP,
    version INTEGER,
    FOREIGN KEY (worker_id) REFERENCES savingjim.users (id),
    FOREIGN KEY (child_id) REFERENCES savingjim.users (id),
    FOREIGN KEY (modified_by) REFERENCES savingjim.users (id)
);