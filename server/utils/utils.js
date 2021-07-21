const Cloudant = require('@cloudant/cloudant');

const vcap = require('../config/vcap-local.json');

function dbCloudantConnect() {
    return new Promise((resolve, reject) => {
        Cloudant({ 
            url: vcap.services.cloudantNoSQLDB.credentials.url
        }, ((err, cloudant) => {
            if (err) {
                logger.error('Connect failure: ' + err.message + ' for Cloudant DB: ' +
                    appSettings.cloudant_db_name);
                reject(err);
            } else {
                let db = cloudant.use(appSettings.cloudant_db_name);
                logger.info('Connect success! Connected to DB: ' + appSettings.cloudant_db_name);
                resolve(db);
            }
        }));
    });
}