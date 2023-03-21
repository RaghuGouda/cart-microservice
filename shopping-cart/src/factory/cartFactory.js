const Cart = require('../models/cart');
const {Response,ResponseMessages,StatusCodes,verifyId,ErrorHandler} = require('@raghu-shop/common')
const natsWrapper= require('../nats-wrapper') 
const Publisher =require('../base-publisher')

const addCart =async (req,res)=>{
//logic to make product id unique
const productArr = req.body.products.map((item)=>item.productId);
const isDuplicate = productArr.some((item, idx)=>productArr.indexOf(item) != idx);
    if(isDuplicate){
     return res.status(StatusCodes.BAD_REQUEST).json(Response.sendResponse(false,null,ResponseMessages.PRODUCT_EXISTS,StatusCodes.BAD_REQUEST))
    }

    const condition = {
        ...req.body,
        user:req.decoded._id
    }
    try {
        const userCart =await Cart.getUserCart(req.decoded._id)
        //check existing cart
        if(userCart){

            req.body.products.forEach((item)=>{
                     userCart.products.some((el)=> {
                        if(el.productId === item.productId){
                        throw new Error(ResponseMessages.PRODUCT_EXISTS)
                        }
                      });
             })

            userCart.products.push(...req.body.products);
            await userCart.save(); 
            new Publisher(natsWrapper._client).publishEvent('add-product', req.body)
           return res.status(StatusCodes.OK).json(Response.sendResponse(true,userCart,ResponseMessages.SUCCESS,StatusCodes.OK))     
        }
        //create new cart
        const newCart = await Cart.createCart(condition)
        new Publisher(natsWrapper._client).publishEvent('add-product', newCart)

        res.status(StatusCodes.CREATED).json(Response.sendResponse(true,newCart,ResponseMessages.SUCCESS,StatusCodes.CREATED))     
    } catch (err) {
        res.status(err.status || StatusCodes.INTERNAL_SERVER_ERROR).json(Response.sendResponse(false,null,err.message || ResponseMessages.ERROR,err.status || StatusCodes.INTERNAL_SERVER_ERROR))
    } 
}
const deleteCart = async (req,res)=>{
    const condition = {
        _id:req.params.cart_id
    }
        try {
            if(!await verifyId(req.params.cart_id))throw new ErrorHandler(ResponseMessages.INVALID_ID,StatusCodes.BAD_REQUEST)
            const cart = await Cart.deleteCart(condition)
            // new Publisher(natsWrapper._client).publishEvent('remove-product', cart)
            return res.status(StatusCodes.OK).json(Response.sendResponse(true,cart,ResponseMessages.SUCCESS,StatusCodes.OK))     
        } catch (err) {
            res.status(err.status || StatusCodes.INTERNAL_SERVER_ERROR).json(Response.sendResponse(false,null,err.message || ResponseMessages.ERROR,err.status || StatusCodes.INTERNAL_SERVER_ERROR))
        }
}

const removeItemsInCart = async(req,res)=>{
    const condition ={'products.productId':req.params.product_id}
   try {
    // if(!await verifyId(req.params.product_id))throw new ErrorHandler(ResponseMessages.INVALID_ID,StatusCodes.BAD_REQUEST)

        const cart = await Cart.findProductInCart(condition)

        cart.products.forEach((item) => {
            if(item.productId == req.params.product_id) {

                if(req.query.quantity<=item.quantity){
                    item.quantity = item.quantity - req.query.quantity;
                }
                else{
                    throw new Error(ResponseMessages.INVALID_QUANTITY);
                }       
            }
        });
        cart.products = cart.products.filter(items=> {return items.quantity!=0})

        if(cart.products.length===0){
            const userInfo = {user:req.decoded._id}
            const cart = await Cart.deleteUserCart(userInfo)
            return res.status(StatusCodes.OK).json(Response.sendResponse(true,cart,ResponseMessages.NO_PRODUCTS_IN_CART,StatusCodes.OK))     
        }
        await cart.save()
        new Publisher(natsWrapper._client).publishEvent('remove-product', {'productId':req.params.product_id,'quantity':req.query.quantity})
        res.status(StatusCodes.OK).json(Response.sendResponse(true,cart,ResponseMessages.CART_UPDATED,StatusCodes.OK))     
    } catch (err) {
        res.status(err.status || StatusCodes.INTERNAL_SERVER_ERROR).json(Response.sendResponse(false,null,err.message || ResponseMessages.ERROR,err.status || StatusCodes.INTERNAL_SERVER_ERROR))
    }
}

const updateCartItem = async(req,res)=>{
    const condition ={'products.productId':req.params.product_id}

    try {
        // if(!await verifyId(req.params.product_id))throw new ErrorHandler(ResponseMessages.INVALID_ID,StatusCodes.BAD_REQUEST)

        const cart = await Cart.findProductInCart(condition)
        console.log("cart",cart)
       cart.products.forEach((item)=>{
           if(req.params.product_id === item.productId.toString()){
            item.quantity += +req.query.quantity
           }
       })
       await cart.save()
       new Publisher(natsWrapper._client).publishEvent('update-product', {'productId':req.params.product_id,'quantity':req.query.quantity})
       res.status(StatusCodes.OK).json(Response.sendResponse(true,cart,ResponseMessages.CART_UPDATED,StatusCodes.OK))     
    } catch (err) {
        res.status(err.status || StatusCodes.INTERNAL_SERVER_ERROR).json(Response.sendResponse(false,null,err.message || ResponseMessages.ERROR,err.status || StatusCodes.INTERNAL_SERVER_ERROR))
    }
}

module.exports = { 
    addCart,
    deleteCart,
    removeItemsInCart,
    updateCartItem
}