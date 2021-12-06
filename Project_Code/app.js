const express = require('express');
const app = express();
//const session = require('express-session');
const static = express.static(__dirname + '/public');
const configRoutes = require('./routes');
const exphbs = require('express-handlebars');
const session = require('express-session');

app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    name: 'AuthCookie',
    secret: "This is a secret.. shhh don't tell anyone",
    saveUninitialized: true,
    resave: false
  })
);

app.use('/private', (req, res, next) => {// *****************setting private page here may only be apply I think
  if (!req.session.user) {
    res.status(403).render("pages/error", {error: "you are not logged in"});
    return;
  } else {
    next();
  }
});

app.use(express.json());

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});