const ApiGateway = require('moleculer-web');
const hpp = require('hpp'); // HTTP Parameter Pollution attacks
const helmet = require('helmet'); // HTTP Security
const { UnAuthorizedError, ERR_INVALID_TOKEN, ERR_NO_TOKEN } = require('moleculer-web').Errors;

const { PORT } = require('../config');

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 * @typedef {import('http').IncomingMessage} IncomingRequest Incoming HTTP Request
 * @typedef {import('http').ServerResponse} ServerResponse HTTP Server Response
 */

module.exports = {
	name: 'api',
	mixins: [ApiGateway],

	// More info about settings: https://moleculer.services/docs/0.14/moleculer-web.html
	settings: {
		port: PORT,
		log4XXResponses: false,
		logRequestParams: 'info',
		logResponseData: 'info',

		middleware: [hpp(), helmet.noSniff(), helmet.hidePoweredBy()],

		routes: [
			{
				path: '/',
				authentication: false,
				authorization: false,
				mappingPolicy: 'restrict',
				logging: true,

				aliases: {
					'GET /health': 'api.health',
					'GET /liveness_check': 'api.health',
					'GET /readiness_check': 'api.readiness',
				},
			},
			{
				path: '/api',
				authentication: true,
				authorization: true,
				mappingPolicy: 'restrict',
				logging: true,

				aliases: {
					'GET /accounts': 'accounts.list',
					'GET /accounts/:id': 'accounts.get',
				},
			},
		],

		onError(req, res, err) {
			this.logger.error('Error occurred in gateway!', err);

			const resolvedStatus = err.code || 500;

			return res.status(resolvedStatus).json({
				Code: resolvedStatus,
				Message: err.message,
			});
		},
	},

	actions: {
		health: {
			async handler(ctx) {
				return ctx.call('$node.health');
			},
		},
		readiness: {
			async handler(ctx) {
				// NOTE: Would be good to verify connection to datastores / authentication services
				return ctx.call('$node.health');
			},
		},
	},

	methods: {
		/**
		 * Authenticate the request. It check the `Authorization` token value in the request header.
		 * Check the token value & resolve the user by the token.
		 * The resolved user will be available in `ctx.meta.user`
		 *
		 * @param {Context} ctx
		 * @param {Object} route
		 * @param {IncomingRequest} req
		 * @returns {Promise}
		 */
		async authenticate(ctx, route, req) {
			// Read the token from header
			const auth = req.get('authorization');

			if (auth && auth.startsWith('Bearer')) {
				const token = auth.slice(7);

				// Check the token. Tip: call a service which verify the token. E.g. `accounts.resolveToken`
				if (token === '123456') {
					// Returns the resolved user. It will be set to the `ctx.meta.user`
					return { id: 1, name: 'John Doe' };
				}

				// Invalid token
				throw new UnAuthorizedError(ERR_INVALID_TOKEN);
			}

			// No token. Throw an error or do nothing if anonymous access is allowed.
			throw new UnAuthorizedError(ERR_NO_TOKEN);
		},

		/**
		 * Authorize the request. Check that the authenticated user has right to access the resource.
		 *
		 * @param {Context} ctx
		 * @param {Object} route
		 * @param {IncomingRequest} req
		 * @returns {Promise}
		 */
		async authorize(ctx, route, req) {
			// Get the authenticated user.
			const { user } = ctx.meta;

			// It check the `auth` property in action schema.
			if (!user) {
				return Promise.reject(new UnAuthorizedError('NO_RIGHTS'));
			}

			return Promise.resolve();
		},
	},
};
