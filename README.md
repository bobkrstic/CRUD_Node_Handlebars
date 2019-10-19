# CRUD_Node_Handlebars

CRUD logic with Node and Handlebars

This application is intended to serve as a cheat sheet, with minimal functionality implemented to complete the CRUD (Create Read Update Delete) logic. NodeJS will be in charge for the logic, MySQL to store data (MAMP to connect us to MySQL, Sequel Pro to display it), and Handlebars to serve our HTML page with the data from the Database.

To start this application open your app in the terminal with "nodemon app.js" command and go to the localhost 3700. You will need to have your local database with MySQL set up with MAMP, in order to use the same connection parameters. Open your Sequel pro, after you started MAMP, and connect to the database using password "root". Connection parameters are located in the app.js file. Once you are in the Sequel Pro, create your database "HandlebarsDB" and the table inside of it named "users". The table will have three columns: "id", "first_name" and "last_name".

Use this syntax to create the table:

CREATE TABLE `users` (
`id` int(11) unsigned NOT NULL AUTO_INCREMENT,
`first_name` varchar(30) NOT NULL DEFAULT '',
`last_name` varchar(30) NOT NULL DEFAULT '',
PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8;
