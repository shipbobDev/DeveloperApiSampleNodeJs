const express = require('express');
const cookieParser = require('cookie-parser');
const url = require('url');
const querystring = require('querystring');
const axios = require('axios');

// Port to listen on
const port = 8001;

// Auth server hostname.
const authHostname = 'auth.shipbob.com';

// Path to the authorize endpoint.
const authPathname = '/connect/integrate';

// Path to the token endpoint.
const tokenPathname = '/connect/token';

// Url to the endpoint to list authorized channels
const channelUrl = 'https://api.shipbob.com/1.0/channel';

// Which oAuth scopes we are requesting.
const scope = 'channels_read fulfillments_read inventory_read inventory_write orders_read orders_write products_read products_write receiving_read receiving_write';

// OAuth client identifier which identifies this application.
const clientId = '<YOUR_CLIENT_ID_HERE>';

// OAuth client secret for authenticating this application.
const clientSecret = '<YOUR_CLIENT_SECRET>';

// The redirect uri that the auth server will redirect back to. Note this must
// be identical one of the redirect uris you provided when registering with
// ShipBob as an application developer.
const redirectUri = `http://localhost:${port}/callback`;

// OAuth response type. Our hybrid flow only allows `code id_token`.
const responseType = 'code id_token';

// OAuth response mode that determines how parameters are sent back to the
// callback url. Our hybrid flow allows either `form_post` or `fragment`. In
// this sample we are using `form_post` so node.js has access to the values
// posted back on the server side. If you are creating a client-side javascript
// application, you can access the values in the URL fragment using `fragment`.
const responseMode = 'form_post';

// The grant type we request from the token endpoint
const grantType = 'authorization_code';

// URL to the authorize endpoint
const authUrl = url.format({
    protocol: 'https',
    hostname: authHostname,
    pathname: authPathname,
    search: querystring.stringify({
        'response_mode': responseMode,
        'response_type': responseType,
        'redirect_uri': redirectUri,
        'client_id': clientId,
        'scope': scope
    })
});

// URL to the token endpoint
const tokenUrl = url.format({
    protocol: 'https',
    hostname: authHostname,
    pathname: tokenPathname
});

// Name of the cookie to store token in
const tokenCookieName = 'shipbob.auth.token';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('view engine', 'hbs');

// The front page
app.get('/', async (req, res) => {
    const accessToken = req.cookies[tokenCookieName];
    // Check if we have an access token saved by the callback endpoint
    if (accessToken) {
        // We have an access token, make a call to the channels endpoint to fetch authorized channels
        try {
            var response = await axios.get(channelUrl, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (response.status === 200) {
                res.render('index', {
                    channels: response.data
                });
                return;
            }
        }
        catch (error) {
            res.clearCookie(tokenCookieName);
            console.log(error);
        }
    }
    // No access token, display a link to authorize
    res.render('index', {
        authUrl: authUrl
    });
});

// The callback endpoint
app.post('/callback', async (req, res) => {
    // Make a request to the token endpoint to exchange the code we just received for a token
    try {
        var response = await axios.post(tokenUrl, querystring.stringify({
            'grant_type': grantType,
            'client_id': clientId,
            'client_secret': clientSecret,
            'redirect_uri': redirectUri,
            'code': req.body.code
        }));
        if (response.status === 200) {
            // Save access token to a cookie
            res.cookie(tokenCookieName, response.data.access_token);
        }
    }
    catch (error) {
        console.log(error);
    }
    res.redirect('/');
});

// Logout by clearing out the access token cookie
app.post('/logout', (req, res) => {
    res.clearCookie(tokenCookieName)
        .redirect('/');
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
