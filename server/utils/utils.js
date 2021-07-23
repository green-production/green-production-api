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

    //Create Cloudant DB function
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

    //Find all docs in a DB
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

    //Fetch document based on doc name(doc ID)      
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

    //#region Users Document helper Functions

    //Create new Users document
    createUsersDocument: function createUsersDocument(
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
            let list = {
                _id: listId,
                type: docName,
                user_details: [
                    {                    
                    'user_ID': uuidv1(),
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
                    'sold_product_ID' : sold_product_ID,
                    'created_dt': new Date(Date.now()).toISOString(),
                    'updated_dt': new Date(Date.now()).toISOString()
                }],
                
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

    //Insert new user-datails in Users document
    insertUserInfo: function insertUserInfo(id, rev, newUserDetails) {
        var mydb = cloudant.db.use('green-production');

        return new Promise((resolve, reject) => { 
            let list = {
                _id: id,
                type: 'Users',
                _rev: rev,
                user_details: newUserDetails
            };
            mydb.insert(list, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({ data: { updatedId: response.id, updatedRevId: response.rev }, statusCode: 200 });
                }
            });
        });
    },

    //#endregion

    //#region Products Document helper functions

    //Create new Users document
    createProductsDocument: function createProductsDocument(
        docName,
        productName,
        unitPrice,
        quantity,
        productMaterial,
        recyclingCode,
        sellerID,
        sellerName,
        productCategory,
        productSubCategory
        ) {
        var mydb = cloudant.db.use('green-production');

        return new Promise((resolve, reject) => {
            let listId = uuidv4();
            let list = {
                _id: listId,
                type: docName,
                product_details: [
                    {                    
                    'product_ID': uuidv1(),
                    'product_name' : productName,
                    'unit_price' : unitPrice,
                    'quantity' : quantity,
                    'product_material' : productMaterial,
                    'recycling_code' : recyclingCode,
                    'seller_ID' : sellerID,
                    'seller_name' : sellerName,
                    'product_category' : productCategory,
                    'product_sub_category' : productSubCategory,
                    'isApproved' : false,
                    'created_dt': new Date(Date.now()).toISOString(),
                    'updated_dt': new Date(Date.now()).toISOString()
                }],
                
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

    //#endregion

}
