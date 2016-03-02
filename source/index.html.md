---
title: API Reference

language_tabs:
  - shell
  - php
  - python

toc_footers:
  - <a href='#'>Sign Up for a Developer Key</a>
  - <a href='https://github.com/tripit/slate'>Documentation Powered by Slate</a>

includes:
  - errors

search: true
---

# tl;dr

You need to [register  your application](/api/clients) to get a client_id.

You can issue (oauth2 authorized) range queries by datetimes (using created_at_from/-to) or get single entities by id.

Each entity (e.g. /users/{user_id}/transaction) is a valid endpoint. Please refer to <a href="https://bitbucket.org/itembase/data-connect-public">the schema repository for a list of entities</a> and their json schema definitions. There are four entity types: Transaction, Product, Buyer and Profile. Entities that originate from the same data connection have the same <i>source_id</i>. Get the Profile resource which describes the user's profile on the remote platform (e.g. a seller's account, a shop profile) to understand where the related entities (i. E. with the same source_id) originate.

Example call:

```shell
curl http://<url>/v1/users/{user_uuid}/transactions?created_at_from=2015-01-01T00:00:00Z -H 'Content-Type: application/json' -H 'Authorization: Bearer <Access-Token>'
```

## Getting access to the itembase API

1. To use any API provided by itembase, you have to [register your client](/api/clients) with our servers.
2. To get authorized API access via OAuth 2.0, or to use the itembase API as a sign-on service, [you need to authorize](auth) with this information:
* A *client id* which identifies your client with the server (one for sandbox, one for production)
* A *client secret* which you use to perform certain operations during auth process <aside class="warning">keep it in a safe place and **never expose it** to a client</aside>
* One or more *redirect uris* (on your side) that can be used to send an auth code to you – there is a restricted set of URLs per client
We are following the Oauth2 standard. Check out [this excellent video tutorial by KnpUniversity](https://www.youtube.com/watch?v=io_r-0e3Qcw) which explains OAuth2 very well.
3. By default, only the basic user information is available to you even if you have gained the user's authorization. Therefore you may want to activate the data flow from the data connector to the API. To complete this process, you need:
* An additional *redirect uri* that is known on our side and where the activation endpoint will redirect after the process finished.

## Use Cases
In summary, while the authorization is always necessary for a basic connection to our API, the 2 activation steps might be optional for you, if you do not need any data besides basic user information:

|Use case|Implement authorization (OAuth)|Implement activation|
|---|---|---|
|Use itembase as login/registration system|yes|no|
|Request basic user information|yes|no|
|Get access to itembase APIs|yes|yes|

It doesn't matter if the process is initiated from the third party (e.g. with a **connect with itembase** button on your side) or from itembase side (from the Solution Portal): It always works the same and requires no dedicated handling on the third party side.

![itembase authentication and activation](http://developers.itembase.com/images/auth_activation.png)

