const request = require('supertest');
const express = require('express');
const { setup } = require('../../index');

describe("Test 'greeter' service", () => {
	const [broker, gatewayService] = setup({ server: false });
	const app = express();

	app.use('/', gatewayService.express());

	beforeAll(() => broker.start());
	afterAll(() => broker.stop());

	describe("Test 'health check' api", () => {
		it('should return with 200 response', async () => {
			await request(app).get('/health').expect(200);
		});
	});
});
