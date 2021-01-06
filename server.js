const inquirer = require("inquirer");
const connection = require("./db/employees");
const chalk = require("chalk");
const figlet = require("figlet");
const consoleTable = require("console.table");

connection.connect(function (err) {
  if (err) throw err;
  console.log(
    chalk.magenta.bold(
      `=====================================================================================`
    )
  );
  console.log(``);
  console.log(chalk.blue.bold(figlet.textSync("Employee Tracker")));
  console.log(``);
  console.log(
    chalk.magenta.bold(
      `=====================================================================================`
    )
  );
  employeeTrackerApp();
});

const employeeTrackerApp = () => {
  return inquirer
    .prompt([
      {
        name: "choices",
        type: "list",
        message: "What would you like to do?",
        choices: [
          { name: "View All Departments" },
          { name: "View All Roles" },
          { name: "View All Employees" },
          { name: "View Employees By Department" },
          { name: "View Employees By Manager" },
          { name: "View Budget Of A Department" },
          { name: "Add A Role" },
          { name: "Add An Employee" },
          { name: "Add A Department" },
          { name: "Update An Employee Role" },
          { name: "Update Employee Manager" },
          { name: "Delete Employee" },
          { name: "Delete Role" },
          { name: "Delete Department" },
          { name: "Exit" },
        ],
      },
    ])
    .then((response) => {
      const { choices } = response;

      if (choices === "View All Departments") {
        viewAllDepartments();
      }

      if (choices === "View All Roles") {
        viewAllRoles();
      }

      if (choices === "View All Employees") {
        viewAllEmployees();
      }

      if (choices === "View Employees By Department") {
        viewEmployeesByDepartment();
      }

      if (choices === "View Employees By Manager") {
        viewEmployeesByManager();
      }

      if (choices === "View Budget Of A Department") {
        viewBudget();
      }

      if (choices === "Add A Role") {
        addRole();
      }

      if (choices === "Add An Employee") {
        addEmployee();
      }

      if (choices === "Add A Department") {
        addDepartment();
      }

      if (choices === "Update An Employee Role") {
        updateEmployeeRole();
      }

      if (choices === "Update Employee Manager") {
        updateEmployeeManager();
      }

      if (choices === "Delete Employee") {
        deleteEmployee();
      }

      if (choices === "Delete Role") {
        deleteRole();
      }

      if (choices === "Delete Department") {
        deleteDepartment();
      }

      if (choices === "Exit") {
        connection.end();
      }
    });
};

const viewAllDepartments = () => {
  connection.query(`SELECT * FROM department`, (error, response) => {
    if (error) throw error;
    console.log(
      chalk.magenta(
        `=====================================================================================`
      )
    );
    console.log(chalk.yellow(`ALL DEPARTMENTS`));
    console.log(
      chalk.magenta(
        `=====================================================================================`
      )
    );
    console.table(response);
    console.log(
      chalk.magenta(
        `=====================================================================================`
      )
    );
    employeeTrackerApp();
  });
};

const viewAllEmployees = () => {
  connection.query(
    `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(e.first_name, ' ' ,e.last_name) AS manager
    FROM employee
    INNER JOIN role ON role.id = employee.role_id
    INNER JOIN department on department.id = role.department_id
    LEFT JOIN employee e on employee.manager_id = e.id
    ORDER BY employee.id ASC`,
    (error, response) => {
      if (error) throw error;
      console.log(
        chalk.magenta(
          `=====================================================================================`
        )
      );
      console.log(chalk.yello(`ALL EMPLOYEES`));
      console.log(
        chalk.magenta(
          `=====================================================================================`
        )
      );
      console.table(response);
      console.log(
        chalk.magenta(
          `=====================================================================================`
        )
      );
      employeeTrackerApp();
    }
  );
};

const viewAllRoles = () => {
  connection.query(
    `SELECT role.title, role.id, department.name AS department, role.salary 
      FROM role
      INNER JOIN department on department.id = role.department_id
      ORDER BY role.id ASC`,
    (error, response) => {
      if (error) throw error;
      console.log(
        chalk.magenta(
          `=====================================================================================`
        )
      );
      console.log(chalk.yellow(`ALL ROLES`));
      console.log(
        chalk.magenta(
          `=====================================================================================`
        )
      );
      console.table(response);
      console.log(
        chalk.magenta(
          `=====================================================================================`
        )
      );
      employeeTrackerApp();
    }
  );
};

const addDepartment = () => {
  inquirer
    .prompt([
      {
        name: "addDepartment",
        type: "input",
        message: "What is the name of the department you are adding?",
        validate: (deptInput) => {
          if (deptInput) {
            return true;
          } else {
            console.log(
              "Please provide the name of the department you are adding."
            );
            return false;
          }
        },
      },
    ])
    .then((answer) => {
      connection.query(
        `INSERT INTO department (name)
      VALUES (?)`,
        answer.addDepartment,
        (error, response) => {
          if (error) throw error;
          console.log(
            chalk.magenta(
              `=====================================================================================`
            )
          );
          console.log(chalk.yellow(`ADDED DEPARTMENT`));
          console.log(
            chalk.magenta(
              `=====================================================================================`
            )
          );
          console.log(answer.addDepartment + " Department Added!");
          console.log(
            chalk.magenta(
              `=====================================================================================`
            )
          );
          viewAllDepartments();
        }
      );
    });
};

let departmentArr = [];
function selectDepartment() {
  connection.query("SELECT * FROM department", function (error, response) {
    if (error) throw error;
    for (var i = 0; i < response.length; i++) {
      departmentArr.push(response[i].name);
    }
  });
  return departmentArr;
}

const addRole = () => {
  inquirer
    .prompt([
      {
        name: "title",
        type: "input",
        message: "What is the title of the role you are adding?",
        validate: (roleInput) => {
          if (roleInput) {
            return true;
          } else {
            console.log("Please provide the title of the role you are adding.");
            return false;
          }
        },
      },
      {
        name: "salary",
        type: "input",
        message: "What is the salary of the role you are adding?",
        validate: (salaryInput) => {
          if (salaryInput > 0) {
            return true;
          } else {
            console.log(
              "Please provide the salary of the role you are adding."
            );
            return false;
          }
        },
      },
      {
        name: "department",
        type: "list",
        message: "Which department does this role belong to?",
        choices: selectDepartment(),
      },
    ])
    .then((answer) => {
      console.log(answer);
      const departmentId = selectDepartment().indexOf(answer.department) + 1;
      const newRole = {
        title: answer.title,
        salary: answer.salary,
        department_id: departmentId,
      };
      console.log(newRole);
      connection.query(
        "INSERT INTO role (title, salary, department_id) VALUES ?",
        newRole,
        function (error) {
          if (error) throw error;
          console.table(newRole);
          viewAllRoles();
        }
      );
    });
};
