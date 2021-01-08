INSERT INTO department(name)
VALUES("Sales"),
    ("Accounting"),
    ("Human Resources"),
    ("Customer Service"),
    ("Wharehouse");
INSERT INTO role(title, salary, department_id)
VALUES("Regional Manager", 99000, 1),
    ("Assistant to the Regional Manager", 90000, 1),
    ("Sales Manager", 80000, 1),
    ("Accounting Clerk", 70000, 2),
    ("Customer Service Representive", 45000, 4),
    ("Human Resources Manager", 65000, 3),
    ("Wharehouse Manager", 50000, 5),
    ("Baler Operator", 40000, 5);
INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES("Michael", "Scott", 1, null),
    ("Dwight", "Schrute", 2, 1),
    ("Jim", "Halpert", 3, 1),
    ("Oscar", "Martinez", 4, 1),
    ("Toby", "Flenderson", 6, null),
    ("Kelly", "Kapor", 5, 2),
    ("Daryl", "Philbin", 7, 1),
    ("Roy", "Anderson", 8, 7)