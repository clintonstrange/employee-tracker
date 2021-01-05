INSERT INTO department(name)
VALUES("Sales"),
    ("Marketing"),
    ("Finance"),
    ("Legal"),
    ("Operations");
INSERT INTO role(title, salary, department_id)
VALUES("Sales Manager", 85000, 1),
    ("Sales Coordinator", 50000, 1),
    ("Marketing Manager", 75000, 2),
    ("Marketing Coordinator", 45000, 2),
    ("Lawyer", 150000, 3),
    ("Contract Administrator", 75000, 3),
    ("Operastions Manager", 50000, 4),
    ("Operations Supervisor", 40000, 4);
INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES("Anakin", "Skywalker", 1, null),
    ("Ashoka", "Tano", 2, 1),
    ("Ben", "Kenobi", 5, null),
    ("Ben", "Solo", 7, null),
    ("Luke", "Skywalker", 3, null),
    ("Bobba", "Fett", 4, 5);