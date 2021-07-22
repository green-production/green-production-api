// Require the framework and instantiate it
const fastify = require('fastify')({
  logger: true
})

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

  //Create Document
  // var data = await utils.createDocument(
  //   'Users', 'soham.chattopadhyay', 'test123','soham.chattopadhyay93@gmail.com',
  //   'Soham Chattopadhyay', '01/01/1905', 'M', '1', 'Kolkata',
  //   'Selimpur Road, Dhakuria', '', 'Kolkata', 'WB', '700031', 'India',
  //   'Role_Consumer', ''
  // );

  //Find all available docs
  var docList = await utils.findAllDocs();

  if(docList != null && docList.data != null && docList.data.rows.length > 0)
  {
    docList.data.rows.forEach(element => {
      console.log('element', element);
      console.log('type', element.doc.type);
      console.log('user-details', element.doc.user_details);
    });
  }

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