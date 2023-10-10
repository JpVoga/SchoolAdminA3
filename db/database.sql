-- Create user:

CREATE USER "joaoSchoolAdminA3" IDENTIFIED BY "school";

GRANT ALL PRIVILEGES ON *.* TO "joaoSchoolAdminA3";


-- Create database

CREATE DATABASE school_admin_a3;

USE school_admin_a3;


-- Create tables

CREATE TABLE student(
	id INT AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    
    CONSTRAINT student_pk PRIMARY KEY(id),
    CONSTRAINT student_first_name_is_not_empty_check CHECK(length(first_name) > 0),
    CONSTRAINT student_last_name_is_not_empty_check CHECK(length(last_name) > 0)
);

CREATE TABLE test(
	id INT AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    
    CONSTRAINT test_pk PRIMARY KEY(id),
    CONSTRAINT test_name_is_not_empty_check CHECK(length(name) > 0)
);

CREATE TABLE grade(
	id INT AUTO_INCREMENT,
    grade DECIMAL(5, 2),
    student_id INT NOT NULL,
    test_id INT NOT NULL,
    
    CONSTRAINT grade_pk PRIMARY KEY(id),
    CONSTRAINT grade_is_within_range_check CHECK((grade >= 0.0 AND grade <= 10.0) OR (grade IS NULL)),
    CONSTRAINT grade_student_fk FOREIGN KEY(student_id) REFERENCES student(id),
    CONSTRAINT grade_test_fk FOREIGN KEY(test_id) REFERENCES test(id)
);


-- Set auto increments:

ALTER TABLE student AUTO_INCREMENT = 1;

ALTER TABLE test AUTO_INCREMENT = 1;

ALTER TABLE grade AUTO_INCREMENT = 1;