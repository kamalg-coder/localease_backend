  const mongoose = require("mongoose");
  const express = require("express");
  const productRouter = express.Router();
  const {ProductModel} = require("../model/product.model");
  const {authentication}=require("../middleware/admin.middleware")
  const { cloudinary } = require("../utils/cloudinary");



  productRouter.post("/addproduct", authentication, async (req, res) => {
       try {
            const { adminID, url, img_src, rating_img_src, rating, heading, category, value_2, price, tag, field } = req.body
            if (img_src) {
                 const uploadRes = await cloudinary.uploader.upload(img_src, {
                      upload_preset: "localEase_Image"
                 })
                 if (uploadRes) {
                      const product = new ProductModel({ adminID, url, img_src: uploadRes, rating_img_src, rating, heading, category, value_2, price, tag, field });
                      await product.save();
                      res.status(200).send({ "msg": " Product data successfully added" })
  
                 }
            }
       }
       catch (err) {
            res.send({ "msg": err.message })
       }
  })

  productRouter.get("/" , async(req , res) => {
     const options={
          maxTimeMS: 20000
     }
         try {
          const category=req.query.category
          const id=req.query.id
          console.log(category)
          if(category){
               const product = await ProductModel.find({category:category},options);
               res.status(200).send(product);
          }
          if(id){
               const product = await ProductModel.find({_id:id},options);
               res.status(200).send(product);
          }
          if((req.query.min) && (req.query.max) ){
               const product = await ProductModel.find({ price: { $gte: Number(req.query.min), $lte: Number(req.query.max) } },options);
               res.status(200).send(product);
          }

               const product = await ProductModel.find({},options);
               res.status(200).send(product);
          

       
     }

     catch(err) {
          res.send({"msg" : err.message})
     }
 })

 productRouter.delete("/delete/:productID" , async(req , res) => {
    const {productID} = req.params;
    console.log(productID);
     try {
          const product = await ProductModel.findByIdAndDelete({_id : productID});
          res.status(200).send({"msg" : "product deleted successfully"});
     }

     catch(err) {
          res.send({"msg" : err.message})
     }
 })

 productRouter.patch("/update/:productID" , async(req , res) => {
     const {productID} = req.params;
      try {
           const product = await ProductModel.findByIdAndUpdate({_id : productID} , req.body);
           res.status(200).send({"msg" : "Product Updated successfully"});
      }
 
      catch(err) {
           res.send({"msg" : err.message})
      }
  })
  

    module.exports={productRouter}



