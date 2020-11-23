const request = require('supertest');
const express = require('express');
const { setup } = require('../../index');

describe("Test 'greeter' service", () => {
	const [broker, gatewayService] = setup();
	const app = express();

	app.use('/', gatewayService.express());

	beforeAll(() => broker.start());
	afterAll(() => broker.stop());

	describe("Test 'greeter.hello' api", () => {
		it("should return with 'Hello Moleculer'", async () => {
			await request(app)
				.get('/api/greeter/hello')
				.set('Authorization', 'Bearer 123456')
				.expect(200)
				.expect('"Hello Moleculer"');
		});

		it('should fail when authorizing with an invalid token', async () => {
			await request(app)
				.get('/api/greeter/hello')
				.set('Authorization', 'Bearer INVALID_TOKEN')
				.expect(401)
				.expect({ Code: 401, Message: 'Unauthorized' });
		});

		it('should fail when authorizing with no authorization header', async () => {
			await request(app).get('/api/greeter/hello').expect(401).expect({ Code: 401, Message: 'Unauthorized' });
		});
	});
});
