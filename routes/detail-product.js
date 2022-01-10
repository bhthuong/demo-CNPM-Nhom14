var express = require("express")
const products = require("../models/products.model")

var detail_product = express.Router();


detail_product.get("/user/detail-product/:id", (req, res) => {
  if (req.session.loggin) {
    products.findById(req.params.id, function (err, data) {
      if (err) {
      } else {
        danhsach = data
        idsp = danhsach._id
        res.render("user/Detailproducts", { user: req.user });
      }
    })
  } else {
    products.findById(req.params.id, function (err, data) {
      if (err) {
      } else {
        danhsach = data
        idsp = danhsach._id
        res.render("user/Detailproducts", { user: null });
      }
    })
  }
});

module.exports = detail_product
