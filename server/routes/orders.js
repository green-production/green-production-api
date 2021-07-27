import utils from '../utils/utils.js';
import orderhelper from '../helper/orderhelper.js';

export default async function(fastify, options, next) {

    //Create a new Orders document(Admin API - One time)
    fastify.post('/api/orders/new-orders-doc', async (request, reply) => {

        //Create New Document
        var data = await utils.createOrdersDocument('Orders', request.body.user_ID, request.body.products);
        
        reply.code(201).send(data)
    })

    //Add new Order in cart
    fastify.post('/api/orders/new-order', {
        preValidation: [fastify.authentication]
        }, async (request, reply) => {

        const {user_ID, products} = request.body
    
        //Find all available Orders docs
        let docList = await utils.findAllDocs();
        let transaction_details = [];
        
        //Get all order details
        const {orderID, orderRev, transactionDetails} = orderhelper.getAllOrders(docList);

        //Insert new order object in the array
        transaction_details = orderhelper.newOrderObj(user_ID, products, transactionDetails);
      
        //Step 1: Insert order in Orders document
        let orderDocInfo = await utils.inserOrder(orderID, orderRev, transaction_details);

        //Step 2: Delete entry from Cart

        let cart_details = []; 

        const {cartID, cartRev, cartdetails} = carthelper.getAllCarts(docList);

        cart_details = utils.removeCartByUserID(cartdetails, 'user_ID', user_ID);

        //Insert updated user details array in Users document
        let cartDocInfo = await utils.insertCartItem(cartID, cartRev, cart_details);

        //Send reply
        reply.code(201).send(orderDocInfo)
    
    })

    next()
}