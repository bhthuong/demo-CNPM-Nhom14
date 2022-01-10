var express = require("express");
var product = express.Router();
const products = require("../models/products.model");

module.exports = (req, res) => {
    if (req.session.loggin) {
        user = req.user;
        if (user.role == "admin") {
          let perPage = 9;
          let page = req.params.page || 1;
          var message = req.flash("error");
          products
            .find()
            .sort({ date: "descending" })
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec((err, data) => {
              products.countDocuments((err, count) => {
                if (err) return next(err);
    
                res.render("admin/list-product", {
                  danhsach: data,
                  message: message,
                  current: page,
                  pages: Math.ceil(count / perPage),
                });
              });
            });
        } else {
          res.redirect("/home");
        }
      } else {
        res.redirect("/home");
      }
}