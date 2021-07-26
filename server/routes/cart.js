import utils from '../utils/utils.js';

export default async function(fastify, options, next) {

    //Create a new Cart document(Admin API - One time)
    fastify.post('/api/new-cart-doc', async (request, reply) => {

        //Create New Document
        var data = await utils.createCartDocument('Cart', request.body.user_ID, request.body.products);
        
        reply.code(201).send(data)
    })

    next()
}