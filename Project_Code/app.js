const express = require("express");
const app = express();
//const session = require('express-session');
const static = express.static(__dirname + "/public");
const configRoutes = require("./routes");
const exphbs = require("express-handlebars");
const session = require("express-session");

app.use("/public", static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    name: "AuthCookie",
    secret: "This is a secret.. shhh don't tell anyone",
    saveUninitialized: true,
    resave: false,
  })
);

// app.use('/users', (req, res, next) => {//*****************setting private pages
//   if (!req.session.userId) {
//     res.status(200).render("pages/error", {error: "you are not logged in"});
//     return;
//   } else {
//     req.body.userId = req.session.userId; // give userId to next routes
//     next();
//   }
// });

app.use(express.json());

app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main",
    helpers: {
      // Function to do basic mathematical operation in handlebar
      math: function (lvalue, operator, rvalue) {
        lvalue = parseFloat(lvalue);
        rvalue = parseFloat(rvalue);
        return {
          "+": lvalue + rvalue,
          "-": lvalue - rvalue,
          "*": lvalue * rvalue,
          "/": lvalue / rvalue,
          "%": lvalue % rvalue,
        }[operator];
      },
    },
  })
);
app.set("view engine", "handlebars");

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
