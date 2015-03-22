# Steps To Run Example

You must have [Node.js](http://nodejs.org/) and [Redis](http://redis.io/download) installed, and Redis must be running.

1. Fork this repository
2. Clone it, using your username

```
git clone git@github.com:<YOUR_USERNAME>/OpenIDConnect.git
cd OpenIDConnect
```

3. Install Node.js dependencies

```
npm install
cd examples
npm install
```

4. Start server

```
node openid-connect-example.js
```

5. Create user at http://localhost:3001/user/create

http://localhost:3001/client/register
  210
  http://localhost:3001/user
  Client Key 0798ec5cb300cd5097d2595319b054fb
  Client Secret 805d61ab96708fa4b45fba75bbbfcea6

http://localhost:3001/test/clear
  scope: foo
  Follow prompts
    Accept
    Next, next, next
    See page that is restricted by foo scope: http://localhost:3001/user/foo?access_token=4ace62feb6c768b27f6524b805276858

http://localhost:3001/

6. Test an auth flow at http://localhost:3001/test

http://localhost:3001/my/login
http://localhost:3001/logout
