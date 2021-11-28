const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose  = require("mongoose");
const productsResource = require("./api/routers/products");
const ordersResources = require("./api/routers/orders");


mongoose.connect(`mongodb+srv://Priyanshu:${process.env.MONGO_DB_PW}@cluster0.wtthl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`)

app.use(morgan("dev")); // logging for every request
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  res.header("Allow-Control-Allow-Origin", "*"); // u can uneven restrict it app.header('Allow-Control-Allow-Origin','https://myCoolPage.com')

  //define  headers that can be send with request
  res.header(
    "Allow-Control-Allow-Header",
    "Origin, Content-Type, X-Requested-With, Accept, Authorization"
  );

//since browser  always  sent the options request whenever  u send PUT or POST
  if(req.method == 'OPTIONS'){
      res.header('Allow-Control-Allow-Methods','PUT , PATCH, POST, DELETE, GET')
      return res.status(200).json({}); //since, this time we dont want to our routes,as this OPTION req was just to know  which are avalible
  }
  next();
});

// routes... (or end points)
app.use("/products", productsResource);
app.use("/orders", ordersResources);

//if none of the defined endpoint handled the request,will reach to this
app.use((req, res, next) => {
  const error = new Error("Not found!");
  error.status = 404;
  next(error);
});

//if any error  occurr with  any end opint will reach here
app.use((error, req, res, next) => {
  res.status(error.status||500);
  res.json({
    error: error.message,
  });
});

module.exports = app;
