const Hapi = require('@hapi/hapi');
const routes = require('./src/routes');
const loadModel = require('./src/loadModel');
const InputError = require('./src/InputError');
const dotenv = require('dotenv');
dotenv.config();

(async () => {
    const server = Hapi.server({
        port: process.env.PORT || 8080,
        host: '0.0.0.0',
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    try {
        const model = await loadModel();
        server.app.model = model;
        console.log('Model loaded successfully');
    } catch (error) {
        console.error('Failed to load model:', error);
        process.exit(1);
    }

    server.route(routes);

    server.ext('onPreResponse', function (request, h) {
        const response = request.response;

        if (response instanceof InputError) {
            const newResponse = h.response({
                status: 'fail',
                message: `${response.message} Silakan gunakan foto lain.`
            });
            newResponse.code(response.statusCode);
            return newResponse;
        }

        if (response.isBoom) {
            const newResponse = h.response({
                status: 'fail',
                message: response.message
            });
            newResponse.code(response.output.statusCode);
            return newResponse;
        }

        return h.continue;
    });

    await server.start();
    console.log(`Server running on ${server.info.uri}`);
    console.log('GCP CREDENTIALS:', process.env.GCP_STORAGE_SERVICE);
    console.log('File exists:', require('fs').existsSync(process.env.GCP_STORAGE_SERVICE))
})();