const { initGatewayBroker } = require('./lib/broker/init');
const ApiService = require('./services/api.service');
const GreeterService = require('./services/greeter.service');
const AccountsService = require('./services/accounts.service');
const AccountsDataService = require('./services/accounts-data.service');

exports.setup = initGatewayBroker(ApiService, [GreeterService, AccountsService, AccountsDataService]);
