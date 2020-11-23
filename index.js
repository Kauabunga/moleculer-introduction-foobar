const { ServiceBroker } = require("moleculer");

const ApiService = require("./services/api.service");
const GreeterService = require("./services/greeter.service");
const AccountsService = require("./services/accounts.service");
const AccountsDataService = require("./services/accounts-data.service");

exports.setup = (brokerSettings) => {
	const broker = new ServiceBroker(brokerSettings);

	// Create API Service
	const gatewayService = broker.createService(ApiService, {
		settings: { server: false },
	});

	// Create Services
	broker.createService(GreeterService);
	broker.createService(AccountsService);
	broker.createService(AccountsDataService);

	return [broker, gatewayService];
};
