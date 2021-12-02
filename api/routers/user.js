const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken")

router.get("/", (req, res, next) => {
  User.find()
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => next(error));
});

router.post("/signup", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      //if user  already signed in with this email
      if (user.length >= 1) {
        //409 ->resource conflicting...!
        // 422 Unprocessable Entity response...!
        return res.status(409).json({
          message: "Mail exists",
        });
      } else {
        // we signin as  new user
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) next(err);
          else {
            const user = User({
              _id: mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
            });

            user
              .save()
              .then((result) => {
                console.log(result);
                res.status(201).json({
                  message: "User created",
                });
              })
              .catch((err) => next(err));
          }
        });
      }
    })
    .catch((err) => next(err));
});

router.post("/login", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user > 1) {
        res.status(401).json({ message: "Auth failed" });
      } else {
        bcrypt.compare(req.body.password, user[0].password, (error, result) => {
          if (error) {
            res.status(401).json({ message: "Auth failed!" });
          }
          if (result) {
        const token =  jwt.sign({
              email : req.body.email,
              password  : req.body.password
          },
          process.env.JWT_KEY,
          {
            expiresIn: "1h"
          }
          );
          return res.status(200).json({
              message:"Auth successful",
              token: token
          })
          }else {
            res.status(401).json({
                message: "Auth failed"
              });
          }
           
        });
      }
    })
    .catch((error) => next(error));
});

router.delete("/:userId", (req, res, next) => {
  User.remove({ _id: req.body.userId })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "user deleted!",
      });
    })
    .catch((error) => next(error));
});

module.exports = router;
