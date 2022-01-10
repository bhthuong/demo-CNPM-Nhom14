var express = require("express");
var product = express.Router();
const products = require("../models/products.model");
var cates = require("../models/Cate.js");

module.exports = (req, res) => {

    if (req.session.loggin) {
      user = req.user
    } else {
      user = null;
    }

    let perPage = 9;
    let page = req.params.page || 1;
    cates.find().then(function (data) {
      item = data

      products
        .find()
        .sort({ date: "descending" })
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec((err, data) => {
          products.countDocuments((err, count) => {
            if (err) return next(err);
            res.render("user/product", {
              danhsach: data,
              current: page, // page hiện tại
              pages: Math.ceil(count / perPage),
            });
          });
        });
    });
} 