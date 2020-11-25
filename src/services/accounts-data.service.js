const DataMixin = require('../mixins/data.mixin');
const { HOST_DATA_ACCOUNTS } = require('../config');

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
	name: 'data-accounts',
	settings: {
		urls: {
			list: `${HOST_DATA_ACCOUNTS}/45d38a5b-2a0f-468b-bfcc-7e17b9053082`,
			get: `${HOST_DATA_ACCOUNTS}/d61ee02f-ba20-45a3-b76e-8e827498ca14`,
		},
	},

	mixins: [DataMixin],

	actions: {
		/**
		 * Get all accounts
		 */
		list: {
			async handler(ctx) {
				const url = this.settings.urls.list;
				return this.httpFetch(url);
			},
		},

		/**
		 * Get an account
		 *
		 * @param {String} name - User name
		 */
		get: {
			params: {
				id: 'string',
			},
			/** @param {Context} ctx  */
			async handler(ctx) {
				const url = this.settings.urls.get;
				return this.httpFetch(url);
			},
		},
	},
};
