require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    app.emit("ready");
  })
  .catch((e) => console.log(e));

const session = require("express-session");
const MongoStore = require("connect-mongo");
const routes = require("./routes");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const sessionOptions = session({
  secret: process.env.SESSIONSECRET,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  },
});

app.use(sessionOptions);
app.use(routes);

app.on("ready", () => {
  app.listen(3000, () => {
    console.log("Acessar http://localhost:3000");
    console.log("Servidor executando na porta 3000");
  });
});
