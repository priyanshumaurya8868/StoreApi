const express = require("express");
const mongoose = require('mongoose');
const router = express.Router(); //used for better handling of endpoints with differ http verbs(get,put,post,patch,etc...)
const Order = require("../models/Order");
const Product = require("../models/products");

router.get("/", (req, res, next) => {
  Order.find()
    .select("_id, product, quantity")
    .populate("product", 'name')
    .exec()
    .then((docs) => {
      res.status(200).json({
        count: docs.length,
        orders: docs,
      });
    })
    .catch((error) => {
      next(error);
    });
});

router.post("/", (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId)
    .exec()
    .then((product) => {
      if (!product) {
        return res.status(404).json({
          message: "Product not found!",
        });
      }
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
      });
      return order.save();
    })
    .then((result) => {
      res.status(201).json({
         message : "Order Placed!",
         createdOrder: {
            _id: result._id,
            product: result.product,
            quantity: result.quantity
          },
          request: {
            type: "GET",
            url: "http://localhost:3000/orders/" + result._id
          }
      });
    }).catch(error=>{
       next(error)
    });
});

router.get("/:orderId", (req, res, next) => {
Order.findById(req.params.orderId)
.populate('product', 'name _id')
.exec()
.then(result => {
       res.status(200).json({
          _id : result._id,
          quantity: result.quantity,
          product : result.product,
          request:{
             type : "GET",
             description : "get all  details about the product!",
             link : "http://localhost:300/products/"+result.product._id
          }
       })
}).catch(error=>{
   next(error)
});
});

router.delete("/:orderId", (req, res, next) => {
   const id = req.params.orderId;
   Order.remove({ _id: id })
     .exec()
     .then((result) => {
       console.log(result);
       res.status(200).json({message : "item deleted!"});
     })
     .catch((error) => {
       console.log(error);
       next(error);
     });
 });
 

module.exports = router;
