var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
var passport = require('passport');
const userModel = require('../models/user.model');
const products = require('../models/products.model');
var User = require('../models/user.model');

router.get('/home', function (req, res, next) {
  if (req.session.loggin) {
    user = req.user
    if (user.role == "admin") {
      userModel.find({ role: "user" }).then(function (data) {
        listuser = data
        products.find().then(function (data) {
          res.render("admin/index-admin", {
            danhsach: data
          });
        })
      })
    } else {
      products.find().sort({ ngaynhap: "descending" }).limit(12).exec(function (err, data) {
        if (err) {
          res.json({ "kq": 0, "errMsg": err });
        } else {
          res.render("user/index", { danhsach: data });
        }
      })
    }
  } else {
    user = null;
    products.find().sort({ ngaynhap: "descending" }).limit(12).exec(function (err, data) {
      if (err) {
        res.json({ "kq": 0, "errMsg": err });
      } else {
        res.render("user/index", { danhsach: data });
      }
    })
  }
})

router.get('/login', function (req, res, next) {
  user = null;
  var message = req.flash('error')
  res.render('login', {
    message: message,
    hasErrors: message.length > 0,
  })
})

// router.post('/signin', function (req, res, done) {
//   let { email, password } = req.body
//   // console.log(email, password)

//   User.findOne({ email: email }, function (err, user) {
//     if (err) { return done(err); }
//     if (!user) {
//       return res.render('login', { message: 'Tài khoản không tồn tại'});
//     }
//     if (user.lock == 1) {
//       return res.render('login',{ message: 'Tài khoản của bạn đã bị khóa' });
//     }
//     if (!user.validPassword(password)) {
//       return res.render('login', { message: 'Mật khẩu không đúng' });
//     } else {
//       req.session.login = true;
//       req.session.role = true;
//       return res.render('home', { user });
//       // return done(null, user, res.redirect('/home'))
//     }
//   })
// })

router.get('/register', function (req, res, next) {
  var message = req.flash('error')
  res.render('register', {
    message: message,
    hasErrors: message.length > 0,
  })
})
router.get("/lock/:id", (req, res) => {
  userModel.findOne({ _id: req.params.id }, function (err, data) {

    data.lock = 1;
    data.save();
    res.redirect("/view_user");
  })
})
router.get("/unlock/:id", (req, res) => {
  userModel.findOne({ _id: req.params.id }, function (err, data) {

    data.lock = 0;
    data.save();
    res.redirect("/view_user");
  })
})

// Xử lý thông tin khi có người đăng nhập
router.post('/signin',
  passport.authenticate('local.signin', {
    successRedirect: '/home',
    failureRedirect: '/login',
    failureFlash: true
  })

)

router.get("/delete-user/:id", (req, res) => {
  if (req.session.loggin) {

    userModel.deleteOne({ _id: req.params.id }, function (err, data) {
      req.session.destroy(function (err) {
        if (err) {
          return next(err);
        } else {
          return res.redirect('/');
        }
      });
    })
  }
})

// Xử lý thông tin khi có người đăng ký
router.post('/signup',
  [
    check('email', 'Email không được để trống').isEmail(),
    check('password', 'Mật khẩu phải có ít nhất 5 ký tự').isLength({ min: 5 })
  ],
  (function (req, res, next) {

    var message = req.flash('error');
    const result = validationResult(req);
    var errors = result.errors;
    if (!result.isEmpty()) {
      var message = [];
      errors.forEach(function (error) {
        message.push(error.msg);
      });
      res.render('login', {
        message: message,
        hasErrors: message.length > 0,
      });
    } else {
      next();
    }
  }),
  passport.authenticate('local.signup', {
    successRedirect: '/login',
    failureRedirect: 'login',
    failureFlash: true
  })
)

// ------ Đăng xuất --------
router.get('/logout', function (req, res, next) {
  req.logout();
  if (req.session) {
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        user = null
        return res.redirect('/');
      }
    });
  }
})

module.exports = router