const e = require("express");
var express = require("express")
var NV = express.Router()
var userModel = require("../models/userNV.js");

function checkadmin(req,res,next){
    if(!req.session.loggin){    
        res.redirect("/")        
    } else{
        next()
    }
}

NV.get("/view_userNV", checkadmin, (req, res) => {
    if (req.session.loggin) {
        userModel.find().then(function (data) {
            res.render("admin/userNV", { userNV: data})
        })
    } else {
        res.redirect("/")
    }
})

NV.get("/admin/insertNV",checkadmin,(req,res)=>{
    res.render("admin/insert_NV");
})

NV.post("/insertNV",(req,res)=>{
    var userNV = userModel({
        ID: req.body.ID,
        name: req.body.name,
        dateOfBirth: req.body.dateOfBirth,
        age: req.body.age,
        sdt: req.body.sdt,
        address: req.body.address
    })
    userNV.save(function(err,data){
        if(err){
            res.redirect("admin/userNV",{ message : "Thêm mới không thành công" })
        } else{
            userModel.find().then(function (data) {
                res.render("admin/userNV", { userNV: data, message: "Thêm mới thành công", });
            });
        }
    })
})

NV.get("/admin/edit_userNV/:id",checkadmin,(req,res)=>{
    userModel.findById(req.params.id,function(err,data){
        if(!err) {
            res.render("admin/edit_userNV", {userNV: data})
        }
    })
})

NV.post("/updateNV",(req,res)=>{
    userModel.updateOne({
        ID: req.body.ID,
        name: req.body.name,
        dateOfBirth: req.body.dateOfBirth,
        age: req.body.age,
        sdt: req.body.sdt,
        address: req.body.address
    }, function(err) {
        if(err){
            res.redirect("/admin/userNV",{ message :"Cập nhật không thành công"})
        } else{
            userModel.find().then(function (data) {
                res.render("admin/userNV", { userNV: data, message: "Cập nhật thành công", });
            });
        }
    })
})

NV.get("/delete_userNV/:id", (req, res) => {
    if (req.session.loggin) {
        userModel.deleteOne({ _id: req.params.id }, function (err) {
            if (err) {
                res.redirect("/admin/userNV");
            } else {
                userModel.find().then(function (data) {
                    res.render("admin/userNV", { userNV: data, message: "Xóa thành công", });
                });
            }
        });
    } else {
        res.redirect("/home");
    }
});

module.exports = NV