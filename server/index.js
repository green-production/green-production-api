// Require the framework and instantiate it
const fastify = require('fastify')({
  logger: true
})

// Declare a route
fastify.get('/', function (request, reply) {

  getDocumentFromDB();
  
  //createCloudantDB();

  reply.send({ hello: 'world' })
})

// Run the server!
fastify.listen(3000, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  fastify.log.info(`server listening on ${address}`)
})


function createCloudantDB() {
  const vcap = require('../server/config/vcap-local.json');

  // Load the Cloudant library.
  var Cloudant = require('@cloudant/cloudant');

  // Get account details from environment variables
  var url = vcap.services.cloudantNoSQLDB.credentials.url;
  var username = vcap.services.cloudantNoSQLDB.credentials.username;
  var password = vcap.services.cloudantNoSQLDB.credentials.password;

  // Initialize the library with url and credentials.
  var cloudant = Cloudant({ url: url, username: username, password: password });

  var uniqueUserID = Math.random().toString(26).slice(2);

  cloudant.db.create('green-production').then(() => {
    cloudant.use('green-production').insert({ user_ID: uniqueUserID }, 'Users').then((data) => {
      console.log(data);
    });
  }).catch((err) => {
    console.log(err);
  });
}

function getDocumentFromDB() {
  const vcap = require('../server/config/vcap-local.json');

  // Load the Cloudant library.
  var Cloudant = require('@cloudant/cloudant');

  // Get account details from environment variables
  var url = vcap.services.cloudantNoSQLDB.credentials.url;
  var username = vcap.services.cloudantNoSQLDB.credentials.username;
  var password = vcap.services.cloudantNoSQLDB.credentials.password;

  // Initialize the library with url and credentials.
  var cloudant = Cloudant({ url: url, username: username, password: password });

  var mydb = cloudant.db.use('green-production');
  
  const myData = mydb.get('Users', function(err, data) {
    console.log('data',data);   
  });

  console.log('myData',myData);  

  if(myData != null) {
    return true;
  }      
  else {
    return false;
  }
}