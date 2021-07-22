// Load the Cloudant library.
var Cloudant = require('@cloudant/cloudant');

//Load UUID
const { 
    v1: uuidv1,
    v4: uuidv4,
  } = require('uuid');

// Load the Cloudant service config.
const vcap = require('../config/vcap-local.json');

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

    findAllDocs: function findAllDocs(){
        var mydb = cloudant.db.use('green-production');

        return new Promise((resolve, reject) => {
            mydb.list({include_docs:true}, function (err, document) {
                if (err) {
                    if (err.message == 'missing') {
                        logger.warn(`Document id ${id} does not exist.`, 'findById()');
                        resolve({ data: {}, statusCode: 404 });
                    } else {
                        logger.error('Error occurred: ' + err.message, 'findById()');
                        reject(err);
                    }
                } else {
                    resolve({ data: document, statusCode: 200 });
                }
            });
        });
    },
      
    getDocumentFromDB: function getDocumentFromDB(docName) {  
        var mydb = cloudant.db.use('green-production');
        //var myData;
            
        return new Promise((resolve, reject) => {
            mydb.get(docName, (err, document) => {
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
    },

    createDocument: function createDocument(
        docName,
        userName,
        password,
        email,
        full_name,
        dob,
        gender,
        security_question_ID,
        sercure_answer,
        street_address_1,
        street_address_2,
        city,
        state,
        zip,
        country,
        role,
        sold_product_ID
        ) {
        var mydb = cloudant.db.use('green-production');

        return new Promise((resolve, reject) => {
            let listId = uuidv4();
            let whenCreated = Date.now();
            let list = {
                _id: listId,
                type: docName,
                user_details: [
                    {                    
                    'user_ID': listId,
                    'user_name' : userName,
                    'password' : password,
                    'email' : email,
                    'full_name' : full_name,
                    'dob' : dob,
                    'gender' : gender,
                    'security_question_ID' : security_question_ID,
                    'secure_answer' : sercure_answer,
                    'street_address_1' : street_address_1,
                    'street_address_2' : street_address_2,
                    'city' : city,
                    'state' : state,
                    'zip' : zip,
                    'country' : country,
                    'role' : role,
                    'sold_product_ID' : sold_product_ID
                }],
                created_dt: whenCreated,
                updated_dt: Date.now()
            };
            mydb.insert(list, (err, result) => {
                if (err) {
                    logger.error('Error occurred: ' + err.message, 'create()');
                    reject(err);
                } else {
                    resolve({ data: { createdId: result.id, createdRevId: result.rev }, statusCode: 201 });
                }
            });
        });
    },

    insertUserInfo: function insertUserInfo(id) {
        var mydb = cloudant.db.use('green-production');

        return new Promise((resolve, reject) => {
            // Retrieve the list (need the rev)
            findById(id).then((response) => {
                console.log('response', response);
                // // Parse the stringified JSON
                // let list = JSON.parse(response.data);
                // // Update the description
                // list.description = description;
                // list.whenModified = Date.now();
                // // Update the document in Cloudant
                // db.insert(list, (err, response) => {
                //     if (err) {
                //         logger.error('Error occurred: ' + err.message, 'update()');
                //         reject(err);
                //     } else {
                //         resolve({ data: { updatedId: response.id, updatedRevId: response.rev }, statusCode: 200 });
                //     }
                // });
            }).catch((err) => {
                logger.error('Error occurred: ' + err.message, 'update()');
                reject(err);
            });
        });
    }

}
