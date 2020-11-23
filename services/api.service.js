const ApiGateway = require("moleculer-web");

const { PORT } = require("../config");

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 * @typedef {import('http').IncomingMessage} IncomingRequest Incoming HTTP Request
 * @typedef {import('http').ServerResponse} ServerResponse HTTP Server Response
 */

module.exports = {
	name: "api",
	mixins: [ApiGateway],

	// More info about settings: https://moleculer.services/docs/0.14/moleculer-web.html
	settings: {
		port: PORT,
		log4XXResponses: false,
		logRequestParams: "info",
		logResponseData: "info",

		routes: [
			{
				path: "/api",
				authentication: true,
				authorization: true,
				mappingPolicy: "restrict",
				logging: true,

				aliases: {
					"GET /greeter/hello": "greeter.hello",
					"GET /greeter/welcome": "greeter.welcome",

					"GET /accounts": "accounts.list",
					"GET /accounts/:id": "accounts.get",
				},
			},
		],

		onError(req, res, err) {
			this.logger.error("Error occurred in gateway!", err);

			const resolvedStatus = err.code || 500;

			return res.status(resolvedStatus).json({
				Code: resolvedStatus,
				Message: err.message,
			});
		},
	},

	methods: {
		/**
		 * Authenticate the request. It check the `Authorization` token value in the request header.
		 * Check the token value & resolve the user by the token.
		 * The resolved user will be available in `ctx.meta.user`
		 *
		 * PLEASE NOTE, IT'S JUST AN EXAMPLE IMPLEMENTATION. DO NOT USE IN PRODUCTION!
		 *
		 * @param {Context} ctx
		 * @param {Object} route
		 * @param {IncomingRequest} req
		 * @returns {Promise}
		 */
		async authenticate(ctx, route, req) {
			// Read the token from header
			const auth = req.headers["authorization"];

			if (auth && auth.startsWith("Bearer")) {
				const token = auth.slice(7);

				// Check the token. Tip: call a service which verify the token. E.g. `accounts.resolveToken`
				if (token == "123456") {
					// Returns the resolved user. It will be set to the `ctx.meta.user`
					return { id: 1, name: "John Doe" };
				} else {
					// Invalid token
					throw new ApiGateway.Errors.UnAuthorizedError(
						ApiGateway.Errors.ERR_INVALID_TOKEN
					);
				}
			} else {
				// No token. Throw an error or do nothing if anonymous access is allowed.
				// throw new E.UnAuthorizedError(E.ERR_NO_TOKEN);
				return null;
			}
		},

		/**
		 * Authorize the request. Check that the authenticated user has right to access the resource.
		 *
		 * PLEASE NOTE, IT'S JUST AN EXAMPLE IMPLEMENTATION. DO NOT USE IN PRODUCTION!
		 *
		 * @param {Context} ctx
		 * @param {Object} route
		 * @param {IncomingRequest} req
		 * @returns {Promise}
		 */
		async authorize(ctx, route, req) {
			// Get the authenticated user.
			const user = ctx.meta.user;

			// It check the `auth` property in action schema.
			if (!user) {
				return Promise.reject(
					new ApiGateway.Errors.UnAuthorizedError("NO_RIGHTS")
				);
			}
		},
	},
};
