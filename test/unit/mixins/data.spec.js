require('jest-fetch-mock').enableMocks();

const fetch = require('node-fetch');
const { ServiceBroker } = require('moleculer');
const { MoleculerClientError } = require('moleculer').Errors;
const TestMixin = require('../../../mixins/data.mixin');

describe("Test 'data' mixin", () => {
	const broker = new ServiceBroker({ logger: false });

	const service = broker.createService({
		name: 'test-service',
		mixins: [TestMixin],
	});

	beforeAll(() => broker.start());
	afterAll(() => broker.stop());
	beforeEach(() => fetch.resetMocks());

	describe("Test 'httpFetch' action", () => {
		it('Should make an http request', async () => {
			fetch.mockResponseOnce(JSON.stringify({ test: true }));

			const res = await service.httpFetch('http://www.google.com');

			expect(res).toEqual({ test: true });
		});

		it('Should handle an error when the response is not valid json', async () => {
			fetch.mockResponseOnce('INVALID JSON');

			await expect(service.httpFetch('http://www.google.com')).rejects.toEqual(
				new MoleculerClientError('Http Adapter failed'),
			);
		});

		it('Should handle an error while making the request', async () => {
			fetch.mockRejectOnce(JSON.stringify({ test: true }));

			await expect(service.httpFetch('http://www.google.com')).rejects.toEqual(
				new MoleculerClientError('Http Adapter failed'),
			);
		});

		it('Should handle an error when the request is aborted', async () => {
			fetch.mockAbortOnce(JSON.stringify({ test: true }));

			await expect(service.httpFetch('http://www.google.com')).rejects.toEqual(
				new MoleculerClientError('Http Adapter invalid response'),
			);
		});

		it('Should handle a 4XX http response', async () => {
			fetch.mockResponseOnce(JSON.stringify({ test: true }), {
				status: 400,
			});

			await expect(service.httpFetch('http://www.google.com')).rejects.toEqual(
				new MoleculerClientError('Http Adapter failed'),
			);
		});

		it('Should handle a 5XX http response', async () => {
			fetch.mockResponseOnce(JSON.stringify({ test: true }), {
				status: 500,
			});

			await expect(service.httpFetch('http://www.google.com')).rejects.toEqual(
				new MoleculerClientError('Http Adapter failed'),
			);
		});
	});
});
