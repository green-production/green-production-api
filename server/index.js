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

// Get User-Info route
fastify.get('/', async function (request, reply) {

  var data = new Date();

  reply.send(data)
})

// Get User-Info route
fastify.get('/get-user', async function (request, reply) {

  //Get Document by ID
  //var data = await utils.getDocumentFromDB('Users');
  
  //createCloudantDB();

  reply.send(data)
})

//Create New User
fastify.post('/new-user', async function (request, reply) {

  // //Create New Document
  // var data = await utils.createUsersDocument(
  //   'Users', 'soham.chattopadhyay', 'test123','soham.chattopadhyay93@gmail.com',
  //   'Soham Chattopadhyay', '01/01/1905', 'M', '1', 'Kolkata',
  //   'Selimpur Road, Dhakuria', '', 'Kolkata', 'WB', '700031', 'India',
  //   'Role_Consumer', ''
  // );

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

// Run the server!
fastify.listen(3000, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  fastify.log.info(`server listening on ${address}`)
})