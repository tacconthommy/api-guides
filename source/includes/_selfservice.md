# Signing up users and add services with the selfservice API

The itembase selfservice API enables any registered API client to easily sign up new users with them. It also offers a simple interface to add new services to existing itembase users.

## What can I do with it?

The following functionality is offered by the itembase selfservice API:

- Sign up new users with an API client
- Add new shop connections to new or existing users
- Add new services for existing users

## How does it work?

Selfservice API works with a simple token mechanism. By creating a token, you describe what your goal is and in which way it should be done. After that, you redirect the user to a specific endpoint that handles the generated token and guides him through the necessary steps. The endpoint is usable with or without an authenticated user. This way it can be used to sign up new users or to modify existing ones.

Each service that itembase users can activate is described with a *component id*. This is usually a numeric ID. When a service was activated for a user, a single instance of it is created which is defined by an *instance id* – usually a uuid v4. Both can be used with the selfservice API, but it requires different levels of authorization:

|Use case|Authorization|
|---|---|
|Create a *signup with eBay* functionality for your client.|(none)|
|Add a new ebay store to an existing user.|OAuth AccessToken with scope `user.instances.write`|
|Activate your client for an existing user's ebay store.|OAuth AccessToken with scope `user.instances.write`|

### Example: Signing up a new user with eBay

Let's assume we want to ask the user to signup with his eBay store for our client via itembase. This implicitely means we have to:

* Authenticate an itembase user
* Add a new eBay store to his account
* Ask the user to authorize your client
* Activate your client for the new eBay store

All of those steps is taken care of with the selfservice endpoint on our side. You just need to describe what you want to do. For this, you need to create a new token with a `POST` call to the selfservice API. In the payload, define your client id and the IDs of the components you want to add (in this case just `6` which describes ebay):

```shell
curl -X POST -H "Content-Type: application/json" -d '{
    "component_ids": [6],
    "client_id": "123_myclientid",
    "action": "create"
}' "https://selfservice.itembase.com/v1/tokens"
```

The token is created in the Selfservice application. Of course your client also has a certain component ID in our system which is recognized automatically and added to the list of components to add. The token response will look like this: 

```json
{
  "token": "85b6833533b1d7bcede0d9be39c8d14dadc9c781",
  "client_id": "123_myclientid",
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

Please note that a token is only valid for a limited amount of time, given in `expires_in` field as seconds.

The response contains a URL you have to redirect the user to (`uri` field). If you do this, all the steps mentioned above will be taken care of.

You probably want to provide a `redirect_uri` as GET parameter when redirecting the user. If given, this is where the user will be lead when the process finished. The token string will be added as GET parameter. 

```http
GET /process/90b6813533b1d7bcede0d9be39c8d14dadc9c780?redirect_uri=https://some.redirect/uri HTTP/1.1
Host: selfservice.itembase.com
Cache-Control: no-cache
```

This will lead to a final redirect to `https://some.redirect/uri?token=90b6813533b1d7bcede0d9be39c8d14dadc9c780`.
