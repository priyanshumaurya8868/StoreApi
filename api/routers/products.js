const express = require("express");
const router = express.Router(); //used for better handling of endpoints with differ http verbs(get,put,post,patch,etc...)
const mongoose = require("mongoose");
const Product = require("../models/products");

router.get("/", (req, res, next) => {
  //   res.status("200").json({
  //     message: "handling GET request",
  //     reqType: "GET",
  //   });
  Product.find()
    .exec()
    .then((docs) => {
      console.log(docs);
      res.status(200).json(docs);
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
});

router.post("/", (req, res, next) => {
  //    const product = {
  //        name : req.body.name,
  //        price : req.body.price
  //    }
  // res.status("201").json({
  //  message : "product created",
  //  reqType : "POST",
  //  product : product

  // })
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
  });

  product
    .save()
    .then((result) => {
      console.log(result);
      res.status("201").json({
        message: "product created",
        reqType: "POST",
        product: product,
      });
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
});

router.get("/:productId", (req, res, next) => {
  // res.status("200").json({
  //  message : "GET product by Id",
  //  productId : req.params.productId
  // })
  const id = req.params.productId;
  Product.findById(id)
    .exec()
    .then((doc) => {
      //inorde to hide the field "__v"
      //    const result = doc.toObject({ versionKey: false })
      console.log("From database", doc);
      if (doc) {
        res.status(200).json(doc);
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
});

router.patch("/:productId", (req, res, next) => {
  //   res.status(200).json({
  //     message: "product updated",
  //     productId: req.params.productId,
  //   });

  const id = req.params.productId;
  const updateOps = {};

  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }

  Product.updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        next(err);
      });
});

router.delete("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
});

//  For a PUT request: HTTP 200 or HTTP 204 should imply "resource updated successfully".
// For a DELETE request: HTTP 200 or HTTP 204 should imply "resource deleted successfully"
// The 204 response MUST NOT include a message-body, and thus is always terminated by the first empty line after the header fields.
//  Status 201 => indicates that as a result of HTTP POST request, one or more new resources have been successfully created on the server
module.exports = router;
