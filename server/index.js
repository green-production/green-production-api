// Require the framework and instantiate it
const fastify = require('fastify')({
  logger: true
})

const utils = require('./utils/utils');

// Declare a route
fastify.get('/', function (request, reply) {

  var data = utils.getDocumentFromDB();
  console.log('Get-DB-Data', data);
  
  //createCloudantDB();

  reply.send({ data: data })
})

// Run the server!
fastify.listen(3000, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  fastify.log.info(`server listening on ${address}`)
})