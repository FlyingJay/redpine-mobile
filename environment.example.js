

module.exports = {
	// base URL for requests to the API
	API_BASE_URL: 'https://api-staging.redpinemusic.com',

	// your square client ID (sandbox or prod)
	SQUARE_CLIENT_ID: 'square-client-id',

	// transaction prefix to be added to the square transactions
	SQUARE_TRANSACTION_PREFIX: 'REDPINE-DOORS-',

	// replace the ip address with the LAN ip address of the
	// machine running the react-native packager.
	// OR if this is a release build, remove this key.
	JS_CODE_URL: 'http://127.0.0.1:8081/index.bundle?platform=ios&dev=true',

	// this is useful during dev
	// if the app refreshes, you'll be on the page you
	// left off on.
	// don't release though.
	PERSIST_ROUTES: true,

	// enable this temporarily to clear all data
	PURGE_DATA: false,
};