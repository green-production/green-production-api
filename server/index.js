// Require the framework and instantiate it
import Fastify from 'fastify'
const fastify = Fastify({logger: true})
import swagger from 'fastify-swagger'
import jwt from 'fastify-jwt'
import auth from './middleware/auth.js'

//Load UUID
import {v1 as uuid} from 'uuid';
import utils from './utils/utils.js';

fastify.register(jwt, {
  secret: process.env.JWT_SECRET_KEY
})

fastify.register(swagger, {
  exposeRoute: true,
  routePrefix: '/docs',
  swagger: {
    info: {
      title: 'GreenyTale',
      description: 'Testing GreenyTale API',
      version: '1.0.0'
    },
    host: 'localhost'
  }
})

fastify.register(auth)

// Test API
fastify.get('/api', async function (request, reply) {

  var data = new Date();

  reply.send({ hello: 'The time is ' + data })
})

//Create a new Users document(Admin API - One time)
fastify.post('/api/new-users-doc', async function (request, reply) {

  //Create New Document
  var data = await utils.createUsersDocument(
    'Users', request.body.user_name, request.body.password, request.body.email,
    request.body.full_name, request.body.dob, request.body.gender,
    request.body.secure_login_recovery,
    request.body.street_address_1, request.body.street_address_2,
    request.body.city, request.body.state, request.body.zip, request.body.country,
    request.body.role, request.body.sold_product_ID);

  reply.send(data)
})

// Get User-Info
fastify.post('/api/login', async function (request, reply) {
  try {
    const {userName, password} = request.body

    //Find all available docs
    var docList = await utils.findAllDocs();
  
    var id = '';
    var rev = '';
    var user_details = {};
  
    if(docList != null && docList.data != null && docList.data.total_rows > 0)
    {
      docList.data.rows.forEach(element => {
  
        //Extract information from Users document
        if(element.doc.type == 'Users')
        {
          id = element.id;
          rev = element.doc._rev;
  
          element.doc.user_details.forEach(user => {
  
            if(user.user_name == userName && user.password == password) {
              user_details = user;
              user_details.token = fastify.jwt.sign({userName, password}, {expiresIn: '1 day'})
            }         
          });        
        }
      });    
    }
  
    if(user_details != null && user_details.user_name) {
      reply.code(200).send(user_details)
    } else {
      throw new Error()
    }  
  } catch (err) {
    reply.code(400).send(err)
  }
})

//Create New User
fastify.post('/api/new-user', async function (request, reply) {
  try {
    const {user_name, password} = request.body

    //Find all available docs
    var docList = await utils.findAllDocs();
  
    var id = '';
    var rev = '';
    var user_details = [];
  
    if(docList != null && docList.data != null && docList.data.total_rows > 0)
    {
      docList.data.rows.forEach(element => {
  
        //Extract information from Users document
        if(element.doc.type == 'Users')
        {
          id = element.id;
          rev = element.doc._rev;
          user_details = element.doc.user_details;
        }
      });
    }

    const token = fastify.jwt.sign({user_name, password}, {expiresIn: '1 day'})
  
    //Create new user object
    var UserObj = {
      ...request.body,
      token,
      'created_dt': new Date().toISOString(),
      'updated_dt': new Date().toISOString()
    };
  
    //Modifiy existing User_Details array from document
    user_details.push(UserObj);
  
    //Insert updated user details array in Users document
    var docInfo = await utils.insertUserInfo(id, rev, user_details);
  
    reply.code(201).send(UserObj)
  } catch (err) {
    reply.code(400).send(err)
  }

})

//Update Existing User
fastify.post('/api/update-user', async function (request, reply) {

  //Find all available docs
  var docList = await utils.findAllDocs();

  var id = '';
  var rev = '';
  var user_details = [];

  var userID = request.body.user_ID;

  if(docList != null && docList.data != null && docList.data.total_rows > 0)
  {
    docList.data.rows.forEach(element => {

      //Extract information from Users document
      if(element.doc.type == 'Users')
      {
        id = element.id;
        rev = element.doc._rev;
        user_details = element.doc.user_details;
      }
    });
  }

  user_details.forEach(user => {
    if(user.user_ID == userID) {
      user = utils.mapUserUpdateToModel(user, request.body);
    }         
  });

  //Insert updated user details array in Users document
  var docInfo = await utils.insertUserInfo(id, rev, user_details);

  reply.send(docInfo)
})


//Create a new Products document(Admin API - One time)
fastify.post('/api/new-products-doc', async function (request, reply) {

  //Create New Document
  var data = await utils.createProductsDocument(
    'Products', request.body.product_name, request.body.unit_price, request.body.quantity,
    request.body.product_material, request.body.recycling_code, request.body.seller_ID, request.body.seller_name,
    request.body.product_category, request.body.product_sub_category);
    
  reply.send(data)
})

//Create New Product
async function newProduct(fastify) {
  // fastify.addHook('preValidation', ()=>[fastify.authentication])
  fastify.post('/api/new-product', {
    preValidation: [fastify.authentication]
  }, async function (request, reply) {
  
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
      'product_name' : request.body.product_name,
      'unit_price' : request.body.unit_price,
      'quantity' : request.body.quantity,
      'product_material' : request.body.product_material,
      'recycling_code' : request.body.recycling_code,
      'seller_ID' : request.body.seller_ID,
      'seller_name' : request.body.seller_name,
      'product_category' : request.body.product_category,
      'product_sub_category' : request.body.product_sub_category,
      'isApproved' : false,
      'created_dt': new Date().toISOString(),
      'updated_dt': new Date().toISOString()
    };
  
    //Modifiy existing User_Details array from document
    product_details.push(newProductObj);
  
    //Insert updated user details array in Users document
    var docInfo = await utils.insertProductInfo(id, rev, product_details);
  
    reply.send(docInfo)
  })
}

fastify.register(newProduct)

//Update Existing Product (Admin can use this to approve a product)
fastify.post('/api/update-product', async function (request, reply) {

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

// Get All Products
fastify.get('/api/get-all-products', async function (request, reply) {
  
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

// Get Product Info
fastify.post('/api/get-product-info', async function (request, reply) {
  
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
fastify.post('/api/get-seller-listings', async function (request, reply) {
  
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


//Create a new Cart document(Admin API - One time)
fastify.post('/api/new-cart-doc', async function (request, reply) {

  //Create New Document
  var data = await utils.createCartDocument(
    'Cart', request.body.user_ID, request.body.products);
    
  reply.send(data)
})

// Run the server!
fastify.listen(process.env.PORT, '0.0.0.0', function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  fastify.log.info(`server listening on ${address}`)
})