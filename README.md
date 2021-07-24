# GreenyTale API Documentation

The APIs are deployed in heroku.

### API List

#### 1. Create a new Users document(Admin API - One time)
  - API: https://greenytale.herokuapp.com/api/new-users-doc
  - Type: POST
  - Request

  ```JSON 
{
    "user_name": "soham.chattopadhyay",
    "password": "test123",
    "email": "soham.chattopadhyay93@gmail.com",
    "full_name": "Soham Chattopadhyay",
    "dob": "01/01/1905",
    "gender": "M",
    "secure_login_recovery": [
        {
            "security_question_ID": "1",
            "secure_answer": "Kolkata"
        }
    ],
    "street_address_1": "Selimpur Road, Dhakuria",
    "street_address_2": "",
    "city": "Kolkata",
    "state": "WB",
    "zip": "700031",
    "country": "India",
    "role": [
        "Role_Consumer"
    ],
    "sold_product_ID": []
}
```

#### 2. Get User-Info
  - API: https://greenytale.herokuapp.com/api/get-user
  - Type: POST
  - Request

```JSON 
{
    "userName": "aleem.sheik",
    "password": "usertest12341asd"
}
```

#### 3. Create New User
  - API: https://greenytale.herokuapp.com/api/new-user
  - Type: POST
  - Request

```JSON 
{
    "user_name": "swadhin.m",
    "password": "r1421o8y4",
    "email": "swadhin.mukherjee@gmai.com",
    "full_name": "Swadhin Mukherjee",
    "dob": "01/02/1913",
    "gender": "M",
    "secure_login_recovery": [
        {
            "security_question_ID": "1",
            "secure_answer": "Kolkata"
        }
    ],
    "street_address_1": "GHE Street",
    "street_address_2": "Street T",
    "city": "Kolkata",
    "state": "WB",
    "zip": "700036",
    "country": "India",
    "role": [
        "Role_Consumer",
        "Role_Seller"
    ],
    "sold_product_ID": []
}
```

#### 4. Update Existing User
  - API: https://greenytale.herokuapp.com/api/update-user
  - Type: POST
  - Request

```JSON 
{
    "user_ID": "0bb9b470-eafc-11eb-bffb-adf8fe07f4e0",
    "role": [
        "Role_Consumer",
        "Role_Seller"
    ],
    "sold_product_ID": [
        "b16e9e40-eba5-11eb-b05c-97cfad7c58a9",
        "c6f570b0-ec43-11eb-b6c2-eba4be0f94a7"
    ]
}
```

#### 5. Create a new Products document(Admin API - One time)
  - API: https://greenytale.herokuapp.com/api/new-products-doc
  - Type: POST
  - Request

```JSON 
{
    "product_name": "Clear Glass",
    "unit_price": "12",
    "quantity": "200",
    "product_material": "Glass",
    "recycling_code": "#70 GL",
    "seller_ID": "0bb9b470-eafc-11eb-bffb-adf8fe07f4e0",
    "seller_name": "Swadhin Mukherjee",
    "product_category": "Materials",
    "product_sub_category": "Fragile Materials"
}
```

#### 6. Create New Product
  - API: https://greenytale.herokuapp.com/api/new-product
  - Type: POST
  - Request

```JSON 
{
    "product_name": "Coloured Glass",
    "unit_price": "15",
    "quantity": "150",
    "product_material": "Glass",
    "recycling_code": "#70 GL",
    "seller_ID": "0bb9b470-eafc-11eb-bffb-adf8fe07f4e0",
    "seller_name": "Swadhin Mukherjee",
    "product_category": "Materials",
    "product_sub_category": "Fragile Materials"
}
```

#### 7. Update Existing Product (Admin can use this to approve a product)
  - API: https://greenytale.herokuapp.com/api/update-product
  - Type: POST
  - Request

```JSON 
{
    "product_ID": "b16e9e40-eba5-11eb-b05c-97cfad7c58a9",
    "isApproved": true
}
```

#### 8. Get A ll Products
  - API: https://greenytale.herokuapp.com/api/get-all-products
  - Type: GET
  - Request

``` 
  No request requried
```

#### 9. Get Product Info
  - API: https://greenytale.herokuapp.com/api/get-product-info
  - Type: POST
  - Request

```JSON 
{
    "product_ID": "b16e9e40-eba5-11eb-b05c-97cfad7c58a9"
}
```

#### 10. Get Seller Listings
  - API: https://greenytale.herokuapp.com/api/get-seller-listings
  - Type: POST
  - Request

```JSON 
{
    "seller_ID": "0bb9b470-eafc-11eb-bffb-adf8fe07f4e0"
}
```

#### 11. Create a new Cart document(Admin API - One time)
  - API: https://greenytale.herokuapp.com/api/new-cart-doc
  - Type: POST
  - Request

```JSON 
{
    "user_ID": "f0e76700-eafb-11eb-bffb-adf8fe07f4e0",
    "products": [
        {
            "product_ID": "b16e9e40-eba5-11eb-b05c-97cfad7c58a9",
            "quantity": "2"
        },
        {
            "product_ID": "c6f570b0-ec43-11eb-b6c2-eba4be0f94a7",
            "quantity": "4"
        }
    ]
}
```
