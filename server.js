"use strict";
//we are IMPORTING express and morgan from node modules
const express = require("express");
const morgan = require("morgan");
//we are importing users data
const { users } = require("./data/users");
//initializing it as an empty oject
let currentUser = {};
//below we are INITIALIZING express by creating a new instance of the above mentioned express so as to use it
const app = express();

//we are creating an ENDPOINT function that handles sign in FORM in PAGES
const handleSignIn = (req, res) => {
  res.render("pages/signIn", {
    title: "Welcome to Facespace",
    currentUser: currentUser,
  });
};

//we are creating an ENDPOINT function that handles sign in authentification
const handleName = (req, res) => {
  //  creating a variable with a query parameter ( could also example be set to password)
  const firstName = req.query.firstName;
  //testing purposes
  console.log(firstName);
  //using an arrow function we use the method find on object users from array ( establish parameters).
  //goes over each user and checks it
  const user = users.find((user) => user.name === firstName);
  // if user not found...
  if (!user) {
    return res.redirect("/signin");
  }
  // if user found...
  currentUser = user;
  //in curly brackets we are calling the user as established in varaible._id
  return res.redirect(`/home/users/${user._id}`);
};

// homepage endpoint
const handleHomepage = (req, res) => {
  console.log(currentUser);
  res.render("pages/homepage", {
    title: "Welcome to Facespace ",
    users: users,
    currentUser: currentUser,
  });
};

// 404 endpoint
const handleFourOhFour = (req, res) => {
  res.status(404).render("pages/signIn");
};

//profile page endpoint
const handleProfilePage = (req, res, next) => {
  console.log(currentUser);
  //establishing a variable where an arrow function checks a condition
  const isTheUserFromParams = (user) => user._id === req.params._id;
  //this user variable is in a scope that is not affected by above user variable so one is independant from other
  const user = users.find(isTheUserFromParams);
  if (user) {
    //in function below (map)we are executing it over the established parameter friend
    user.friends = user.friends.map((friend) => {
      //in function below (find) we are executing it over the established parameter user
      return users.find((user) => {
        return user._id === friend;
      });
    });
    res.render("pages/profile", {
      title: "User Profile",
      user: user,
      currentUser: currentUser,
    });
    //so that it stops at the above step we return it
    return;
  }
  //in case not authenticated
  next();
};
// -----------------------------------------------------
// middleware making it easier to serve data (extensions)
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

// above we have handled endpoints and served data at the same time. Now we must declare these endpoints
app.get("/home", handleHomepage);
app.get("/home/users/:_id", handleProfilePage, handleFourOhFour);
app.get("/signin", handleSignIn);
// below more of a back end functionality based end point
app.get("/getname", handleName);
// a catchall endpoint that will send the 404 message.
app.get("*", handleFourOhFour);

//declaring port
// first parameter is port we want to use, the second is function to be used when done starting
app.listen(8000, () => console.log("Listening on port 8000"));
