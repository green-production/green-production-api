import producthelper from '../helper/producthelper.js';
import utils from '../utils/utils.js';

const productController = {

    updateProductController: async function updateProductController(request) {
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

export default productController