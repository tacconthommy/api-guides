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

## Activation or Authorization?
In summary, while the authorization is always necessary for a basic connection to our API, the 2 activation steps might be optional for you, if you do not need any data besides basic user information:

|Use case|Implement authorization (OAuth)|Implement activation|
|---|---|---|
|Use itembase as login/registration system|yes|no|
|Request basic user information|yes|no|
|Get access to itembase APIs|yes|yes|

It doesn't matter if the process is initiated from the third party (e.g. with a **connect with itembase** button on your side) or from itembase side (from the Solution Portal): It always works the same and requires no dedicated handling on the third party side.

![itembase authentication and activation](http://developers.itembase.com/images/auth_activation.png)

## Make your data available via the API