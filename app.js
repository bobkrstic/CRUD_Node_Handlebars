var express = require("express");
var exphbs = require("express-handlebars");

const app = express();
const morgan = require("morgan");
var mysql = require("mysql");
const bodyParser = require("body-parser");
var http = require("http");

app.use(bodyParser.urlencoded({ extended: false }));

// server will serve all the files inside the puclic folder
app.use(express.static("./public"));

app.use(morgan("short"));

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

const baseURL = "http://localhost:3700/";

// create connection to our local database
function getConnection() {
  return mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    socket: "	/Applications/MAMP/tmp/mysql/mysql.sock",
    database: "HandlebarsDB"
  });
}

// getting all the users (all rows from the database table)
app.get("/users", (req, res) => {
  const queryString = "SELECT * FROM users";
  getConnection().query(queryString, (err, rows, fields) => {
    if (err) {
      console.log("Failed to query for users: " + err);
      res.sendStatus(500);
      return;
    }
    res.json(rows);
  });
});

app.get("/", (req, res) => {
  const queryString = "SELECT * FROM users";
  getConnection().query(queryString, (err, rows, fields) => {
    if (err) {
      console.log("Failed to query for users: " + err);
      res.sendStatus(500);
      return;
    }
    res.render("home", {
      users: rows
    });
  });
});

// add user. This page will be displayed when the user hits the button "Add new user"
// located on the main page where the all users are displayed.
app.get("/user/add", (req, res) => {
  res.render("add-user.handlebars", {
    // users: "rows"
  });
});
// in addition, this function will use the same form provided by the get function request
// and add a user to the database
app.post("/user/add", (req, res) => {
  console.log("Trying to create a new user...");
  console.log("First name: " + req.body.userName + " " + req.body.userLastName);

  // capturing input from a user
  const firstName = req.body.userName;
  const lastName = req.body.userLastName;

  // first_name last_name the way they are defined in the data base
  const queryString = "INSERT INTO users (first_name, last_name) VALUES (?, ?)";
  // next step is the sequel query to use the input data and place it into the table (data base)
  getConnection().query(
    queryString,
    [firstName, lastName],
    (err, results, fields) => {
      if (err) {
        console.log("Failed to insert new user: " + err);
        res.sendStatus(500);
        return;
      }
      userID = results.insertId;
      console.log("Inserted a new user with id: ", results.insertId);
      res.redirect(baseURL);
    }
  );
});

// Edit user
// the get method will take us to the page /user/edit/:id and here we will have the data displayed with the chosen user already
// once we change the data, we will use the POST method to post that edited data to the database
app.get("/user/edit/:id", (req, res) => {
  console.log("Fetching user with id: " + req.params.id);
  userId = req.params.id;
  const queryString = "SELECT * FROM users WHERE id = ?";

  getConnection().query(queryString, [userId], (err, rows, fields) => {
    const userIDfromDatabase = rows[0].id;

    res.render("edit-user.handlebars", {
      userID: userIDfromDatabase,
      userName: rows[0].first_name,
      userLastName: rows[0].last_name
    });
  });
});

// POST method for adding an edited user info
app.post("/user/edit/:id", (req, res) => {
  console.log("Trying to update a user with user id = " + req.params.id);
  console.log(req.params.id);
  console.log("First name: " + req.body.userName);
  // capturing input from a user

  const userId = req.params.id;
  const firstName = req.body.userName;
  const lastName = req.body.userLastName;

  // first_name last_name the way they are defined in the data base
  const queryString =
    "UPDATE users SET first_name = ?, last_name = ? WHERE id = " + userId + "";
  // next step is the sequel query to use the input data and place it into the table (data base)
  getConnection().query(
    queryString,
    [firstName, lastName],
    (err, results, fields) => {
      if (err) {
        console.log("Failed to update user: " + err);
        res.sendStatus(500);
        return;
      }
      // this will console.log our result object where we can see that the affectedRows: changed to 1
      // which will further confirm that we have successfully updated our database and will then proceed to redirect us to the beggining
      console.log(JSON.parse(JSON.stringify(results)));

      if (results.affectedRows) {
        res.redirect(baseURL);
      }
    }
  );
});

// delete user
app.get("/user/delete/:id", (req, res) => {
  const userId = req.params.id;
  console.log("Trying to delete user: " + userId);
  getConnection().query(
    "DELETE FROM users WHERE id = " + userId + "",
    (err, rows, fields) => {
      if (rows.affectedRows) {
        res.redirect(baseURL);
      }
    }
  );
});

app.listen(3700, () => {
  console.log("Server is listening on 3700");
});
