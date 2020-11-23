require("jest-fetch-mock").enableMocks();

const fetch = require("node-fetch");
const request = require("supertest");
const express = require("express");
const { setup } = require("../../index");

describe("Test 'accounts' service", () => {
	const [broker, gatewayService] = setup();
	const app = express();

	app.use("/", gatewayService.express());

	beforeAll(() => broker.start());
	afterAll(() => broker.stop());
	beforeEach(() => fetch.resetMocks());

	describe("Test 'GET /accounts' api", () => {
		it("should return with a list of accounts", async () => {
			const mockResponseFn = fetch.mockResponseOnce(
				JSON.stringify([
					{
						AccountId: "9137eb34-fa50-5c46-a29f-fb23405cd807",
						Currency: "NZD",
						Nickname: "Cheque Account",
						Account: {
							SchemeName: "BECSElectronicCredit",
							Identification: "99-7751-2781004-00",
							Name: "CurrentAccount",
						},
						Servicer: {
							Identification: "MWNZBNK1",
							SchemeName: "BICFI",
						},
						Amount: {
							Amount: "20000.00",
							Currency: "NZD",
						},
						CreditDebitIndicator: "Credit",
						Type: "OpeningAvailable",
						DateTime: "2020-11-11T03:05:37.653Z",
					},
				])
			);

			const { body } = await request(app)
				.get("/api/accounts")
				.set("Authorization", "Bearer 123456")
				.expect(200);

			expect(body.length).toEqual(1);

			expect(mockResponseFn).toHaveBeenCalled();
			expect(mockResponseFn).toHaveBeenCalledWith(
				"https://run.mocky.io/v3/45d38a5b-2a0f-468b-bfcc-7e17b9053082",
				{}
			);
		});
	});

	describe("Test 'GET /accounts/:id' api", () => {
		it("should return with a single account", async () => {
			const mockResponseFn = fetch.mockResponseOnce(
				JSON.stringify({
					AccountId: "9137eb34-fa50-5c46-a29f-fb23405cd807",
					Currency: "NZD",
					Nickname: "Cheque Account",
					Account: {
						SchemeName: "BECSElectronicCredit",
						Identification: "99-7751-2781004-00",
						Name: "CurrentAccount",
					},
					Servicer: {
						Identification: "MWNZBNK1",
						SchemeName: "BICFI",
					},
					Amount: {
						Amount: "20000.00",
						Currency: "NZD",
					},
					CreditDebitIndicator: "Credit",
					Type: "OpeningAvailable",
					DateTime: "2020-11-11T03:05:37.653Z",
				})
			);

			const { body } = await request(app)
				.get("/api/accounts/ACCOUNT_ID")
				.set("Authorization", "Bearer 123456")
				.expect(200);

			expect(body.AccountId).toEqual(
				"9137eb34-fa50-5c46-a29f-fb23405cd807"
			);

			expect(mockResponseFn).toHaveBeenCalled();
			expect(mockResponseFn).toHaveBeenCalledWith(
				"https://run.mocky.io/v3/d61ee02f-ba20-45a3-b76e-8e827498ca14",
				{}
			);
		});
	});
});
