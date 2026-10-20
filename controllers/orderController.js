import Order  from "../models/order.js";
import Product from "../models/product.js";


export async function createOrder(req,res){
    //get user information 
    if(req.user == null){
        res.status(403).json({
            message : "You are not authorized to create an order",
            error :err
            
        })
        return

    }

    const orderInfo = req.body

    if(orderInfo.name == null){
        orderInfo.name = req.user.firstName + "" + req.user.lastName
    }

    let orderId = "CBC00001"

    const lastOrder = await Order.find().sort({date :-1 }).limit(1) //[] array of 1 element

    if(lastOrder.length > 0){
        const lastOrderId = lastOrder[0].orderId
       
        //remove CBC
        const lastOrderNumberString =  lastOrderId.replace("CBC","") //"00551"
        const lastOrderNumber = parseInt(lastOrderNumberString) //551
        const newOrderNumber = lastOrderNumber + 1 //552
        const newOrderNumberString = String(newOrderNumber).padStart(5,'0') //add 0 s to the start till total numbers = 5
        orderId = "CBC" + newOrderNumberString //"CBC00552"
    }

    try{
        let total = 0;
        let labelledTotal = 0;
        const products = []

        for(let i =0; i< orderInfo.products.length;i++){
            
            const item = await Product.findOne({productId : orderInfo.products[i].productId});
            if(item == null){
                res.status(403).json({
                      message : "product with productId" + orderInfo.products[i].productId + "not found"

                })
                return
              
            }
            if(item.isAvailable == false){
                res.status(403).json({
                      message : "product with productId" + orderInfo.products[i].productId + "not available right now"

                })
                return

            }

            products[i] = {
                productInfo : {
                    productId: item.productId,
                    name: item.name,
                    altName: item.altName,
                    description: item.description,
                    images: item.images,
                    labelledPrice: item.labelledPrice,
                    price: item.price
                },
                quantity : orderInfo.products[i].quantity
            }

            total += (item.price * orderInfo.products[i].quantity)
            labelledTotal += (item.labelledPrice * orderInfo.products[i].quantity )
        }
    

    const order = new Order({
        orderId : orderId,
        email : req.user.email,
        name : orderInfo.name,
        address : orderInfo.address,
        phone : orderInfo.phone,
        total : 0,
        products : products,
        labelledTotal : labelledTotal,
        total : total
    })

    
       const createdOrder = await order.save()
        res.json({
            message : "order created successfully",
            orderId : createdOrder
        })

    }catch(err){
        res.status(500).json({
            message : "failed to create order",
            error : err
        })
    }




    //add current user name if not provided
    //orderid generate 
    //create order object
    
}