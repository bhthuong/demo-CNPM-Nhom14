require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session')
var logger = require('morgan');
var ejs = require("ejs");
var LocalStrategy = require("passport-local");
var passport = require('passport');
var flash = require('connect-flash');
var jwt = require("jsonwebtoken");
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))

// link router
var cate = require("./routes/cate.js");
var view_user = require("./routes/view_user.js");
var NV = require("./routes/NV.js");
var cart = require("./routes/cart.js");
var detail_product = require("./routes/detail-product.js");
var router = require("./routes/users.js")
var product = require('./routes/product.js');
var client = require('./routes/client.js');
var about = require('./routes/about.js');

//Link models
var products = require("./models/products.model");

// kết nối database
var config = require('./config/database.js');
var mongoose = require('mongoose');

mongoose.connect(config.url, { useNewUrlParser: true, useUnifiedTopology: true });

require('./config/passport'); //vượt qua passport để config trang đăng nhâp/đăng ký
app.use(session({
  secret: 'my secret',
  resave: false,
  saveUninitialized: false,
}))
app.use(flash());
app.use(passport.initialize())
app.use(passport.session());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.get('/', function (req, res) {
  if (req.session.loggin) {
    user = req.user
  } else {
    user = null
  }
  let perPage = 9;
  let page = req.params.page || 1;

  products
    .find()
    .sort({ date: "descending" })
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec((err, data) => {
      products.countDocuments((err, count) => {
        if (err) return next(err);
        res.render("user/index", {
          danhsach: data,
          current: page,
          pages: Math.ceil(count / perPage),
        });
      });
    })
})

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/", router);
app.use("/", about);
app.use("/", client);
app.use("/", cart);
app.use("/", view_user);
app.use("/", NV);
app.use("/", product);
app.use("/", cate);
app.use("/", detail_product);

// catch 404 and forward to error handler

app.listen(process.env.PORT || 8080, () => {
  console.log("Server is runing at http://localhost:8080");
})
