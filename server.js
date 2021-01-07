const inquirer = require("inquirer");
const connection = require("./db/employees");
const chalk = require("chalk");
const figlet = require("figlet");
const consoleTable = require("console.table");

//////////////////  MySQL CONNECTION  /////////////////////

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

//////////////////  START EMPLOYEE TRACKER APP  /////////////////////

async function employeeTrackerApp() {
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
        console.log(
          chalk.magenta.bold(
            `=====================================================================================`
          )
        );
        console.log(chalk.blue.bold(figlet.textSync("Bye Bye")));
        console.log(
          chalk.magenta.bold(
            `=====================================================================================`
          )
        );
        connection.end();
      }
    });
}

//////////////////  VIEW ALL DEPARTMENTS  /////////////////////

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

//////////////////  VIEW ALL EMPLOYEES  /////////////////////

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
      console.log(chalk.yellow(`ALL EMPLOYEES`));
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

//////////////////  VIEW EMPLOYEES BY DEPARTMENT /////////////////////

async function viewEmployeesByDepartment() {
  let departmentArr = [];
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM department", function (error, response) {
      if (error) return reject(error);
      resolve;
      for (i = 0; i < response.length; i++) {
        departmentArr.push(response[i].name);
      }
      return resolve(departmentArr);
    });
  })
    .then((response) => {
      inquirer
        .prompt([
          {
            name: "department",
            type: "list",
            message: "Please select a department to see the employees.",
            choices: response,
          },
        ])
        .then((answer) => {
          connection.query(
            "SELECT CONCAT(first_name, ' ', last_name) AS employees FROM employee, role, department WHERE employee.role_id = role.id && role.department_id = department.id && department.name = ?",
            [answer.department],
            (error, response) => {
              if (error) throw error;
              if (response.length > 0) {
                console.log(
                  chalk.magenta(
                    `=====================================================================================`
                  )
                );
                console.log(chalk.yellow(answer.department + " Employees"));
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
              } else {
                console.log(
                  chalk.magenta(
                    `=====================================================================================`
                  )
                );
                console.log(chalk.yellow(answer.department + " Employees"));
                console.log(
                  chalk.magenta(
                    `=====================================================================================`
                  )
                );
                console.log(
                  chalk.red(
                    "Currently there are no employees in this department."
                  )
                );
                console.log(
                  chalk.magenta(
                    `=====================================================================================`
                  )
                );
                employeeTrackerApp();
              }
            }
          );
        });
    })
    .catch((error) => {
      throw error;
    });
}

//////////////////  VIEW EMPLOYEES BY MANAGER /////////////////////

selectManager = () => {
  return new Promise((resolve, reject) => {
    const managerArr = ["None"];
    connection.query(
      'SELECT employee.id, CONCAT(employee.first_name, " ", employee.last_name) AS employee, role.title FROM employee RIGHT JOIN role ON employee.role_id = role.id WHERE role.title = "Sales Manager" OR role.title = "Marketing Manager" OR role.title = "Operastions Manager" OR role.title = "Regional Manager"',
      (error, response) => {
        if (error) throw error;
        response.forEach((manager) => {
          managerArr.push(manager.employee);
          return error ? reject(error) : resolve(managerArr);
        });
      }
    );
  });
};

selectManagerId = (manager) => {
  return new Promise((resolve, reject) => {
    connection.query(
      'SELECT * FROM employee WHERE CONCAT(first_name, " ", last_name)=?',
      [manager],
      async (error, response) => {
        if (error) throw error;
        return error ? reject(error) : resolve(response[0].id);
      }
    );
  });
};

viewEmployeesByManager = async () => {
  inquirer
    .prompt({
      name: "manager",
      type: "list",
      message: "Please select a manager to see their employees.",
      choices: await selectManager(),
    })
    .then(async (answer) => {
      const managerId =
        answer.manager === "None"
          ? null
          : await selectManagerId(answer.manager);
      if (managerId === null) {
        connection.query(
          "SELECT CONCAT(first_name, ' ', last_name) as employees FROM employee where manager_id is null",
          (error, response) => {
            if (error) throw error;
            console.log(
              chalk.magenta(
                `=====================================================================================`
              )
            );
            console.log(chalk.yellow(`EMPLOYEES WITH NO MANAGER`));
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
      } else {
        connection.query(
          "SELECT CONCAT(first_name, ' ', last_name) AS employees FROM employee where manager_id=?",
          [managerId],
          (error, response) => {
            if (error) throw error;
            if (response.length < 1) {
              console.log(
                chalk.magenta(
                  `=====================================================================================`
                )
              );
              console.log(chalk.yellow(`NO EMPLOYEES`));
              console.log(
                chalk.magenta(
                  `=====================================================================================`
                )
              );
              employeeTrackerApp();
            } else {
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
          }
        );
      }
    });
};

//////////////////  VIEW ALL ROLES  /////////////////////

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

//////////////////  ADD DEPARTMENT  /////////////////////

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

//////////////////  ADD ROLE  /////////////////////

const addRole = () => {
  let departmentArr = [];
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM department", function (error, response) {
      if (error) return reject(error);
      resolve;
      for (i = 0; i < response.length; i++) {
        departmentArr.push(response[i].name);
      }
      return resolve(departmentArr);
    });
  }).then((response) => {
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
              console.log(
                "Please provide the title of the role you are adding."
              );
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
          choices: response,
        },
      ])
      .then((answer) => {
        console.log(answer);
        const departmentId = departmentArr.indexOf(answer.department) + 1;
        console.log(departmentId);
        const newRole = [answer.title, answer.salary, departmentId];
        console.log(newRole);
        connection.query(
          `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`,
          newRole,
          (error) => {
            if (error) throw error;
            console.log(
              chalk.magenta(
                `=====================================================================================`
              )
            );
            console.log(chalk.yellow(`ADDED ROLE: ` + answer.title));
            console.log(
              chalk.magenta(
                `=====================================================================================`
              )
            );
            viewAllRoles();
          }
        );
      });
  });
};

//////////////////  ADD EMPLOYEE  /////////////////////

let roleArr = [];
function selectRole() {
  connection.query("SELECT * FROM role", function (error, response) {
    if (error) throw error;
    for (var i = 0; i < response.length; i++) {
      roleArr.push(response[i].title);
    }
  });
  return roleArr;
}

const addEmployee = () => {
  inquirer
    .prompt([
      {
        name: "first_name",
        type: "input",
        message: "What is the first name of the employee you are adding?",
        validate: (firstInput) => {
          if (firstInput) {
            return true;
          } else {
            console.log(
              "Please provide the first name of the employee you are adding."
            );
            return false;
          }
        },
      },
      {
        name: "last_name",
        type: "input",
        message: "What is the last name of the employee you are adding?",
        validate: (lastInput) => {
          if (lastInput) {
            return true;
          } else {
            console.log(
              "Please provide the last name of the employee you are adding."
            );
            return false;
          }
        },
      },
      {
        name: "role_id",
        type: "list",
        message: "What is the role of this employee?",
        choices: selectRole(),
      },
    ])
    .then((answer) => {
      console.log(answer);
      const roleId = selectRole().indexOf(answer.role_id) + 1;
      // const managerId = selectManager().indexOf(answer.manager_id) + 1;
      const newEmployee = [
        answer.first_name,
        answer.last_name,
        roleId.toString(),
        // managerId.toString(),
      ];
      console.log(newEmployee);
      connection.query(`SELECT * FROM employee`, (error, data) => {
        if (error) throw error;
        const managers = data.map(({ id, first_name, last_name }) => ({
          name: first_name + " " + last_name,
          value: id,
        }));
        inquirer
          .prompt([
            {
              name: "manager_id",
              type: "list",
              message: "Who is this employee's manager?",
              choices: managers,
            },
          ])
          .then((managerSelected) => {
            const manager = managerSelected.manager_id;
            newEmployee.push(manager);
            connection.query(
              `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`,
              newEmployee,
              (error) => {
                if (error) throw error;
                console.log(
                  chalk.magenta(
                    `=====================================================================================`
                  )
                );
                console.log(
                  chalk.yellow(
                    `ADDED EMPLOYEE: ` +
                      answer.first_name +
                      ` ` +
                      answer.last_name
                  )
                );
                console.log(
                  chalk.magenta(
                    `=====================================================================================`
                  )
                );
                viewAllEmployees();
              }
            );
          });
      });
    });
};

//////////////////  UPDATE EMPLOYEE ROLE  /////////////////////

selectEmployee = () => {
  return new Promise((resolve, reject) => {
    const employeeArr = [];
    connection.query("SELECT * FROM employee", (error, response) => {
      if (error) throw error;
      response.forEach((employee) => {
        let employeeName = employee.first_name + " " + employee.last_name;
        employeeArr.push(employeeName);
        return error ? reject(error) : resolve(employeeArr);
      });
    });
  });
};

employeeIdQuery = (employee) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM employee WHERE CONCAT(first_name, ' ', last_name)=?",
      [employee],
      async (error, response) => {
        if (error) throw error;
        return error ? reject(error) : resolve(response[0].id);
      }
    );
  });
};

roleIdQuery = (role) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM role WHERE title=?",
      [role],
      async (err, res) => {
        if (err) throw err;
        return err ? reject(err) : resolve(res[0].id);
      }
    );
  });
};

updateEmployeeRole = async () => {
  inquirer
    .prompt([
      {
        name: "employee",
        type: "list",
        message: "Which employee's role would you like to update?",
        choices: await selectEmployee(),
      },
      {
        name: "role",
        type: "list",
        message: "What would like to this employee's role to be?",
        choices: await selectRole(),
      },
    ])
    .then(async (answer) => {
      const employeeId = await employeeIdQuery(answer.employee);
      const newRoleId = await roleIdQuery(answer.role);
      connection.query(
        "UPDATE employee SET ? WHERE id=?",
        [
          {
            role_id: newRoleId,
          },
          employeeId,
        ],
        (error) => {
          if (error) throw error;
          console.log(
            chalk.magenta(
              `=====================================================================================`
            )
          );
          console.log(chalk.yellow(`UPDATED EMPLOYEE ROLE`));
          console.log(
            chalk.magenta(
              `=====================================================================================`
            )
          );
          console.table(answer);
          console.log(
            chalk.magenta(
              `=====================================================================================`
            )
          );
          employeeTrackerApp();
        }
      );
    });
};

//////////////////  UPDATE EMPLOYEE ROLE  /////////////////////

updateEmployeeManager = async () => {
  return new Promise((resolve, reject) => {
    const employeeArr = [];
    connection.query("SELECT * FROM employee", (error, response) => {
      if (error) throw error;
      response.forEach((employee) => {
        let employeeName = employee.first_name + " " + employee.last_name;
        employeeArr.push(employeeName);
        return error ? reject(error) : resolve(employeeArr);
      });
    });
  }).then(async (response) => {
    inquirer
      .prompt([
        {
          name: "employee",
          type: "list",
          message: "Which employee's role would you like to update?",
          choices: response,
        },
        {
          name: "manager",
          type: "list",
          message: "Please select a Manager for this employee.",
          choices: await selectManager(),
        },
      ])
      .then(async (answer) => {
        const employeeId = await employeeIdQuery(answer.employee);
        const managerId = await selectManagerId(answer.manager);
        connection.query(
          "UPDATE employee SET ? WHERE id=?",
          [{ manager_id: managerId }, employeeId],
          (error) => {
            if (error) throw error;
            console.log(
              chalk.magenta(
                `=====================================================================================`
              )
            );
            console.log(chalk.yellow(`UPDATED EMPLOYEE MANAGER`));
            console.log(
              chalk.magenta(
                `=====================================================================================`
              )
            );
            console.table(answer);
            console.log(
              chalk.magenta(
                `=====================================================================================`
              )
            );
            employeeTrackerApp();
          }
        );
      });
  });
};
