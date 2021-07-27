import carthelper from '../helper/cartHelper.js';
import utils from '../utils/utils.js';

export default async function(fastify, options, next) {

    //Create a new Cart document(Admin API - One time)
    fastify.post('/api/cart/new-cart-doc', async (request, reply) => {

        //Create New Document
        var data = await utils.createCartDocument('Cart', request.body.user_ID, request.body.products);
        
        reply.code(201).send(data)
    })

    //Add new user's selection in cart
    fastify.post('/api/cart/new-cart', {
        preValidation: [fastify.authentication]
        }, async (request, reply) => {

        const {user_ID} = request.body
    
        //Find all available docs
        let docList = await utils.findAllDocs();
        let cart_details = []; 

        const {id, rev, cartdetails} = carthelper.getAllCarts(docList);

        cart_details = cartdetails;
      
        //Create new Cart object for new user
        let cartObj = {
          'user_ID': user_ID,
          ...request.body,
          'created_dt': new Date().toISOString(),
          'updated_dt': new Date().toISOString()
        };
      
        //Modifiy existing User_Details array from document
        cart_details.push(cartObj);
      
        //Insert updated cart details array in Cart document
        let docInfo = await utils.insertCartItem(id, rev, cart_details);
      
        reply.code(201).send(docInfo)
    
    })

    //Update Existing User products in cart
    fastify.post('/api/cart/update-cart', {
        preValidation: [fastify.authentication]
        }, async (request, reply) => {
            
        const {user_ID} = request.body
    
        //Find all available docs
        let docList = await utils.findAllDocs();
        let cart_details = [];  

        const {id, rev, cartdetails} = carthelper.getAllCarts(docList);

        cart_details = cartdetails;
    
        cart_details.forEach(cart => {
            if(cart.user_ID == user_ID) {
                cart = utils.mapCartUpdateToModel(cart, request.body);
            }         
        });
    
        //Insert updated user details array in Users document
        let docInfo = await utils.insertCartItem(id, rev, cart_details);
    
        reply.send(docInfo)
    })

    //Update Existing User products in cart
    fastify.post('/api/cart/delete-cart', {
      preValidation: [fastify.authentication]
      }, async (request, reply) => {
          
      const {user_ID} = request.body
  
      //Find all available docs
      let docList = await utils.findAllDocs();
      let cart_details = []; 

      const {id, rev, cartdetails} = carthelper.getAllCarts(docList);

      cart_details = cartdetails;
  
      cart_details = utils.removeCartByUserID(cart_details, 'user_ID', user_ID);
  
      //Insert updated user details array in Users document
      let docInfo = await utils.insertCartItem(id, rev, cart_details);
  
      reply.send(docInfo)
    })

    next()
}