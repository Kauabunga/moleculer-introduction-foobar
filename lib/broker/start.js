const express = require('express');

exports.startHttpBroker = startHttpBroker;

function startHttpBroker(httpBroker, gatewayService, { appName, port }) {
	console.time(`Starting ${appName}`);

	const app = express();

	return httpBroker
		.start()
		.then(() => {
			app.use(gatewayService.express());
			console.log(`🚀 Deployment ${appName} broker started`);
			return startAppListening(app, appName, port);
		})
		.then(() => handleSuccess(appName, httpBroker))
		.catch((err) => handleError(err, appName));
}

async function startAppListening(app, appName, port) {
	return new Promise((resolve, reject) => {
		app.listen(port, (err) => {
			if (err) {
				return reject(err);
			}

			console.log(`🚀 Deployment ${appName} listening on the port ${port}`);
			return resolve();
		});
	});
}

function handleSuccess(appName, broker) {
	console.timeEnd(`Starting ${appName}`);
	return async () => {
		console.log(`Stopping broker ${appName}`);
		return broker.stop();
	};
}

function handleError(err, appName) {
	console.error(`Fatal Error starting ${appName} broker`);
	console.timeEnd(`Starting ${appName}`);
	console.error(`Fatal Error starting ${appName} broker`, err);
	throw err;
}
