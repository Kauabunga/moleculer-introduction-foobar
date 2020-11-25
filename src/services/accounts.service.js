/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
	name: 'accounts',
	actions: {
		/**
		 * Get all accounts
		 */
		list: {
			async handler(ctx) {
				return ctx.call('data-accounts.list');
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
				return ctx.call('data-accounts.get', { id: ctx.params.id });
			},
		},
	},
};
