import utils from '../utils/utils.js';

const carthelper = {

    getAllCarts: function getAllCarts(docList) {
        let id = '';
        let rev = '';
        let cart_details = [];        

        if(docList != null && docList.data != null && docList.data.total_rows > 0)
        {
            docList.data.rows.forEach(element => {
        
                //Extract information from Cart document
                if(element.doc.type == 'Cart')
                {
                id = element.id;
                rev = element.doc._rev;
                cart_details = element.doc.cart_details;
                }
            });
        }
        return {
            id: id,
            rev: rev,
            cartdetails: cart_details
        };
    }

}

export default carthelper