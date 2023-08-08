import express from 'express';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
import { braintreePaymentController, braintreeTokenController, createProductController, deleteProduct, getProductControler,
          getSingleProductControler, 
          productCategoryController, 
          productCountController, 
          productFiltersController, 
          productListContoller, 
          productPhotoController,
          relatedProductontroller,
          searchProductController,
          updateProductController} from '../controller/productController.js';
import formidable from 'express-formidable';   // this is for data store as a image


const router = express.Router();

//router
router.post('/create-product', requireSignIn, isAdmin, formidable() ,createProductController)

//Get product
router.get('/get-product', getProductControler)

//single get product 
router.get('/get-product/:slug', getSingleProductControler)

//get photo
router.get('/product-photo/:pid', productPhotoController )

//delete product
router.delete('/delete-product/:pid', deleteProduct)

//update product
router.put('/update-product/:pid', requireSignIn, isAdmin, formidable() ,updateProductController)


// filter product through backend 

router.post('/product-filters', productFiltersController)

// API pe jyda load n pre uske liye Pasegn ka use krte hai jisse page scroll krne pe API se load ho
//product count

router.get('/product-count', productCountController)

// Product per page
 router.get('/product-list/:page', productListContoller)

 //Product search from Home page frontend 
 router.get('/search/:keyword', searchProductController)


 //similar Product 
 router.get('/related-product/:pid/:cid', relatedProductontroller)

 // Category wise Product
 router.get('/proudct-category/:slug', productCategoryController)

 // Payment rout
     //1 get token fron Braintree account
     router.get('/braintree/token', braintreeTokenController)

     //2 Payments
     router.post('/braintree/payment', requireSignIn, braintreePaymentController)

export default router;