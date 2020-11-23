const fetch = require('node-fetch');
const { MoleculerClientError } = require('moleculer').Errors;

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
	methods: {
		async httpFetch(url) {
			try {
				return fetch(url, {})
					.then((response) => this.checkStatus(response))
					.then((response) => this.parseResponse(response))
					.catch((err) => this.handleError(err));
			} catch (err) {
				this.logger.error('Error while performing http request', err);
				return Promise.reject(new MoleculerClientError(`Http Adapter invalid response`, 500));
			}
		},

		/**
		 * Check the response status code
		 */
		checkStatus(res) {
			if (res.ok) {
				return res;
			}

			throw new MoleculerClientError(`Http Adapter request ${res.status}:${res.statusText}`, res.status);
		},

		/**
		 * Check the response status code
		 */
		async parseResponse(res) {
			try {
				const data = await res.json();
				return data;
			} catch (err) {
				this.logger.error('Error while parsing response.json()', err);
				throw new MoleculerClientError(`Http Adapter invalid json response`, 500);
			}
		},

		/**
		 * Handle error
		 */
		handleError(err) {
			this.logger.error('Http Adapter had fatal error', err);
			throw new MoleculerClientError('Http Adapter failed', 500);
		},
	},
};
