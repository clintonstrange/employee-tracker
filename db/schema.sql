DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;
USE employees_db;
CREATE TABLE department (
    id INTEGER(11) AUTO_INCREMENT NOT NULL,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY(id)
);
CREATE TABLE role (
    id INTEGER(11) AUTO_INCREMENT NOT NULL,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(9, 2) NOT NULL,
    department_id INTEGER(11),
    PRIMARY KEY(id),
    INDEX dept_ind (department_id),
    FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
);
CREATE TABLE employee (
    id INTEGER(11) AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER(11) UNSIGNED,
    manager_id INTEGER(11) UNSIGNED,
    PRIMARY KEY (id)
)