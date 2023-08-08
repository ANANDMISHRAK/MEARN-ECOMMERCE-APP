import CategoryModel from "../models/CategoryModel.js";
import slugify from 'slugify'

export const createCategoryController= async(req, res)=>{
   try{
    
        const {name} = req.body 
        if(!name)
        {
            return res.status(401).send({message:"Name is required"})
        }

        const existingCategory = await CategoryModel.findOne({name})

        if(existingCategory)
        {
            return res.status(200).send({
                success: true,
                message:"Category Already exisits"
            })
        }
        
        const category = await new CategoryModel({name, slug:slugify(name)}).save()
        res.status(201).send({
            success:true,
            message: 'New Category Created',
            category
        })
      }
    catch(error){
                 // console.log(error);
                  res.status(500).send({
                                         success: false,
                                         error,
                                         message:"error in Catgoty"
                                       })
                }
}


//update category controller 
export const updateCategoryController = async (req, res)=>{
    try{
        const {name}= req.body 
        const {id}= req.params      // params use url me se lene ke liye
         const category =await CategoryModel.findByIdAndUpdate(id, {name, slug: slugify(name)}, {new:true});
         res.status(200).send({
            success:true,
            message:"category Update Successfully",
            category
        })
       }
    catch(error){
                 // console.log(error)
                  res.status(500).send({
                                         success:false,
                                         error,
                                         message:"error while category"
                                       })
                }
}

//get all category

export const categoryController= async(req, res)=>{
  try{
        const category = await CategoryModel.find({})
        res.status(200).send({
            success: true,
            message:'All Category List',
            category
        })
     }
  catch(error){
               // console.log(error)
                res.status(500).send({
                                       success: false,
                                       message:"error to get all category",
                                       error
                                      })
              }
}

//sinlge category get

export const singleCategoryController= async(req, res)=>{
    try{
          // const {slug} = req.params
           const category= await CategoryModel.findOne({slug:req.params.slug}) 
           res.status(200).send({
                                   success: true,
                                   message:'Get single Category List',
                                   category
                                })  
       }
    catch(error){
              // console.log(error)
               res.status(500).send({
                               success: false,
                               message:"error to get all category",
                               error
                              })
                }

 }

 //delete Category

 export const deleteCategoryController =async(req, res)=>{
      try{
           const {id}= req.params
           const category = await CategoryModel.findByIdAndDelete(id);
           
           res.status(200).send({
                                success: true,
                                message:'Delete successfully Category',
                                category
                              })  

         }
      catch(error){
                     //console.log(error)
                     res.status(500).send({
                        success: false,
                        message:"error to Delete category",
                        error
                       })
                  }
   }