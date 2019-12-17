# Node.js Sample Code for ShipBob Developer API
This sample code implements a Node.js web application which authorizes to ShipBob's OAuth2 server and makes a call to the developer API to list authorized channels.

## Prerequisites
The code sample requires the LTS version of [Node.js](https://nodejs.org/en/download/).

## Configuration
Replace the values of the variables `clientId`, `clientSecret`, and `redirectUri` in the file `app.js` with your own client ID, client secret, and redirect URI. Note that the redirect URI must match *exactly* the redirect URIs you provided us when requesting access to the developer API. Please contact us at <developers@shipbob.com> if you would like to add additional redirect URIs to your application for testing purposes.

## Running the Sample
1. Install packages by running the command `npm install` in the sample directory
2. Run the command `npm run start` to start the server and open a browser window to the web application hosted at `http://localhost:8001/`

## More Information
Please refer to [ShipBob for Developers](https://developer.shipbob.com/) for more information about requesting access, authorizing to the API, and making calls to ShipBob's developer API. If you have any questions, please contact us at <developers@shipbob.com>.
