---
title: API Guides

language_tabs:
  - shell

toc_footers:
  - <a href='https://api.itembase.com/api/clients'>Sign Up for a Developer Key</a>
  - <a href='https://github.com/tripit/slate'>Documentation Powered by Slate</a>

includes:
  - auth
  - activation
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
echo
echo "let's do an uncompressed http request."
echo "we will aim for a non existing user to provoke a 404."
echo
echo
echo
echo
sleep 3
curl --verbose -X GET --header "Accept: application/json" --header "Authorization: Bearer ZWY0NDRjMjQ5NDU1YmQ3YjNhMjdhNTAwOWY3NmZhZjNjZjk1ZDRhZTJmM2IxNzAzYWY5YzczNDI5ZTU5NzYyMQ" "http://sandbox.api.itembase.io/v1/users/123thisiswrong" | jq .
echo
echo "the expected response is a json with a well-defined http error code."
sleep 1
echo
echo "the API supports auto-negotiated compression:"
sleep 3
curl --compressed --verbose -X GET --header "Accept: application/json" --header "Authorization: Bearer ZWY0NDRjMjQ5NDU1YmQ3YjNhMjdhNTAwOWY3NmZhZjNjZjk1ZDRhZTJmM2IxNzAzYWY5YzczNDI5ZTU5NzYyMQ" "http://sandbox.api.itembase.io/v1/users/123thisiswrong" | jq .
echo
echo "let's fetch us some transaction from the ebay sandbox.."
echo
echo
echo
echo
sleep 3
curl --compressed --verbose -X GET --header "Accept: application/json" --header "Authorization: Bearer ZWY0NDRjMjQ5NDU1YmQ3YjNhMjdhNTAwOWY3NmZhZjNjZjk1ZDRhZTJmM2IxNzAzYWY5YzczNDI5ZTU5NzYyMQ" "http://sandbox.api.itembase.io/v1/users/13ac2c74-7de3-4436-9a6d-2c94dd2b1fd3/transactions/ad0fab39aac5a5999df2f28b" | jq .
echo
sleep 2
echo "awesome. thanks for watching!"
echo "- the itembase team"
echo
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
echo
echo


```

# Getting Started

1. To use any API provided by itembase, you have to [register your client](/api/clients) with our servers.
2. To get authorized API access via OAuth 2.0, or to use the itembase API as a sign-on service, [you need to authorize](auth) with this information:
* A *client id* which identifies your client with the server (one for sandbox, one for production)
* A *client secret* which you use to perform certain operations during auth process <aside class="warning">keep it in a safe place and **never expose it** to a client</aside>
* One or more *redirect uris* (on your side) that can be used to send an auth code to you – there is a restricted set of URLs per client
We are following the Oauth2 standard. Check out [this excellent video tutorial by KnpUniversity](https://www.youtube.com/watch?v=io_r-0e3Qcw) which explains OAuth2 very well.<a style="float:right" href="https://www.youtube.com/watch?v=io_r-0e3Qcw" target="_blank"><img src="http://img.youtube.com/vi/io_r-0e3Qcw/0.jpg" alt="OAuth2 in 8 Steps Tutorial by KnpUniversity" width="250" border="5" /></a>
3. By default, only the basic user information is available to you even if you have gained the user's authorization. Therefore you may want to activate the data flow from the data connector to the API. To complete this process, you need:
* An additional *redirect uri* that is known on our side and where the activation endpoint will redirect after the process finished.

# Reporting Issues
Naturally we aim to deliver a reliable, well-behaving and well-documented service. Please tell us if you stumble across an issue you believe we need to address. We have open sourced our documentation as well so that you can raise issues there as well. Please report issues or raise pull requests here:

|Component|Link|Notes
|---|---|---|
|The **API** itself|[github.com/itembase/data-connect-api](https://github.com/itembase/data-connect-api)|Any issues related with our public APIs.|
|*This* **Guides** section|[github.com/itembase/api-guides/issues](https://github.com/itembase/api-guides/issues)||
|**API Documentation** section|[github.com/itembase/api-swagger/issues](https://github.com/itembase/api-guides/issues)|This is the swagger API explorer. Issues with the swagger-ui can be posted [here](https://github.com/swagger-api/swagger-ui).|

# Sandbox vs Production


<aside class="warning">Currently the sandbox does not provide the full functionality of our production system.</aside>

* It's **not** possible to connect shops to our sandbox platform. Instead we're regularly providing new test data for a prepared test user.
* This user's sandbox data is fetched from the eBay sandbox environment (any personal data is replaced with generated information).
* Data is currently only provided by us and can only be fetched for **one shop user**.
* Every solution needs to be activated on our platform before one can get access to the data via the API. On the sandbox this process can only be initiated by the API client (not via any GUI). Please refer to the "activation" section below.

<aside class="success">We're working on providing a full features sandbox to the community and will keep you updated via the developers notes.</aside>

We have separate versions of our services running on our Sandbox and Production systems, see the relevant URLs here:


|Type|Production|Sandbox|
|---|---|---|
|OAuth2 auth URL|https://accounts.itembase.com/oauth/v2/auth|http://sandbox.accounts.itembase.io/oauth/v2/auth|
|OAuth2 token URL|https://accounts.itembase.com/oauth/v2/token|http://sandbox.accounts.itembase.io/oauth/v2/token|
|User info URL|https://users.itembase.com/v1/me|http://sandbox.users.itembase.io/v1/me|
|Activation endpoint|https://solutionservice.itembase.com|http://sandbox.solutionservice.itembase.io|
|Selfservice API endpoint|https://selfservice.itembase.com|http://sandbox.selfservice.itembase.io|
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
