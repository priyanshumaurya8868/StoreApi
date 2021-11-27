const express = require('express')
const router = express.Router() //used for better handling of endpoints with differ http verbs(get,put,post,patch,etc...)

router.get("/",(req,res,next)=>{
   res.status("200").json({
    message : "handling GET request",
    reqType : "GET"
   })
})

router.post("/",(req,res,next)=>{
   const product = {
       name : req.body.name,
       price : req.body.price
   }
    res.status("201").json({
     message : "product created",
     reqType : "POST",
     product : product

    })
 })

 router.get("/:productId",(req,res,next)=>{
    res.status("200").json({
     message : "GET product by Id",
     productId : req.params.productId
    })
 })

 router.put("/:productId",(req,res,next)=>{
     res.status(200).json({
         message :"product updated",
         productId: req.params.productId
     }) 
 })

 

 
//  For a PUT request: HTTP 200 or HTTP 204 should imply "resource updated successfully". 
// For a DELETE request: HTTP 200 or HTTP 204 should imply "resource deleted successfully"
// The 204 response MUST NOT include a message-body, and thus is always terminated by the first empty line after the header fields.
//  Status 201 => indicates that as a result of HTTP POST request, one or more new resources have been successfully created on the server
module.exports = router