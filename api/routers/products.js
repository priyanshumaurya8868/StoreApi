const express = require("express");
const router = express.Router(); //used for better handling of endpoints with differ http verbs(get,put,post,patch,etc...)
const mongoose = require("mongoose");
const Product = require("../models/products");
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname,'../../uploads'));
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
  }
});
const filefilter = (req,file,cb)=>{
  //reject a file
  if(file.mimetype === 'image/jpeg' ||file.mimetype === 'image/png' ){
    cb(null,true)
  }else cb(null,false)
}

const upload = multer({
  storage  : storage,
  fileFilter : filefilter,
  limits : {
    fileSize : 1024*1024*8 //max 8 MB
  }
})


router.get("/", (req, res, next) => {
  //   res.status("200").json({
  //     message: "handling GET request",
  //     reqType: "GET",
  //   });
  Product.find()
  .select("name price _id productImage")
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

router.post("/",upload.single('productImage'), (req, res, next) => {
   console.log(req.file)
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage : req.file.path
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
  const id = req.params.productId;
  Product.findById(id)
   .select('name price _id productImage')
    .exec()
    .then((doc) => {
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
