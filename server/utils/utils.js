// Load the Cloudant service config.
const vcap = require('../config/vcap-local.json');
  
// Load the Cloudant library.
var Cloudant = require('@cloudant/cloudant');

// Get account details from environment variables
var url = vcap.services.cloudantNoSQLDB.credentials.url;
var username = vcap.services.cloudantNoSQLDB.credentials.username;
var password = vcap.services.cloudantNoSQLDB.credentials.password;

// Initialize the library with url and credentials.
var cloudant = Cloudant({ url: url, username: username, password: password });

module.exports = {
    createCloudantDB: function createCloudantDB() {  
        var uniqueUserID = Math.random().toString(26).slice(2);
      
        cloudant.db.create('green-production').then(() => {
          cloudant.use('green-production').insert({ user_ID: uniqueUserID }, 'Users').then((data) => {
            console.log(data);
          });
        }).catch((err) => {
          console.log(err);
        });
    },
      
    getDocumentFromDB: function getDocumentFromDB() {  
        var mydb = cloudant.db.use('green-production');
        //var myData;
            
        return new Promise((resolve, reject) => {
            mydb.get('Users', (err, document) => {
                if (err) {
                    if (err.message == 'missing') {
                        logger.warn(`Document id ${id} does not exist.`, 'findById()');
                        resolve({ data: {}, statusCode: 404 });
                    } else {
                        logger.error('Error occurred: ' + err.message, 'findById()');
                        reject(err);
                    }
                } else {
                    resolve({ data: JSON.stringify(document), statusCode: 200 });
                }
            });
        });     

        //return myData;
    }

}
