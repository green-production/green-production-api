import {v1 as uuid} from 'uuid';
import utils from '../utils/utils.js';

export default async function(fastify, options, next) {

    //Create a new Products document(Admin API - One time)
    fastify.post('/api/products/new-products-doc', async (request, reply) => {

        //Create New Document
        var data = await utils.createProductsDocument(
        'Products', request.body.product_name, request.body.unit_price, request.body.quantity,
        request.body.product_material, request.body.recycling_code, request.body.seller_ID, request.body.seller_name,
        request.body.product_category, request.body.product_sub_category);
        
        reply.send(data)
    })

    
    //Create New Product
    fastify.post('/api/products/new-product', {
        preValidation: [fastify.authentication]
        }, async (request, reply) => {
        
        //Find all available docs
        var docList = await utils.findAllDocs();
        
        var id = '';
        var rev = '';
        var product_details = [];
        
        if(docList != null && docList.data != null && docList.data.total_rows > 0)
        {
            docList.data.rows.forEach(element => {
        
            //Extract information from Products document
            if(element.doc.type == 'Products')
            {
                id = element.id;
                rev = element.doc._rev;
                product_details = element.doc.product_details;
            }
            });
        }
        
        //Create new product object
        var newProductObj = {
            'product_ID': uuid(),
            ...request.body,
            'isApproved' : false,
            'created_dt': new Date().toISOString(),
            'updated_dt': new Date().toISOString()
        };
        
        //Modifiy existing User_Details array from document
        product_details.push(newProductObj);
        
        //Insert updated user details array in Users document
        var docInfo = await utils.insertProductInfo(id, rev, product_details);
        
        reply.code(201).send(docInfo)
    })

    
    // Get All Products
    fastify.get('/api/products', async (request, reply) => {
        
        //Find all available docs
        var docList = await utils.findAllDocs();
        
        var product_details = [];
    
        if(docList != null && docList.data != null && docList.data.total_rows > 0)
        {
            docList.data.rows.forEach(element => {
        
                //Extract information from Products document
                if(element.doc.type == 'Products')
                {
                product_details = element.doc.product_details;        
                }
            });    
        }
    
        reply.code(200).send(product_details)  
    })


    //Update Existing Product (Admin can use this to approve a product)
    fastify.post('/api/product/update-product', async (request, reply) => {
    
        //Find all available docs
        var docList = await utils.findAllDocs();
    
        var id = '';
        var rev = '';
        var product_details = [];
    
        var productID = request.body.product_ID;
    
        if(docList != null && docList.data != null && docList.data.total_rows > 0)
        {
            docList.data.rows.forEach(element => {
        
                //Extract information from Products document
                if(element.doc.type == 'Products')
                {
                id = element.id;
                rev = element.doc._rev;
                product_details = element.doc.product_details;
                }
            });
        }
    
        product_details.forEach(product => {
            if(product.product_ID == productID) {
                product = utils.mapProductUpdateToModel(product, request.body);
            }         
        });
    
        //Insert updated product details array in Products document
        var docInfo = await utils.insertProductInfo(id, rev, product_details);
    
        reply.send(docInfo)
    })
    

    // Get Product Info
    fastify.post('/api/product/product-info', async (request, reply) => {
        
        //Find all available docs
        var docList = await utils.findAllDocs();
    
        var product_ID = request.body.product_ID;
        var product_details = {};
    
        if(docList != null && docList.data != null && docList.data.total_rows > 0)
        {
            docList.data.rows.forEach(element => {
        
                //Extract information from Products document
                if(element.doc.type == 'Products')
                {
                element.doc.product_details.forEach(product => {
        
                    if(product.product_ID == product_ID) {
                    product_details = product;
                    }         
                });        
                }
            });    
        }
    
        reply.code(200).send(product_details) 
    })

    
    // Get Seller Listings
    fastify.post('/api/product/seller-listings', async (request, reply) => {
        
        //Find all available docs
        var docList = await utils.findAllDocs();
    
        var seller_ID = request.body.seller_ID;
        var product_details = [];
    
        if(docList != null && docList.data != null && docList.data.total_rows > 0)
        {
            docList.data.rows.forEach(element => {
        
                //Extract information from Products document
                if(element.doc.type == 'Products')
                {
                element.doc.product_details.forEach(product => {
        
                    if(product.seller_ID == seller_ID) {
                    product_details.push(product);
                    }         
                });        
                }
            });    
        }
    
        reply.code(200).send(product_details) 
    })

    next()
}