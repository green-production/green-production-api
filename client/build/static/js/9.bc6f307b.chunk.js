(this["webpackJsonpgreen-production"]=this["webpackJsonpgreen-production"]||[]).push([[9],{103:function(e,t,s){},124:function(e,t,s){"use strict";s.r(t);var c=s(10),r=s.n(c),a=s(15),i=s(6),n=s(7),l=s(9),o=s(8),d=s(1),u=s(27),j=s(26),b=s(23),p=(s(103),s(4)),h=s(0),m=function(e){Object(l.a)(s,e);var t=Object(o.a)(s);function s(e){var c;return Object(i.a)(this,s),(c=t.call(this,e)).state={pageLoading:!1,errorMsg:"",productsList:Object(h.jsx)("div",{className:"no=products",children:"You do not have any items to sell right now. Click the 'Upload Items' button to strat uploading."}),userImg:"https://img.icons8.com/bubbles/100/000000/user.png"},c}return Object(n.a)(s,[{key:"componentDidMount",value:function(){var e=this.props.context.userDetails;e.imgUrl&&this.setState({userImg:e.imgUrl}),window.scrollTo(0,150),this.getSellerProducts(e.user_ID),console.log("prps",this.props.context,this.props.context.userDetails)}},{key:"arrayBufferToBase64",value:function(e){for(var t="",s=new Uint8Array(e),c=s.byteLength,r=0;r<c;r++)t+=String.fromCharCode(s[r]);return window.btoa(t)}},{key:"getSellerProducts",value:function(){var e=Object(a.a)(r.a.mark((function e(t){var s,c,a=this;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return this.setState({pageLoading:!0}),e.prev=1,e.next=4,u.a.sellerProducts({seller_ID:t});case 4:(s=e.sent)&&(this.setState({errorMsg:""}),c=s.map((function(e,t){var s,c="data:image/png;base64,"+a.arrayBufferToBase64(null===e||void 0===e||null===(s=e.image_buffer)||void 0===s?void 0:s.data);return Object(h.jsx)("div",{className:"col-6 product-ind",children:Object(h.jsxs)("div",{className:"product",children:[Object(h.jsx)(p.b,{to:"/product",title:"Product",children:Object(h.jsx)("div",{className:"image-box",children:Object(h.jsx)("div",{className:"images",children:Object(h.jsx)("img",{src:c,alt:"product_img"})})})}),Object(h.jsxs)("div",{className:"text-box",children:[Object(h.jsx)("h2",{className:"item",children:e.product_name}),Object(h.jsx)("h3",{className:"price",children:e.unit_price}),Object(h.jsxs)("p",{className:"description",children:["Materials used: ",e.product_material]}),Object(h.jsxs)("p",{className:"description",children:["Recycling code: ",e.recycling_code]}),Object(h.jsxs)("p",{className:"description",children:["Item uploaded on: ",e.created_dt.substr(0,e.created_dt.indexOf("T"))]}),Object(h.jsx)("label",{htmlFor:"item-1-quantity",children:"Quantity: "}),Object(h.jsx)("input",{type:"number",name:"item-1-quantity",id:"item-1-quantity",value:e.quantity}),Object(h.jsx)("button",{type:"button",name:"item-1-button",id:"item-1-button",children:"Add to Cart"})]})]})},t)})),this.setState({productsList:c}),console.log("res",s)),e.next=12;break;case 8:e.prev=8,e.t0=e.catch(1),this.setState({errorMsg:"Error fetching products list"}),Object(j.a)(e.t0);case 12:this.setState({pageLoading:!1});case 13:case"end":return e.stop()}}),e,this,[[1,8]])})));return function(t){return e.apply(this,arguments)}}()},{key:"render",value:function(){var e=this.props.context.userDetails;return Object(h.jsxs)("div",{className:"seller-page",children:[this.state.pageLoading?Object(h.jsx)(b.a,{}):"",Object(h.jsx)("h1",{className:"page-settings-header",children:"Seller Account"}),Object(h.jsx)("div",{className:"page-content page-container",id:"page-content",children:Object(h.jsx)("div",{className:"row d-flex justify-content-center",children:Object(h.jsx)("div",{className:"seller-inner-wrapper",children:Object(h.jsx)("div",{className:"card user-card-full",children:Object(h.jsxs)("div",{className:"row m-l-0 m-r-0",children:[Object(h.jsx)("div",{className:"col-sm-4 bg-c-lite-green user-profile",children:Object(h.jsxs)("div",{className:"card-block text-center text-white",children:[Object(h.jsx)("div",{className:"m-b-25",children:Object(h.jsx)("img",{src:this.state.userImg,className:"img-radius",alt:"User-Profile-Image"})}),Object(h.jsx)("h6",{className:"f-w-600",children:e.full_name}),Object(h.jsx)("p",{children:"GreenyTale Seller"}),Object(h.jsx)("p",{children:e.email}),Object(h.jsxs)("p",{children:["Joined:"," ",e.created_dt.substr(0,e.created_dt.indexOf("T"))]})]})}),Object(h.jsx)("div",{className:"col-sm-8",children:Object(h.jsxs)("div",{className:"card-block",children:[Object(h.jsx)("h6",{style:{display:"inline-block"},className:"m-b-20 p-b-5 b-b-default f-w-600",children:"List of all products"}),Object(h.jsx)("button",{className:"btn btn-success upload-products",children:Object(h.jsx)(p.b,{to:"seller-upload",children:"Upload Items"})}),Object(h.jsx)("hr",{}),Object(h.jsx)("div",{className:"row listing-section",children:this.state.productsList})]})})]})})})})})]})}}]),s}(d.Component);t.default=m}}]);
//# sourceMappingURL=9.bc6f307b.chunk.js.map