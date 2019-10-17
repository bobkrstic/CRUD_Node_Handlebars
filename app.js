var express = require("express");
var exphbs = require("express-handlebars");

const app = express();
const morgan = require("morgan");
var mysql = require("mysql");
const bodyParser = require("body-parser");
var http = require("http");

app.use(bodyParser.urlencoded({ extended: true }));

// server will serve all the files inside the puclic folder
app.use(express.static("./public"));

app.use(morgan("short"));

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

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

app.listen(3700, () => {
  console.log("Server is listening on 3700");
});
