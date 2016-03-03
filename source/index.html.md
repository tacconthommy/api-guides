---
title: API Reference

language_tabs:
  - shell

toc_footers:
  - <a href='#'>Sign Up for a Developer Key</a>
  - <a href='https://github.com/tripit/slate'>Documentation Powered by Slate</a>

includes:
  - errors
  - entities

search: true
---

# tl;dr

You need to [register  your application](/api/clients) to get a client_id.

You can issue (oauth2 authorized) range queries by datetimes (using created_at_from/-to) or get single entities by id.

Each entity (e.g. /users/{user_id}/transaction) is a valid endpoint. Please refer to the [entities section](#entities) for a list of entities and their json schema definitions. Entities that originate from the same data connection have the same <i>source_id</i> attribute. 

A first example:
<p align="center"><iframe height="520" src="https://showterm.io/63c932204e8a00a6546f4#slow" width="640"></iframe></p>

Example source:

```shell
#!/bin/bash

clear
echo ""
echo "let's do an uncompressed http request."
echo "we will aim for a non existing user to provoke a 404."
echo ""
echo ""
echo ""
echo ""
sleep 3
curl --verbose -X GET --header "Accept: application/json" --header "Authorization: Bearer ZWY0NDRjMjQ5NDU1YmQ3YjNhMjdhNTAwOWY3NmZhZjNjZjk1ZDRhZTJmM2IxNzAzYWY5YzczNDI5ZTU5NzYyMQ" "http://sandbox.api.itembase.io/v1/users/123thisiswrong" | jq . 
echo ""
echo "the expected response is a json with a well-defined http error code."
sleep 1
echo ""
echo "the API supports auto-negotiated compression:"
sleep 3
curl --compressed --verbose -X GET --header "Accept: application/json" --header "Authorization: Bearer ZWY0NDRjMjQ5NDU1YmQ3YjNhMjdhNTAwOWY3NmZhZjNjZjk1ZDRhZTJmM2IxNzAzYWY5YzczNDI5ZTU5NzYyMQ" "http://sandbox.api.itembase.io/v1/users/123thisiswrong" | jq .
echo ""
echo "let's fetch us some transaction from the ebay sandbox.."
echo ""
echo ""
echo ""
echo ""
sleep 3
curl --compressed --verbose -X GET --header "Accept: application/json" --header "Authorization: Bearer ZWY0NDRjMjQ5NDU1YmQ3YjNhMjdhNTAwOWY3NmZhZjNjZjk1ZDRhZTJmM2IxNzAzYWY5YzczNDI5ZTU5NzYyMQ" "http://sandbox.api.itembase.io/v1/users/13ac2c74-7de3-4436-9a6d-2c94dd2b1fd3/transactions/ad0fab39aac5a5999df2f28b" | jq .
echo ""
sleep 2
echo "awesome. thanks for watching!"
echo "- the itembase team"
echo ""
cat << "EOF"  
  ___  __       _                       _                        
 |__ \/_ |     | |                     | |                       
    ) || | ___ | |_    ___  ___  _ __  | |_  _   _  _ __  _   _  
   / / | |/ __|| __|  / __|/ _ \| '_ \ | __|| | | || '__|| | | | 
  / /_ | |\__ \| |_  | (__|  __/| | | || |_ | |_| || |   | |_| | 
 |____||_||___/ \__|  \___|\___||_| |_| \__| \__,_||_|    \__, | 
         _____                                             __/ | 
        / ____|                                           |___/  
   ___ | |      ___   _ __ ___   _ __ ___    ___  _ __  ___  ___ 
  / _ \| |     / _ \ | '_ ` _ \ | '_ ` _ \  / _ \| '__|/ __|/ _ \
 |  __/| |____| (_) || | | | | || | | | | ||  __/| |  | (__|  __/
  \___| \_____|\___/ |_| |_| |_||_| |_| |_| \___||_|   \___|\___|   
                                                                 
EOF
echo ""
echo ""


```

# Getting Started

1. To use any API provided by itembase, you have to [register your client](/api/clients) with our servers.
2. To get authorized API access via OAuth 2.0, or to use the itembase API as a sign-on service, [you need to authorize](auth) with this information:
* A *client id* which identifies your client with the server (one for sandbox, one for production)
* A *client secret* which you use to perform certain operations during auth process <aside class="warning">keep it in a safe place and **never expose it** to a client</aside>
* One or more *redirect uris* (on your side) that can be used to send an auth code to you – there is a restricted set of URLs per client
We are following the Oauth2 standard. Check out [this excellent video tutorial by KnpUniversity](https://www.youtube.com/watch?v=io_r-0e3Qcw) which explains OAuth2 very well.
3. By default, only the basic user information is available to you even if you have gained the user's authorization. Therefore you may want to activate the data flow from the data connector to the API. To complete this process, you need:
* An additional *redirect uri* that is known on our side and where the activation endpoint will redirect after the process finished.


# Sandbox vs Production
We have versions for all of our services on our Sandbox and Production system.
You can find the relevant URLs here:

|Type|Production|Sandbox|
|---|---|---|
|OAuth2 auth URL|https://accounts.itembase.com/oauth/v2/auth|http://sandbox.accounts.itembase.io/oauth/v2/auth|
|OAuth2 token URL|https://accounts.itembase.com/oauth/v2/token|http://sandbox.accounts.itembase.io/oauth/v2/token|
|User info URL|https://users.itembase.com/v1/me|http://sandbox.users.itembase.io/v1/me|
|Activation endpoint|https://solutionservice.itembase.com|http://sandbox.solutionservice.itembase.io|
|API endpoint|https://api.itembase.io|http://sandbox.api.itembase.io|

Transport in the production system is over HTTPS.

# Accessing Your Shop Data
Out-of-the-box you can connect any platform-based shop (like eBay, shopify or bigcommerce) using the wizard in [our solution portal](http://connect.itembase.com/#/ib/connect/platforms). For standalone shops like Magento you can download and install the necessary itembase connector plugin. The solution portal will ask your permission to access your shop's data and then tell our connectors to collect and forward the data to our API. In order to access the data, you will need to implement an API client that implements the "activation flow" (see above) and register it with us for production usage.<aside class="success">This flow was designed with solution providers in mind. If you would like us to implement a feature that gives you instant access as soon as you connect your shop, please contact us.</aside>

Data from your shop is made available via our API using our *connectors* which use a private, internal API for writing data. Our public API /v1 is read-only. We are currently developing /v2 which will support PUT/PATCH/POST operations.
<aside class="success">Version 2 of our public API will support PUT, PATCH and POST operations. You will also be able to access stylesheets and other snippets.</aside>

# Getting All New and Updated Products

Assuming that you already obtained a valid access token and activated your solution for a user:
   
* ```access_token```: your OAuth2 client can get this using its client_id and refresh token
* ```user_id```: the uuid of the user that has granted you access
* ```base_url```: http://sandbox.api.itembase.io/v1/users
* ```resource```: the resource you want to access, like "products"

All resources expose created_at_from/-to and updated_at_from/to query parameter that can easily be used to get all new and updated entities. Just make sure to set a "to" parameter so that you can reuse it in your next scheduled GET call. See our api reference (above) for more details.<aside class="success">We are currently working on using HTTP2's server side push functionality, to make scheduled GET jobs unncessary.</aside>

```shell
#!/bin/bash

access_token = < generate this using your oauth2.0 clients refresh token for the given user >
current_datetime = < generate the current datetime in ISO 8601 format >
last_check_datetime = < this is the last time the script was run, as date time in ISO 8601 format >
user_id = < the id of the user that has granted you access >
resource = < the name of the resource you want to get >

auth_header="Authorization: Bearer $access_token"
url="<base_url>/<user_id>/$resource?created_at_from=$last_check_datetime&updated_at_to=$current_datetime"

curl --compressed --verbose -X GET --header "Accept: application/json" --header $auth_header $url | jq .
```

# Authorization and authentication

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

![itembase authentication and activation](http://developers.itembase.com/images/auth_activation.png)


## About Scopes

A scope describes what resources you are able to access and in which way (read, create, edit). During the autorization process they are shown to the user in a readable form. Currently itembase supports the following scopes:

|Scope item|Readable form|Description|
|---|---|---|
|user.minimal|Read general user information|Information include e.g. user id, mail address etc. Needed for the /me call after authorization – Should always be included|
|connection.transaction|Read transactions from connected platforms|Get access to transaction data of connected shops|
|connection.product|Read product data from connected platforms|Get access to product data of connected shops|
|connection.profile|Read profile data from connected platforms|Get access to specific account data of a connected shop|
|connection.buyer|Read customer information from connected platforms|Get access to customer data of a connected shop|

The scope is a space seperated list of the scope items listed above. A valid example would be:

	user.minimal connection.transaction

This would give your client access to APIs that return basic user information and transaction data for user defined shop connections.

## Initiating the process

You need to integrate a button in the frontend of your system that the user can click to connect his itembase account with your client. If he clicks it, you need to redirect to the authentication URL of our accounts server with your *client id*:

	https://accounts.itembase.com/oauth/v2/auth?response_type=code&client_id=your_client_id&scope=user.minimal&redirect_uri=http://your.service/connect/itembase&grant_type=authorization_code

Replace the placeholders with your actual data: `your_client_id` becomes the client id you got from itembase, `http://your.service/connect/itembase` the redirect URI you registered for your client. Also set the scope you need as value of the `scope` parameter.

## The authorization and authentication step

After the redirect to the authentication URL of the itembase accounts server, the itembase user will be authenticated. Depending on his login status, he may need to enter his username and password or even create a new account if he has none yet. This happens completely on our side.

When the user was authenticated successfully, he will see a website that asks him to accept or decline that your client wants to have access to his data on itembase. The dialogue lists all scopes you requested initially.

In case of an error (e.g. if the user does not accept), the itembase accounts server redirects to your `redirect_uri` with an error response:

	http://your.service/connect/itembase?error=access_denied

If the user accepted your client, the itembase accounts server redirects to your `redirect_uri` including an authorization code (parameter `code`):

	http://your.service/connect/itembase?code=1234someauthcode

This code is only valid for some seconds and can only be used once. You need it to obtain a refresh token and an access token.

## Obtaining your first tokens

With the authorization code you can request an access token and a refresh token the first time. This request goes to the accounts server's token endpoint and **has to be sent server side** since it includes your client secret in this flow:

	https://accounts.itembase.com/oauth/v2/token?client_id=your_client_id&client_secret=your_client_secret&grant_type=authorization_code&code=1234someauthcode&redirect_uri=http://your.service/connect/

The `redirect_uri` will be ignored in *authorization_code* flow, but still has to be given. Please use an allowed redirect_uri (e.g. the one from the *auth* call) for this. You will receice a JSON response that returns your tokens:

	{
    	"access_token": "MjU5MGM0YjJkZmIyZDZmZmE3NGQwZGZkMzYxNTBhYjA2M2Vj",
    	"expires_in": 2592000,
    	"token_type": "bearer",
    	"scope": "user.minimal",
    	"refresh_token": "ODk3YjA5MjM3YzNjMzQ1NjY5NDZiZGZjMDI2ODQ1NazZ2Vj"
	}

The access token is valid for the one particular user you obtained it for. You need to store this data to be able to request our APIs. Tokens expire after a while:

|Token type|Expires in|
|---|---|
|Access token|1 hour|
|Refresh token|~34 days|

## Obtaining new access tokens with refresh tokens

If an acces token has expired, you can use a refresh token you obtained with it to get a new one. This works once again with the token endpoint of the accounts server:

	https://accounts.itembase.com/oauth/v2/token?client_id=your_client_id&client_secret=your_client_secret&grant_type=refresh_token&refresh_token=your_refresh_token#

This call returns a JSON with a new set of tokens that replaces the old pair.

	{
    	"access_token": "MjU5MGM0YjJkZmIyZDZmZmE3NGQwZGZkMzYxNTBhYjA2M2Vj",
    	"expires_in": 2592000,
    	"token_type": "bearer",
    	"scope": "user.minimal",
    	"refresh_token": "ODk3YjA5MjM3YzNjMzQ1NjY5NDZiZGZjMDI2ODQ1NazZ2Vj"
	}
	
You should obtain a new access token latest before your refresh token expires. If the refresh token expires as well, you will need to repeat the authorization/authentication process with the user involved to obtain a new pair of tokens.

## Getting basic user information

For almost all API calls at itembase you need a user id. To obtain the one that your AccessToken is valid for, there is an user info call that you can use if `user.minimal` is part of your scope:

	Request (GET):
	https://users.itembase.com/v1/me

	Header:
    Authorization: Bearer your_access_token

This responds with basic user information, one of them is the `uuid` of the itembase user:

    {
        "uuid": "a4b91ee7-ec1a-49b9-afce-371dc8797749",
        "username": "thommy",
        "email": "tb@itembase.biz",
        "first_name": "Thomas",
        "middle_name": null,
        "last_name": "Bretzke",
        "name_format": "first middle last",
        "locale": "en",
        "preferred_currency": "EUR",
    }

We recommend you to store your access token and refresh token securely on your server along with the `uuid` they are valid for. You can also create a user on your side or match the one that was currently logged in with the data you receive from this call.
