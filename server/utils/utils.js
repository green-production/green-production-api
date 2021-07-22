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
    
        return mydb.get('Users', function(err, data) {
          console.log('data',data);  
          //myData = JSON.stringify(data); 
        });

        //return myData;
    }

}
