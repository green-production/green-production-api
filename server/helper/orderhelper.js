import {v1 as uuidv1} from 'uuid';

const orderhelper = {

    getAllOrders: function getAllOrders(docList) {
        let id = '';
        let rev = '';
        let transaction_details = [];
      
        if(docList != null && docList.data != null && docList.data.total_rows > 0)
        {
          docList.data.rows.forEach(element => {
      
            //Extract information from Orders document
            if(element.doc.type == 'Orders')
            {
              id = element.id;
              rev = element.doc._rev;
              transaction_details = element.doc.transaction_details;
            }
          });
        }
        return {
            orderID: id,
            orderRev: rev,
            transactionDetails: transaction_details
        };
    },

    newOrderObj: function newOrderObj(user_ID, products, transactionDetails) {
        //Create new transaction object for new user
        let transactionObj = {
            'user_ID': user_ID,
            'transactions': [
                {
                    'transactionID': uuidv1(),
                    'products': products
                }
            ],
            'created_dt': new Date().toISOString()
        };
        
        //Modifiy existing User_Details array from document
        transactionDetails.push(transactionObj);
        return transactionDetails;
    }

}

export default orderhelper