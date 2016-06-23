# Getting Access
<a name="getting-access"></a>
Out-of-the-box you can connect any platform-based shop (like eBay, shopify or bigcommerce) using the wizard in [our solution portal](http://connect.itembase.com/#/ib/connect/platforms). For standalone shops like Magento you can download and install the necessary itembase connector plugin. The solution portal will ask your permission to access your shop's data and then tell our connectors to collect and forward the data to our API. In order to access the data, you will need to implement an API client that implements the "activation flow" (see above) and register it with us for production usage.<aside class="success">This flow was designed with solution providers in mind. If you would like us to implement a feature that gives you instant access as soon as you connect your shop without connecting a specific solution, please contact us.</aside>

Data from your shop is made available via our API using our *connectors* which use a private, internal API for writing data. Our public API /v1 is read-only. Our public API /v2 supports a new _snippets_ endpoint with read-write access. See the "reading and writing data" section for more information.

## Authorization, authentication, activation

We use OAuth 2.0 for authorization. Our auth server at `accounts.itembase.com` combines an OAuth server that follows the standardized behaviour described in [the OAuth 2.0 RFC specification](https://tools.ietf.org/html/rfc6749) and a login server for user authentication.

The following steps are necessary when a user authorizes your client to request data for his account from the itembase API. It is assumed that you follow the `authorization_code` grant type / flow. Other flows work according to [the OAuth 2.0 RFC specification](https://tools.ietf.org/html/rfc6749).

## Activation or Authorization?
While the authorization is always necessary for a basic connection to our API, the activation steps might be optional for you, if you do not need any data besides basic user information. Please refer to this overview:

|Use case|Implement authorization (OAuth)|Implement activation|
|---|---|---|
|Use itembase as login/registration system|yes|no|
|Request basic user information|yes|no|
|Get access to itembase APIs|yes|yes|

It doesn't matter if the process is initiated from the third party (e.g. with a **connect with itembase** button on your side) or from itembase side (from the Solution Portal): It always works the same and requires no dedicated handling on the third party side.

![itembase authentication and activation](https://itembase.github.io/api-guides/images/auth_activation.png)


## About Scopes

A scope describes what resources you are able to access and in which way (read, create, edit). During the autorization process they are shown to the user in a readable form. Currently itembase supports the following scopes:

|Scope item|Readable form|Description|
|---|---|---|
|user.minimal|Read general user information|Information include e.g. user id, mail address etc. Needed for the /me call after authorization – Should always be included|
|user.instances.read|Request information about itembase components in use|Read activated services of a user|
|user.instances.write|Initiate new connections with itembase components|Activate new services for a user|
|connection.transaction|Read transactions from connected platforms|Get access to transaction data of connected shops|
|connection.product|Read product data from connected platforms|Get access to product data of connected shops|
|connection.profile|Read profile data from connected platforms|Get access to specific account data of a connected shop|
|connection.buyer|Read customer information from connected platforms|Get access to customer data of a connected shop|

The scope is a space seperated list of the scope items listed above. A valid example would be:

```
user.minimal connection.transaction
```

This would give your client access to APIs that return basic user information and transaction data for user defined shop connections.

## Initiating the process

You need to integrate a button in the frontend of your system that the user can click to connect his itembase account with your client. If he clicks it, you need to redirect to the authentication URL of our accounts server with your *client id*:

```
https://accounts.itembase.com/oauth/v2/auth?response_type=code&client_id=your_client_id&scope=user.minimal&redirect_uri=http://your.service/connect/itembase&grant_type=authorization_code
```

Replace the placeholders with your actual data: `your_client_id` becomes the client id you got from itembase, `http://your.service/connect/itembase` the redirect URI you registered for your client. Also set the scope you need as value of the `scope` parameter.

## The authorization and authentication step

After the redirect to the authentication URL of the itembase accounts server, the itembase user will be authenticated. Depending on his login status, he may need to enter his username and password or even create a new account if he has none yet. This happens completely on our side.

When the user was authenticated successfully, he will see a website that asks him to accept or decline that your client wants to have access to his data on itembase. The dialogue lists all scopes you requested initially.

In case of an error (e.g. if the user does not accept), the itembase accounts server redirects to your `redirect_uri` with an error response:

```
http://your.service/connect/itembase?error=access_denied
```

If the user accepted your client, the itembase accounts server redirects to your `redirect_uri` including an authorization code (parameter `code`):

```
http://your.service/connect/itembase?code=1234someauthcode
```

This code is only valid for some seconds and can only be used once. You need it to obtain a refresh token and an access token.

## Obtaining your first tokens

With the authorization code you can request an access token and a refresh token the first time. This request goes to the accounts server's token endpoint and **has to be sent server side** since it includes your client secret in this flow:

```
https://accounts.itembase.com/oauth/v2/token?client_id=your_client_id&client_secret=your_client_secret&grant_type=authorization_code&code=1234someauthcode&redirect_uri=http://your.service/connect/
```

The `redirect_uri` will be ignored in *authorization_code* flow, but still has to be given. Please use an allowed redirect_uri (e.g. the one from the *auth* call) for this. You will receice a JSON response that returns your tokens:

```json
{
    "access_token": "MjU5MGM0YjJkZmIyZDZmZmE3NGQwZGZkMzYxNTBhYjA2M2Vj",
    "expires_in": 2592000,
    "token_type": "bearer",
    "scope": "user.minimal",
    "refresh_token": "ODk3YjA5MjM3YzNjMzQ1NjY5NDZiZGZjMDI2ODQ1NazZ2Vj"
}
```

The access token is valid for the one particular user you obtained it for. You need to store this data to be able to request our APIs.

## Expiration of refresh and access tokens
All tokens will expire in "expires_in" seconds as recommended by [RFC 6749 for OAuth 2.0](https://tools.ietf.org/html/rfc6749#section-4.2.2). We defined the following expiration periods:

|Token type|Expires in|
|---|---|
|Access token|1 hour|
|Refresh token|~34 days|

If you try to access data by a user with an expired access token, the API will return a **HTTP 401 - Unauthorized** response.

## Obtaining a new access token using a refresh token

If an acces token has expired, you can use a refresh token you obtained during the activation step above to get a new access token. Just issue a GET call to the token endpoint of the accounts server like so:

```
https://accounts.itembase.com/oauth/v2/token?client_id=your_client_id&client_secret=your_client_secret&grant_type=refresh_token&refresh_token=your_refresh_token#
```

This call returns a JSON with a new set of tokens that replaces the old pair.

```json
{
    "access_token": "MjU5MGM0YjJkZmIyZDZmZmE3NGQwZGZkMzYxNTBhYjA2M2Vj",
    "expires_in": 2592000,
    "token_type": "bearer",
    "scope": "user.minimal",
    "refresh_token": "ODk3YjA5MjM3YzNjMzQ1NjY5NDZiZGZjMDI2ODQ1NazZ2Vj"
}
```

You should obtain a new access token latest before your refresh token expires. If the refresh token expires as well, you will need to repeat the authorization/authentication process with the user involved to obtain a new pair of tokens.

## Getting basic user information

For almost all API calls at itembase you need a user id. To obtain the one that your AccessToken is valid for, there is an user info call that you can use if `user.minimal` is part of your scope:

```shell
curl -X GET --header "Authorization: Bearer your_access_token" "https://users.itembase.com/v1/me"
```

This responds with basic user information, one of them is the `uuid` of the itembase user:

```json
{
    "uuid": "a4b91ee7-ec1a-49b9-afce-371dc8797749",
    "username": "thommy",
    "email": "tb@itembase.biz",
    "first_name": "Thomas",
    "middle_name": null,
    "last_name": "Bretzke",
    "name_format": "first middle last",
    "locale": "en",
    "preferred_currency": "EUR"
}
```

We recommend you to store your access token and refresh token securely on your server along with the `uuid` they are valid for. You can also create a user on your side or match the one that was currently logged in with the data you receive from this call.
