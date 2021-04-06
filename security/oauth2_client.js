var ClientOAuth2 = require('client-oauth2');

const CLIENT_ID = process.env.CLIENT_ID || "BLANK";
const CLIENT_SECRET = process.env.CLIENT_ID || "BLANK";

const oauth2_client = new ClientOAuth2({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    accessTokenUri: 'https://github.com/login/oauth/access_token',
    authorizationUri: 'https://github.com/login/oauth/authorize',
    redirectUri: 'http://localhost:3000/auth/github/callback',
    scopes: ['notifications', 'gist'],
})



module.exports = oauth2_client;

