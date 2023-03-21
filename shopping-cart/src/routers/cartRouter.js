const express = require('express')
const {auth} = require('@raghu-shop/common')

const cartController = require('../controllers/cartController')

const cartRouter =new express.Router()

cartRouter.route('/api/cart/add').post(auth,(req,res)=>{cartController.addCart.config.handler(req,res)})
cartRouter.route('/api/cart/delete/:cart_id').delete(auth,(req,res)=>{cartController.deleteCart.config.handler(req,res)})
cartRouter.route('/api/cart/remove/:product_id').delete(auth,(req,res)=>{cartController.removeItemsInCart.config.handler(req,res)})
cartRouter.route('/api/cart/update/:product_id').patch(auth,(req,res)=>{cartController.updateCartItem.config.handler(req,res)})
module.exports = cartRouter;
