import {v1 as uuid} from 'uuid';
import utils from '../utils/utils.js';
import producthelper from '../helper/producthelper.js';

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
        var product_details = [];
        
        //Get all product details
        const {productID, productRev, productDetails} = producthelper.getAllProducts(docList);
        
        product_details = producthelper.newProductObj(productDetails, request);
        
        //Insert updated product details array in products document
        var docInfo = await utils.insertProductInfo(productID, productRev, product_details);
        
        reply.code(201).send(docInfo)
    })
    
    // Get All Products
    fastify.get('/api/products', async (request, reply) => {
        
        //Find all available docs
        var docList = await utils.findAllDocs();
        
        //Get all product details
        const {productID, productRev, productDetails} = producthelper.getAllProducts(docList);
    
        reply.code(200).send(productDetails)  
    })

    //Update Existing Product (Admin can use this to approve a product)
    fastify.post('/api/product/update-product', {
        preValidation: [fastify.authentication]
        }, async (request, reply) => {
    
        //Find all available docs
        var docList = await utils.findAllDocs();
    
        let prod_ID = request.body.product_ID;
    
        let product_details = [];
        
        //Get all product details
        const {productID, productRev, productDetails} = producthelper.getAllProducts(docList);

        product_details = productDetails;
    
        product_details.forEach(product => {
            if(product.product_ID == prod_ID) {
                product = utils.mapProductUpdateToModel(product, request.body);
            }         
        });
    
        //Insert updated product details array in Products document
        var docInfo = await utils.insertProductInfo(productID, productRev, product_details);
    
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
    fastify.post('/api/product/seller-listings', {
        preValidation: [fastify.authentication]
        }, async (request, reply) => {
        
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