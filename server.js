const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
//const bcrypt = require("bcrypt");
const cors = require("cors");
const knex = require("knex");
const morgan = require("morgan");
const auth = require("./controllers/authorization");

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");
const signout = require("./controllers/signout").signout;

const db = knex({
  // connect to your own database here
  client: "pg",
  connection: process.env.POSTGRES_URI,
});

const app = express();

require("dotenv").config();

app.use(morgan("combined"));

const allowedDomains = [
  "https://smartbrain.devcoral.com/",
  "http://smartbrain.devcoral.com/",
];
app.use(
  cors({
    credentials: true,
    origin: function (origin, callback) {
      // bypass the requests with no origin (like curl requests, mobile apps, etc )
      if (!origin) return callback(null, true);

      if (allowedDomains.indexOf(origin) === -1) {
        const msg = `This site ${origin} does not have an access. Only specific domains are allowed to access it.`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);

app.use(bodyParser.json());
app.get("/", (req, res) => {
  //res.send("Working");
  res.send(db.users);
});
app.post("/signin", signin.signinAuthentication(db, bcrypt));
app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});
app.get("/profile/:id", auth.requireAuth, (req, res) => {
  profile.handleProfileGet(req, res, db);
});
app.post("/profile/:id", auth.requireAuth, (req, res) => {
  profile.handleProfileUpdate(req, res, db);
});
app.put("/image", auth.requireAuth, (req, res) => {
  image.handleImage(req, res, db);
});
app.post("/imageurl", auth.requireAuth, (req, res) => {
  image.handleApiCall(req, res);
});
app.get("/signout", auth.requireAuth, (req, res) => {
  signout(req, res);
});

app.listen(3000, () => {
  console.log("app is running on port 3000");
});
