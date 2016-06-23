## Signing up users and add services with the connect API

The itembase connect API offers an interface to access and add connectors as well as connections of new and existing users.

### Summary

The following functionality is offered by the itembase connect API:

- Get all connections a user has (via Connections endpoint)
- Sign up new users with an API client (via SelfService endpoint)
- Add new connections to new or existing users (via SelfService endpoint)
- Add new services for existing users (via SelfService endpoint)

### How does it work?

You can use the itembase connect API with both new users and users who have already been authorised. The authorisation level differs from case to case.

|Use case|Authorization|
|---|---|
|Create a *signup with eBay* functionality for your client.|(none)|
|Get all existing connections of a user.|OAuth AccessToken with scope `user.instances.read`|
|Add a new ebay store to an existing user.|OAuth AccessToken with scope `user.instances.write`|
|Activate your client for an existing user's ebay store.|OAuth AccessToken with scope `user.instances.write`|

Each connector at itembase is described with a so-called component ID. The following core connectors are currently supported:

|Connector|Component id production|Component id sandbox|
|---|---|---|
|eBay|6|-|
|Shopify|7|-|
|SEO shop|20|-|
|Big Commerce|12|-|
|Magento|11|30|
|Prestashop|14|-|
|Gambio|34|-|
|WooCommerce|22|-|
|Virtuemart|23|-|

Let's take a look at some examples to see what is possible.

<aside class="warning">All examples assume that you implemented the OAuth & activation flow on your side.</aside>

### Example 1: Signing up a new user with eBay

<aside class="success">For this example no authorisation is required, but you need to have a client id.</aside>

```shell
curl -X POST -H "Content-Type: application/json" -d '{
    "component_ids": [6],
    "client_id": "YOUR_CLIENT_ID",
    "action": "create"
}' "https://selfservice.itembase.com/v1/tokens"
```
This will:

* Authenticate an itembase user
* Add a new eBay (component id 6) store to their account
* Ask the user to authorize your client (identified by `YOUR_CLIENT_ID`)
* Activate your client for the new eBay store

The token is created in the Selfservice application. Of course your client also has a certain component ID in our system which is recognized automatically and added to the list of components to connect. The token response will look like this: 

```json
{
  "token": "85b6833533b1d7bcede0d9be39c8d14dadc9c781",
  "client_id": "YOUR_CLIENT_ID",
  "user_id": null,
  "action": "create",
  "component_ids": [
    6,
    77
  ],
  "instance_id": null,
  "status": "new",
  "enable_whisper_signup": false,
  "expires_in": 1200,
  "uri": "https://selfservice.itembase.com/process/85b6833533b1d7bcede0d9be39c8d14dadc9c781",
  "additional_parameters": []
}
```

The response contains a URL you have to redirect the user to (`uri` field). You can provide a `redirect_uri` as GET parameter when redirecting the user. If given, this is where the user will be lead when the process finished. The token will be added as the GET parameter `ibsstoken`.

<aside class="warning">The token is only valid for a limited amount of time, given in <i>expires_in</i>.</aside> 

### Example 2: Adding a new eBay store to an already authorised user

<aside class="warning">For this example you need a valid Access Token for a user with the scope <i>user.instances.write</i>.</aside>

```shell
curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer ACCESSTOKEN" -d '{
    "component_ids": [6],
    "action": "create"
}' "https://selfservice.itembase.com/v1/tokens"
```

This will:

* Add a new eBay (component id 6) store to the authenticated user's account
* Activate your client for the new eBay store

The token is created in the Selfservice application. The token response will look like this: 

```json
{
  "token": "85b6833533b1d7bcede0d9be39c8d14dadc9c781",
  "client_id": "YOUR_CLIENT_ID",
  "user_id": "SOME_USER_ID",
  "action": "create",
  "component_ids": [
    6,
    77
  ],
  "instance_id": null,
  "status": "new",
  "enable_whisper_signup": false,
  "expires_in": 1200,
  "uri": "https://selfservice.itembase.com/process/85b6833533b1d7bcede0d9be39c8d14dadc9c781",
  "additional_parameters": []
}
```

### Example 3: Adding an existing eBay store to an already authorised user

<aside class="warning">For this example you need a valid Access Token for a user with the scope <i>user.instances.write</i> and <i>user.instances.read</i>.</aside>

With the user's ID at hand, first we need to get the connections that the user currently has:

```shell
curl -X GET -H "Content-Type: application/json" -H "Authorization: Bearer ACCESSTOKEN" "https://api.itembase.com/v1/users/SOME_USER_ID/instances"
```

This will list all the connections of the user:

```json
[
  {
    "id": "1768e0de-0c78-4a5e-bce3-44d2d8a63fa5",
    "component_id": 6,
    "component_type": "connection",
    "status": "connection.valid",
    "_links": [
      {
        "rel": "self",
        "href": "/v1/users/SOME_USER_ID/instances/1768e0de-0c78-4a5e-bce3-44d2d8a63fa5"
      },
      {
        "rel": "meta",
        "href": "/v1/users/SOME_USER_ID/instances/1768e0de-0c78-4a5e-bce3-44d2d8a63fa5/meta"
      },
      {
        "rel": "connections",
        "href": "/v1/users/SOME_USER_ID/instances/1768e0de-0c78-4a5e-bce3-44d2d8a63fa5/connections"
      }
    ]
  },
  {
    "id": "64cda8a7-2629-4ece-ba0e-5ff3b70aaec4",
    "component_id": 78,
    "component_type": "solution",
    "status": null,
    "_links": [
      {
        "rel": "self",
        "href": "/v1/users/SOME_USER_ID/instances/64cda8a7-2629-4ece-ba0e-5ff3b70aaec4"
      },
      {
        "rel": "meta",
        "href": "/v1/users/SOME_USER_ID/instances/64cda8a7-2629-4ece-ba0e-5ff3b70aaec4/meta"
      },
      {
        "rel": "connections",
        "href": "/v1/users/SOME_USER_ID/instances/64cda8a7-2629-4ece-ba0e-5ff3b70aaec4/connections"
      }
    ]
  }
]
```

The first entry with the instance id `1768e0de-0c78-4a5e-bce3-44d2d8a63fa5` is an ebay connection. Let's assume we want to connect this to our solution. We use the self service with our AccessToken again:

```shell
curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer ACCESSTOKEN" -d '{
    "instance_id": "1768e0de-0c78-4a5e-bce3-44d2d8a63fa5",
    "action": "create"
}' "https://selfservice.itembase.com/v1/tokens"
```

This will:

* Activate your client for the existing eBay store

Everything else works as in the previous examples. The token response will look like this: 

```json
{
  "token": "85b6833533b1d7bcede0d9be39c8d14dadc9c781",
  "client_id": "YOUR_CLIENT_ID",
  "user_id": "SOME_USER_ID",
  "action": "create",
  "component_ids": [
    77
  ],
  "instance_id": "1768e0de-0c78-4a5e-bce3-44d2d8a63fa5",
  "status": "new",
  "enable_whisper_signup": false,
  "expires_in": 1200,
  "uri": "https://selfservice.itembase.com/process/85b6833533b1d7bcede0d9be39c8d14dadc9c781",
  "additional_parameters": []
}
```