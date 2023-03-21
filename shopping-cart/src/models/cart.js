const mongoose = require('mongoose');
const {ResponseMessages,StatusCodes,ErrorHandler} = require('@raghu-shop/common')

const cartSchema = new mongoose.Schema({
    products:[
        {
            productId: {type:Number,required:true,unique: true},
            quantity: {type:Number,required:true},
            name: {type:String,required:true},
            price: {type:Number,required:true},     
        }
    ],
    modifiedOn: {
        type: Date,
        default: Date.now
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User' ,
        index: true,
        unique: true,
        required:true 
    }
},{timestamps:true})

cartSchema.path('products').validate(function(products){
    if(!products){return false}
    else if(products.length === 0){return false}
    return true;
}, 'Cart needs to have at least one product');

cartSchema.statics.createCart = async(cartDetails)=>{
    try {
        const cart = new Cart(cartDetails)
        if(!cart)throw new ErrorHandler(ResponseMessages.ERROR,StatusCodes.FORBIDDEN)
        await cart.save();
        return cart      
    } catch (error) {
        error.status = error.code || StatusCodes.SERVICE_UNAVAILABLE;
        throw error;
    }

}
cartSchema.statics.getUserCart = async(user_id)=>{
    try {
        const cart =await Cart.findOne({user:user_id})
        if(cart)return cart
        return false
    } catch (error) {
        error.status = StatusCodes.SERVICE_UNAVAILABLE;
        throw error;   
    }

}

cartSchema.statics.deleteCart = async(condition)=>{
    try {
        const cart = await Cart.findByIdAndDelete(condition)
        if(!cart)throw new ErrorHandler(ResponseMessages.ERROR,StatusCodes.FORBIDDEN)
        return cart       
    } catch (error) {
        error.status = error.code || StatusCodes.SERVICE_UNAVAILABLE;
        throw error;        
    }
}

cartSchema.statics.findProductInCart = async(condition)=>{
    try {
        const cart = await Cart.findOne(condition)
        if(!cart)throw new ErrorHandler(ResponseMessages.ERROR,StatusCodes.FORBIDDEN)
        return cart;
    } catch (error) {
        error.status = error.code || StatusCodes.SERVICE_UNAVAILABLE;
        throw error;  
    }
}

cartSchema.statics.deleteUserCart = async(condition)=>{
    try {
        const cart = await Cart.deleteOne(condition)
        if(!cart)throw new ErrorHandler(ResponseMessages.ERROR,StatusCodes.FORBIDDEN)
        return cart       
    } catch (error) {
        error.status = error.code || StatusCodes.SERVICE_UNAVAILABLE;
        throw error;        
    }
}
//method to hide private data / send only public data to api response
cartSchema.methods.toJSON = function(){
    const cart = this
    const cartObject = cart.toObject()
    delete cartObject.user
    return cartObject
}

const Cart = mongoose.model('Cart',cartSchema)

module.exports =Cart