import utils from '../utils/utils.js';
import {v1 as uuidv1} from 'uuid';

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
    
        //Find all available docs
        let docList = await utils.findAllDocs();
      
        let id = '';
        let rev = '';
        let transaction_details = [];
      
        if(docList != null && docList.data != null && docList.data.total_rows > 0)
        {
          docList.data.rows.forEach(element => {
      
            //Extract information from Orders document
            if(element.doc.type == 'Orders')
            {
              id = element.id;
              rev = element.doc._rev;
              transaction_details = element.doc.transaction_details;
            }
          });
        }
      
        //Create new transaction object for new user
        let transactionObj = {
          'user_ID': user_ID,
          'transactions': [
              {
                'transactionID': uuidv1(),
                'products': products
              }
          ],
          'created_dt': new Date().toISOString()
        };
      
        //Modifiy existing User_Details array from document
        transaction_details.push(transactionObj);
      
        //Step 1: Insert order in Orders document
        let docInfo = await utils.inserOrder(id, rev, transaction_details);

        //Step 2: Delete entry from Cart
        
      
        reply.code(201).send(docInfo)
    
    })

    next()
}