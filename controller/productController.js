import slugify from 'slugify';
import productModel from '../models/productModel.js'
import categoryModel from '../models/CategoryModel.js'
import OrderModel from '../models/OrderModel.js';
import fs from 'fs';
import braintree from 'braintree';
import dotenv from "dotenv"

dotenv.config();
// Payment Getway
 var gateway = new braintree.BraintreeGateway({
   environment: braintree.Environment.Sandbox,
   merchantId: process.env.BRAINTREE_MERCHANT_ID,
   publicKey:  process.env.BRAINTREE_PUBLIC_KEY ,
   privateKey: process.env.BRAINTREE_PRIVATE_KEY,

 });
 

export const createProductController =async (req, res)=>{
    try{
         // phle data body se lete the ab Field se lenge q ki ab formidable use kr rhe hai product router me
         
         const {name, slug, description, price, category, quantity, shipping }= req.fields
         const {photo}= req.files ;

         //validation
         switch(true)
         {
            case !name: 
                       return res.status(500).send({error:'Name is require'});


            case !description: 
                       return res.status(500).send({error:'Description is require'});

            case !price: 
                       return res.status(500).send({error:'Price is require'});

            case !category: 
                       return res.status(500).send({error:'Category is require'});

            case !quantity: 
                       return res.status(500).send({error:'Quantity is require'});

            case !photo && photo.size >1000000: 
                       return res.status(500).send({error:'Photo is require and should be less then 1MB'});
         }

        const product = new productModel({...req.fields, slug: slugify(name)})

        if(photo)
        {
            product.photo.data = fs.readFileSync(photo.path)
            product.photo.contentType = photo.type
        }
        await product.save()

        res.status(201).send({
            success: true,
            message: 'Product Created successfully',
            product
        })
       }
    catch(error){
                  //console.log(error);
                  res.status(500).send({
                                       success: false,
                                       error,
                                       message:"error in creating Product"
                                     })
                }
 }

 // get all product

 export const getProductControler = async(req, res)=>{
    try{
          const products = await productModel.find({}).populate('category').select("-photo").limit(12).sort({createdAt:-1}) 
          res.status(200).send({
            success:true,
            totalNumberOfProduct: products.length,
            message:'All Product',
            products,
            
          }) 
       }
    catch(error){
                   // console.log(error);
                    res.status(500).send({
                             success: false,
                             error,
                             message:"error in Getting Product"
                           })
    }
 }

 //get single product
 export const getSingleProductControler = async(req, res)=>{
   try{
            const product = await productModel.findOne({slug:req.params.slug}).select('-photo').populate('category');

            res.status(200).send({
               success:true,
               message:'All Product',
               product,
               
             }) 
            
      }
   catch(error){
               // console.log(error);
                res.status(500).send({
                                      success: false,
                                      error,
                                      message:"error while Getting single Product"
                                    })
                }
 }

 //get photo according to photo id

 export const productPhotoController= async(req, res)=>{
   try{
         const product = await productModel.findById(req.params.pid).select("photo") 
         if(product.photo.data)
         {
            res.set('Content-type', product.photo.contentType)
            return res.status(200).send(product.photo.data)
         }   
      }
   catch(error){
         //console.log(error);
         res.status(500).send({
                               success: false,
                               message:"error while Getting Product Photo",
                               error,
                             })
         }  
 }


 //
 export const deleteProduct = async(req, res)=>{
   try{
        
         await productModel.findByIdAndDelete(req.params.pid).select("-photo")

         res.status(200).send({
            success:true,
            message:'Product delete successfully',
            
          }) 

      }
   catch(error){
        // console.log(error);
         res.status(500).send({
                               success: false,
                               message:"error while delete Product",
                               error,
                             })
         } 
 }

 //
 export const updateProductController = async(req, res)=>{
   try{
      const {name, slug, description, price, category, quantity, shipping }= req.fields
      const {photo}= req.files ;

      //validation
      switch(true)
      {
         case !name: 
                    return res.status(500).send({error:'Name is require'});


         case !description: 
                    return res.status(500).send({error:'Description is require'});

         case !price: 
                    return res.status(500).send({error:'Price is require'});

         case !category: 
                    return res.status(500).send({error:'Category is require'});

         case !quantity: 
                    return res.status(500).send({error:'Quantity is require'});

         case !photo && photo.size >10000000: 
                    return res.status(500).send({error:'Photo is require and should be less then 1MB'});
      }

     const product = await productModel.findByIdAndUpdate(req.params.pid, {...req.fields, slug:slugify(name)}, {new:true})

     if(photo)
     {
         product.photo.data = fs.readFileSync(photo.path)
         product.photo.contentType = photo.type
     }
     await product.save()

     res.status(201).send({
         success: true,
         message: 'Product Update successfully',
         product
     })     


      }
   catch(error){
     // console.log(error);
      res.status(500).send({
                            success: false,
                            message:"error while update Product",
                            error,
                          })
      } 
 }


 // Product filter 

 export const productFiltersController= async(req, res)=>{
    try{
         // body se check or Radio go get krenge i.e. Frontend se
         const {checked, radio}= req.body  
         let args ={}
          
         //ab dekhenge ki user , filter kaise kr rha hai ... kya category se ydi ha to Categary array ka size 0 se bda hoga ya 
         //  radio se ya dono se
         if(checked.length >0) args.category = checked
         if(radio.length) args.price = {$gte: radio[0], $lte: radio[1]}

         const products= await productModel.find(args)
         res.status(200).send({
            success:true,
            products,
         })
    }
    catch(error){
                  //console.log(error)
                  res.status(400).send({
                     success:false,
                     message:'error while Filtering Product',
                     error
                  })
                }
 }


 //
 export const productCountController = async(req, res)=>{
    try{
           const total = await productModel.find({}).estimatedDocumentCount()
           res.status(200).send({
            success:true,
            total,
           })  
      }
    catch(error){
                   // console.log(error)
                    res.status(400).send({
                    success:false,
                    message:'error in Product Count',
                    error
      })
    }
   }


   // controllr for product pag loading 

   export const productListContoller= async(req, res)=>{
     try{
          const perPage =3;
          const page = req.params.page ? req.params.page : 1
          
          const products = await productModel.find({}).select("-photo").skip((page-1)*perPage).limit(perPage).sort({createdAt: -1});

          res.status(200).send({
            success: true,
            products,
          })
       }
     catch(error){
     // console.log(error)
      res.status(400).send({
         success:false,
         message:'error in page Loading',
         error
      })
     }
   }


   //search filter controller

   export const searchProductController= async(req, res)=>{
      try{
            const {keyword}= req.params
            const result = await productModel.find({
               $or: [
                  {name:{$regex : keyword, $options:'i'}},
                  {description:{$regex : keyword, $options:'i'}} 
               ]
            }).select("-photo");
            res.json(result);
         }
      catch(error){
        // console.log(error)
         res.status(400).send({
            success:false,
            message:'error in search Filter Controller',
            error
         })
      }
   }


   //related product controller
   export const relatedProductontroller =async(req, res)=>{
     try{
           const {pid, cid} =req.params
           const products = await productModel.find({
            category: cid,
            _id:{$ne:pid}
           }).select("-photo").limit(3).populate("category")
           res.status(200).send({
            success:true,
            products,
           })  
        }
     catch(error){
     // console.log(error)
      res.status(400).send({
         success:false,
         message:'error in related product controller'
      })
     }
   }



   // category wise product  
   export const productCategoryController =async(req, res)=>{
          try{
               const category = await categoryModel.findOne({slug:req.params.slug})  
               const products = await productModel.find({category}).populate('category')

               res.status(200).send({
                  success:true,
                  category,
                  products,
               })
          }
          catch(error){
                       //console.log(error)
                       res.status(400).send({
                                         success:false,
                                         message:'error in category product controller'
                                        })           
          }
   }


   // 1 Payment gateway token controller
   export const braintreeTokenController = async(req, res)=>{
        try{
            gateway.clientToken.generate({},function(err, response){
               if(err){
                  res.status(500).send(err)
               }
               else{
                  res.send(response);
               }
            })
        }
        catch(error){
           // console.log(error)
        }
    }

    //2 Payment
    export const braintreePaymentController = async(req, res)=>{
      try{
            const {cart, nonce} = req.body
            let total =0
            cart.map( (i) => {total= total + i.price})
            let newTransaction = gateway.transaction.sale({
                amount: total,
                paymentMethodNonce: nonce,
                options: {
                  submitForSettlement: true
                }
            },
              function(error, result){
                if(result)
                {
                   const order = new OrderModel({
                     products: cart,
                     payment: result,
                     buyer: req.user._id,   
                   }).save()
                   res.json({ok:true})
                }
                else{
                  res.status(500).send(error)
                }
              }
            )
        }
      catch(error){
             //console.log(error)
      }
    }