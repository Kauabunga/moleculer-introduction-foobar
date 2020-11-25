jest.mock('express');

const express = require('express');

const ApiGateway = require('../../../services/api.service');
const { initGatewayBroker } = require('../../../lib/broker/init');
const { startHttpBroker } = require('../../../lib/broker/start');

const mockExpress = {
	use: jest.fn(),
	listen: jest.fn((port, cb) => cb()),
};

describe('Lib Broker Start', () => {
	beforeEach(() => {
		express.mockImplementation(() => mockExpress);
	});

	it('should start an http broker', async () => {
		const [gatewayBroker, gatewayService] = initGatewayBroker(ApiGateway, [getTestService()])({
			server: false,
		});

		const stopBroker = await startHttpBroker(gatewayBroker, gatewayService, { appName: 'test-http-app', port: 3333 });

		await stopBroker();

		expect(mockExpress.listen).toHaveBeenCalled();
		expect(mockExpress.use).toHaveBeenCalled();
	});
});

function getTestService() {
	return {
		name: 'test-service',
		settings: {},
		dependencies: [],

		events: {},
		actions: {},
		methods: {},
	};
}
