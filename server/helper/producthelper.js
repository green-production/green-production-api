import {v1 as uuidv1} from 'uuid';
import utils from '../utils/utils.js';

const producthelper = {

    getAllProducts: function getAllProducts(docList) {
        let id = '';
        let rev = '';
        let product_details = [];
      
        if(docList != null && docList.data != null && docList.data.total_rows > 0)
        {
          docList.data.rows.forEach(element => {
      
            //Extract information from Products document
            if(element.doc.type == 'Products')
            {
              id = element.id;
              rev = element.doc._rev;
              product_details = element.doc.product_details;
            }
          });
        }
        return {
            productID: id,
            productRev: rev,
            productDetails: product_details
        };
    },

    newProductObj: function newProductObj(product_details, request) {
        //Create new product object
        var newProductObj = {
            'product_ID': uuidv1(),
            ...request.body,
            'isApproved' : false,
            'created_dt': new Date().toISOString(),
            'updated_dt': new Date().toISOString()
        };
        
        //Modifiy existing User_Details array from document
        product_details.push(newProductObj);
        
        return product_details;
    },

    updateProductHelper: async function updateProductHelper(request) {
      //Find all available docs
      var docList = await utils.findAllDocs();
    
      let prod_ID = request.body.product_ID;
  
      let product_details = [];
      
      //Get all product details
      const {productID, productRev, productDetails} = producthelper.getAllProducts(docList);

      product_details = productDetails;
  
      product_details.forEach(product => {
          if(product.product_ID == prod_ID) {
              product = utils.mapProductUpdateToModel(product, request.body);
          }         
      });
  
      //Insert updated product details array in Products document
      var docInfo = await utils.insertProductInfo(productID, productRev, product_details);

      return docInfo;
    }
}

export default producthelper