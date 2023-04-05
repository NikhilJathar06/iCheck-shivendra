const express = require('express');
const app = express();
const path = require("path");
const http = require('http');
const mongoose = require("mongoose");
const bodyParser = require('body-parser')
const cors = require('cors');
const cookieParser = require('cookie-parser');

// const chapters = require('../models/chapter')


const port = process.env.PORT || 5000;

const authRoute = require('../routes/auth-route');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser());

// parse application/json
app.use(bodyParser.json())
app.use(cors())

app.use('/auth', authRoute);
app.use(express.static('dist/i-check'));
app.set('view engine', 'pug');
// app.use(express.json())

app.get("/", (req, res) => {
  // res.sendFile('login-signup',{root:__dirname});
  res.get('hello');
});


const server = http.createServer(app);

const conn = async () => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect("mongodb://127.0.0.1/iCheck").then(() => { console.log(` dbconnection successfull`) }).catch((e) => { `no connection` });
    app.listen(port, () => console.log(`Server is running at port ${port}`));
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

conn();



