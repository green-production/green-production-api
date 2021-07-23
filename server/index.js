// Require the framework and instantiate it
const fastify = require('fastify')({
  logger: true
})

//Load UUID
const { 
  v1: uuidv1,
  v4: uuidv4,
} = require('uuid');

const utils = require('./utils/utils');

// Test API
fastify.get('/', async function (request, reply) {

  var data = new Date();

  reply.send(data)
})

//Create a new Users document(Admin API - One time)
fastify.post('/new-users-doc', async function (request, reply) {

  //Create New Document
  var data = await utils.createUsersDocument(
    'Users', request.body.user_name, request.body.password, request.body.email,
    request.body.full_name, request.body.dob, request.body.gender,
    request.body.security_question_ID, request.body.secure_answer,
    request.body.street_address_1, request.body.street_address_2,
    request.body.city, request.body.state, request.body.zip, request.body.country,
    request.body.role, request.body.sold_product_ID);

  reply.send(data)
})

// Get User-Info route
fastify.post('/get-user', async function (request, reply) {
  
  //Find all available docs
  var docList = await utils.findAllDocs();
  var username = request.body.userName;
  var password = request.body.password

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

          if(user.user_name == username && user.password == password) {
            user_details = user;
          }         
        });        
      }
    });    
  }

  if(user_details != null && user_details.user_name) {
    reply.code(200).send(user_details)
  }
  else {
    reply.code(401).send(user_details)
  }  
})

//Create New User
fastify.post('/new-user', async function (request, reply) {

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

  //Create new user object
  var UserObj = {
    'user_ID': uuidv1(),
    'user_name' : request.body.user_name,
    'password' : request.body.password,
    'email' : request.body.email,
    'full_name' : request.body.full_name,
    'dob' : request.body.dob,
    'gender' : request.body.gender,
    'security_question_ID' : request.body.security_question_ID,
    'secure_answer' : request.body.secure_answer,
    'street_address_1' : request.body.street_address_1,
    'street_address_2' : request.body.street_address_2,
    'city' : request.body.city,
    'state' : request.body.state,
    'zip' : request.body.zip,
    'country' : request.body.country,
    'role' : request.body.role,
    'sold_product_ID' : request.body.sold_product_ID,
    'created_dt': new Date(Date.now()).toISOString(),
    'updated_dt': new Date(Date.now()).toISOString()
  };

  //Modifiy existing User_Details array from document
  user_details.push(UserObj);

  //Insert updated user details array in Users document
  var docInfo = await utils.insertUserInfo(id, rev, user_details);

  reply.send(docInfo)
})

//Update Existing User
fastify.post('/update-user', async function (request, reply) {

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
      user = utils.mapUserUpdatetoModel(user, request.body);
    }         
  });

  //Insert updated user details array in Users document
  var docInfo = await utils.insertUserInfo(id, rev, user_details);

  reply.send(docInfo)
})

//Create a new Products document(Admin API - One time)
fastify.post('/new-product-doc', async function (request, reply) {

  //Create New Document
  var data = await utils.createProductsDocument(
    'Products', request.body.productName, request.body.unitPrice, request.body.quantity,
    request.body.productMaterial, request.body.recyclingCode, request.body.sellerID, request.body.sellerName,
    request.body.productCategory, request.body.productSubCategory);
    
  reply.send(data)
})

// Run the server!
fastify.listen(3000, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  fastify.log.info(`server listening on ${address}`)
})