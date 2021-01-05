const inquirer = require("inquirer");
const connection = require("./db/employees");
const chalk = require("chalk");
const figlet = require("figlet");
const consoleTable = require("console.table");

connection.connect((error) => {
  if (error) throw error;
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
          { name: "View All Employees" },
          { name: "View All Roles" },
          { name: "View All Departments" },
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
        ],
        default: "View All Employees",
      },
    ])
    .then((response) => {
      const { choices } = response;

      if (choices === "View All Employees") {
        viewAllEmployees();
      }
      if (choices === "View All Roles") {
        viewAllRoles();
      }

      if (choices === "View All Departments") {
        viewAllDepartments();
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
    });
};

const viewAllEmployees = () => {
  let sql = `SELECT employee.id, 
  employee.first_name, 
  employee.last_name; 
  role.title, 
  department.name 
  AS 'department', 
  role.salary 
  FROM employee, 
  role, 
  department 
  WHERE department.id = role.department_id 
  AND role.id = employee.role_id 
  ORDER By employee.id ASC`;
  connection.promise().query(sql, (error, response) => {
    if (error) throw error;
    console.log(
      chalk.magenta(
        `=====================================================================================`
      )
    );
    console.log(chalk.blue(`Current Employees`));
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
