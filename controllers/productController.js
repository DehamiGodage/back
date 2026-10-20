import Product from '../models/product.js';
import { isAdmin } from './userController.js';

export async function getProducts(req,res){
    /*Product.find().
        then((data)=>{
            res.json(data);
});*/
    try{

        if(isAdmin(req)){    //Admins can see all products including unavailable ones
        const products = await Product.find();
        res.json(products)
    }else{
        const products = await Product.find({isAvailable : true}); //users can only see available products
        res.json(products)
    }
    }catch(err){
        res.json({
            message : "Failed to fetch products",
            error : err
        })
    }

}

export  function saveProduct(req,res){
   if(!isAdmin(req)){
        res.status(403).json({
            message : "You are not authorized to create products"
        })
        return
   }

    const product =new Product(
        req.body
    )

    product.save().then(()=>{
        res.json({
            message : "Product data saved successfully"
        });
        })
        .catch(()=>{
             res.json({
            message : "failed to save product data"
    })
    });
    
}
//test

export async function deleteProduct(req,res){
    if(!isAdmin(req)){
        res.status(403).json({
            message : "you are not authorized to delete a product"
        })
        return
    }
    try{
       await Product.deleteOne({productId : req.params.productId})

       res.json({
            message : "Product Delete Successfully"
       })
    }catch(err){
        res.status(500).json({
            message : "Failed to delete product",
            error : err

        })

    }
}


export async function updateProduct(req,res){
    if(!isAdmin(req)){
        res.status(403).json({
            message : "You are not authorized to update a product"
            
        })
        return
    }

    const productId = req.params.productId
    const updateData = req.body

    try{
        await Product.updateOne({productId : req.params.productId},updateData)

        res.json({
            message : "Product updated successfully"
        })

    }catch(err){
        res.status(500).json({
            message : "Failed to update product",
            error : err
        })
    }
}

export async function getProductById(req,res){
    const productId = req.params.productId

    try{
        const product = await Product.findOne({productId : productId}) //find required product by productId
        
        if (product == null){
            res.status(404).json({
                message : "Product not found"
            })
            return

    }
    if(product.isAvailable){
        res.json(product)
    }else{
        if(!isAdmin(req)){
            res.status(404).json({
                message : "Product not found"
            })
            return
        }else{
            res.json(product)
        }
    }
    }catch(err){
        res.status(500).json({
            message : "internal server error",
            error : err
        })
    }

}
