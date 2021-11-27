const express = require('express')
const router = express.Router() //used for better handling of endpoints with differ http verbs(get,put,post,patch,etc...)

router.get("/",(req,res,next)=>{
   res.status("200").json({
    message : "Getting list of orders",
    reqType : "GET"
   })
})

router.post("/",(req,res,next)=>{

   const order = {
      id : req.body.id,
      quantity : req.body.quantity
   }

    res.status("201").json({
     message : "order created",
     reqType : "POST",
     order : order
    })
 })

router.get("/:orderId",(req,res,next)=>{
    res.status("200").json({
     message : "Get order details",
     reqType : "GET",
     orderId: req.params.orderId
    })
 })
 
 router.delete("/:orderId",(req,res,next)=>{
    res.status("200").json({
     message : "order deleted!",
     reqType : "DELETE",
     orderId: req.params.orderId
    })
 })
 


module.exports = router