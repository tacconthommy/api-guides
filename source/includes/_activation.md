## Activation

The following steps are necessary if your client is part of the itembase solution directory and uses data from user defined data connections.

The activation process requires that you obtained a valid access token before (see above).

Activation contains of 2 simple steps: An API call and a redirect.

### Get the activation code

First you need to perform an API call (**on server side**) to our activation endpoint. Call it with a valid access token in the header:

```
curl -X GET --header "Authorization: Bearer your_access_token" "https://solutionservice.itembase.com/activate"
```

The service will generate an *activation URL* for you that is valid for the user authenticated with the given access token and will expire at a given point in time. This is returned to you in a JSON response:

```
{
    "activation_url": "https://solutionservice.itembase.com/finish/some_activation_code",
    "expires_at": 1427361493
}
```

Now the only thing that's left is to redirect to the URL. This will activate your solution for the itembase user. Depending of the starting point of the authentication / activation process, itembase will redirect back to you or to the itembase solution directory.

### Activation notification (optional)

Sometimes there is need to do additional some actions when activation is completed. In order to be notified about such event you can pass as `GET` parameter `notification_uri` where itembase system will send notification as soon as activation step is finalized succsefully after redirect to `activation_url`.

So for example `activation_url` should be modified like:

```
https://solutionservice.itembase.com/finish/some_activation_code?notification_uri=http%3A%2F%2Fsome%2Fnotification%2Furi
```

#### Notification payload

As soon as activation step was succsefully completed a `POST` request will be send to `notification_uri` provided with the following payload:

```
{"user_uuid":"user_uuid for which solution was activated"}
```

The `Content-type` header will be sent with value: `application/json`.
