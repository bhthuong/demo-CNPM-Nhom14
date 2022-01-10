var express = require("express");
var product = express.Router();
const products = require("../models/products.model");
var multer = require("multer");
const { response } = require("express");
var cates = require("../models/Cate.js");
const cate = require("./cate");
const prod = require('../middlewares/product')
const show_product = require('../middlewares/show-product')
const show_product_admin = require('../middlewares/show-product-admin')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
var upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    console.log(file);
    if (
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/PNG" ||
      file.mimetype == "image/jpeg" ||
      file.mimetype == "image/png" ||
      file.mimetype == "image/gif"
    ) {
      cb(null, true);
    } else {
      return cb(new Error("Only image are allowed!"));
    }
  },
}).single("image");

product.get("/product", show_product);
product.get("/product/:page", show_product);

product.get("/admin/list-product", show_product_admin);
product.get("/admin/list-product/:page", show_product_admin);

product.get("/admin/insert-product", (req, res) => {
  if (req.session.loggin) {
    user = req.user;
    if (user.role == "admin") {
      var message = req.flash("error");
      cates.find().then(function (data) {
        console.log(data);
        res.render("admin/insert-product", {
          item: data,
          message: message,
          hasErrors: message.length > 0,
        });
      });
    } else {
      res.redirect("/home");
    }
  } else {
    res.redirect("/home");
  }
});

product.post("/insert", (req, res) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      res.render("admin/insert-product", {
        message: "Không thể tải lên!!!",
      });
    } else if (err) {
      res.render("admin/insert-product", {
        message: "Định dạng file tải lên không hỗ trợ!!!",
      });
    } else {
      var product = products({
        image: req.file.filename,
        name: req.body.name,
        cateID: req.body.cateID,
        quantity: req.body.quantity,
        note: req.body.note,
        price: req.body.price,
        date: Date.now(),
      });
      product.save(function (err) {
        if (err) {
          res.render("admin/insert-product", { message: "Lỗi tải lên!!!" });
        } else {
          res.redirect("/admin/list-product");
        }
      });
    }
  });
});
product.get("/admin/edit-product/:id", (req, res) => {
  if (req.session.loggin) {
    user = req.user;
    if (user.role == "admin") {
      var message = req.flash("error");
      cates.find().then(function (data) {
        item = data

        products.findById(req.params.id, function (err, data) {
          res.render("admin/edit-product", {
            danhsach: data,
            message: message,
            hasErrors: message.length > 0,
          });
        });
      });
    } else {
      res.redirect("/home");
    }
  } else {
    res.redirect("/home");
  }
});

product.post("/edit-product", (req, res) => {
  if (req.session.loggin) {
    user = req.user;
    if (user.role == "admin") {
      upload(req, res, function (err) {
        if (!req.file) {
          products.updateOne(
            { _id: req.body.id },
            {
              name: req.body.name,
              quantity: req.body.quantity,
              note: req.body.note,
              namecate: req.body.namecate,
              price: req.body.price,
              date: Date.now(),
            },
            function (err) {
              if (err) {
                res.redirect("/admin/edit-product");
              } else {
                prod
              }
            }
          );
        } else {
          if (err instanceof multer.MulterError) {
            res.json({ kq: 0, errMsg: "aaaaa" });
          } else {
            products.updateOne(
              { _id: req.body.id },
              {
                image: req.file.filename,
                name: req.body.name,
                quantity: req.body.quantity,
                note: req.body.note,
                price: req.body.price,
                date: Date.now(),
              },
              function (err) {
                if (err) {
                  res.redirect("/admin/edit-product");
                } else {
                  prod
                }
              }
            );
          }
        }
      });
    } else {
      res.redirect("/home");
    }
  } else {
    res.redirect("/home");
  }
});
product.get("/delete-product/:id", (req, res) => {
  if (req.session.loggin) {
    products.deleteOne({ _id: req.params.id }, function (err) {
      if (err) {
        res.redirect("/admin/list-product");
      } else {
        prod
      }
    });
  } else {
    res.redirect("/home");
  }
});
//tìm kiếm//
product.post("/Search", (req, res) => {
  if (req.session.loggin) {
    user = req.user;
    if (user.role == "admin") {
      let name = req.body.name;
      cates.find().then(function (data) {
        item = data

        products
          .find({
            name: { $regex: name },
          })
          .limit(12)
          .then((data) => {
            res.render("admin/Search_product", {
              danhsach: data,
            });
            // console.log(data)
          })
          .catch((err) => {
            console.log(err);
          });
      })
    } else {
      let name = req.body.name;
      cates.find().then(function (data) {
        item = data

        products
          .find({
            name: { $regex: name },
          })
          .limit(12)
          .then((data) => {
            res.render("user/Search_product", {
              danhsach: data,
            });
            // console.log(data)
          })
          .catch((err) => {
            console.log(err);
          });
      })
    }
  } else {
    let name = req.body.name;
    cates.find().then(function (data) {
      item = data

      products
        .find({
          name: { $regex: name },
        })
        .limit(12)
        .then((data) => {
          res.render("user/Search_product", {
            danhsach: data,
          });
          // console.log(data)
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

});

module.exports = product;
