# table for student information
CREATE TABLE IF NOT EXISTS students ( 
id INT NOT NULL AUTO_INCREMENT,
name VARCHAR(30),
country VARCHAR(20),
primary_lang VARCHAR(20),
jap_level VARCHAR(10),
photo VARCHAR(50),
note VARCHAR(500),
PRIMARY KEY (id)
);

# table for teacher information
# color: HEX code
CREATE TABLE IF NOT EXISTS teacher ( 
id INT NOT NULL AUTO_INCREMENT,
name VARCHAR(30),
color INT,
PRIMARY KEY (id)
);

# table for classes
# type: skill, grammar
CREATE TABLE IF NOT EXISTS classes ( 
id INT NOT NULL AUTO_INCREMENT,
name VARCHAR(30),
type VARCHAR(20),
PRIMARY KEY (id)
);

# table for teacher, class, time assoc
# kind: private, group, skype, local.
CREATE TABLE IF NOT EXISTS class_periods ( 
id INT NOT NULL AUTO_INCREMENT,
start_date DATETIME,
end_date DATETIME ,
class_id INT,
room_id INT,
teacher_id INT,
kind VARCHAR(20),
PRIMARY KEY (id)
);

# which student is in which classes
CREATE TABLE IF NOT EXISTS class_registrations ( 
id INT NOT NULL AUTO_INCREMENT,
class_id INT,
student_id INT,
creation_date DATETIME,
drop_date DATETIME,
PRIMARY KEY (id)
);

# table for rooms
CREATE TABLE IF NOT EXISTS rooms ( 
id INT NOT NULL AUTO_INCREMENT,
name,
capacity TINYINT,
creation_date DATETIME,
archive_date DATETIME,
PRIMARY KEY (id)
);

# student time at school
# type: default, extension, break
CREATE TABLE IF NOT EXISTS student_reg_intervals ( 
id INT NOT NULL AUTO_INCREMENT,
student_id INT,
start_date DATETIME,
end_date DATETIME,
type VARCHAR(20),
PRIMARY KEY (id)
);

# table for translations
CREATE TABLE IF NOT EXISTS student_reg_intervals ( 
id INT NOT NULL AUTO_INCREMENT,
lang VARCHAR(20),
text VARCHAR(20),
PRIMARY KEY (id)
);
