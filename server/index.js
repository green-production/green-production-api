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
fastify.get('/get-user', async function (request, reply) {

  //Get Document by ID
  //var data = await utils.getDocumentFromDB('Users');
  
  //createCloudantDB();

  reply.send({ data: data })
})

//Create New User
fastify.get('/new-user', async function (request, reply) {

  //Get Document
  //var data = await utils.getDocumentFromDB('Users');

  // //Create Document
  // var data = await utils.createDocument(
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
      console.log('element', element);
      console.log('type', element.doc.type);
      console.log('user-details', element.doc.user_details);

      if(element.doc.type == 'Users')
      {
        id = element.id;
        rev = element.doc._rev;
        user_details = element.doc.user_details;
      }
      console.log('id', id);
      console.log('user_details', user_details);
    });
  }

  var UserObj = {
    'user_ID': uuidv1(),
    'user_name' : 'soumya.das',
    'password' : 'test12344',
    'email' : 'soumya.das@gmai.com',
    'full_name' : 'Soumya Das',
    'dob' : '01/02/1931',
    'gender' : 'M',
    'security_question_ID' : '1',
    'secure_answer' : 'Kolkata',
    'street_address_1' : 'ABC Street',
    'street_address_2' : 'Street 2',
    'city' : 'Kolkata',
    'state' : 'WB',
    'zip' : '700032',
    'country' : 'India',
    'role' : 'Role_Consumer',
    'sold_product_ID' : ''
  };

  user_details.push(UserObj);
  console.log('newUserDetails', user_details);

  var docInfo = await utils.insertUserInfo(id, rev, user_details);
  console.log('docinfo', docInfo);   

  reply.send(docList.data)
})

// Run the server!
fastify.listen(3000, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  fastify.log.info(`server listening on ${address}`)
})