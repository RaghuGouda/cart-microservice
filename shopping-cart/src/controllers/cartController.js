const cartController={}

const cartFactory = require('../factory/cartFactory')

cartController.addCart = {
    description: 'Add Cart',
    notes: 'Add Cart',
    tags: ['api','Cart'],
    config:{
        handler: (req,res)=>{
            cartFactory.addCart(req,res)
        }
    }  
}

cartController.deleteCart = {
    description: 'Delete Cart',
    notes: 'Delete Cart',
    tags: ['api','Cart'],
    config:{
        handler: (req,res)=>{
            cartFactory.deleteCart(req,res)
        }
    }  
}

cartController.removeItemsInCart = {
    description: 'Remove Items',
    notes: 'Remove Items',
    tags: ['api','Cart'],
    config:{
        handler: (req,res)=>{
            cartFactory.removeItemsInCart(req,res)
        }
    }  
}

cartController.updateCartItem = {
    description: 'update Cart',
    notes: 'update Cart',
    tags: ['api','Cart'],
    config:{
        handler: (req,res)=>{
            cartFactory.updateCartItem(req,res)
        }
    }  
}

module.exports = cartController