const { ServiceBroker } = require('moleculer');

exports.initGatewayBroker = initGatewayBroker;

function initGatewayBroker(ApiGateway, services = []) {
	return (settings, brokerSettings = {}) => {
		console.time(`Setup gateway broker`); // eslint-disable-line

		const broker = new ServiceBroker(constructBrokerSettings(brokerSettings));
		const gatewayService = broker.createService(ApiGateway, { settings });
		services.forEach((service) => broker.createService(service));

		console.timeEnd(`Setup gateway broker`); // eslint-disable-line

		return [broker, gatewayService];
	};
}

function constructBrokerSettings(brokerSettings = {}) {
	return {
		logger: 'Console',
		logLevel: 'info',
		...brokerSettings,
	};
}
