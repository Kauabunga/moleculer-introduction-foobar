"use strict";

const { ServiceBroker } = require("moleculer");
const request = require("supertest");
const express = require("express");
const TestService = require("../../../services/api.service");
const GreeterService = require("../../../services/greeter.service");

describe("Test 'greeter' service", () => {
	const broker = new ServiceBroker({ logger: false });

	// Add the GatewayService
	const gatewayService = broker.createService(TestService, {
		settings: { server: false },
	});

	// Add the GreeterService
	broker.createService(GreeterService);

	// Create Express application
	const app = express();

	// Use ApiGateway as middleware
	app.use("/", gatewayService.express());

	beforeAll(() => broker.start());
	afterAll(() => broker.stop());

	describe("Test 'greeter.hello' api", () => {
		it("should return with 'Hello Moleculer'", async () => {
			await request(app)
				.get("/api/greeter/hello")
				.expect(200)
				.expect('"Hello Moleculer"');
		});
	});
});
