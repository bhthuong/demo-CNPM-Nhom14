var express = require("express");
var product = express.Router();
const products = require("../models/products.model");

module.exports = () => {
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
                res.render("admin/list-product", {
                    danhsach: data,
                    message: "Cập nhật thành công",
                    current: page,
                    pages: Math.ceil(count / perPage),
                });
            });
        });
}