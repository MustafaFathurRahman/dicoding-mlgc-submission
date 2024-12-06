const { Firestore } = require('@google-cloud/firestore');
const dotenv = require('dotenv');
dotenv.config();

const firestore = new Firestore({
    projectId: process.env.GCP_PROJECT_ID,
    keyFilename: process.env.GCP_STORAGE_SERVICE,
});

const postPredictHandler = require('./handler');

const routes = [
    {
        path: '/predict',
        method: 'POST',
        handler: postPredictHandler,
        options: {
            payload: {
                allow: 'multipart/form-data',
                multipart: true,
                maxBytes: 1000000, // 1MB
            },
        },
    },
    {
        path: '/predict/histories',
        method: 'GET',
        handler: async (request, h) => {
            try {
                const predictions = await firestore.collection('predictions').get();
                const data = predictions.docs.map(doc => ({ id: doc.id, history: doc.data() }));
                return h.response({ status: 'success', data }).code(200);
            } catch (error) {
                console.error('Failed to fetch histories:', error);
                return h.response({
                    status: 'fail',
                    message: 'Failed to fetch histories',
                }).code(500);
            }
        },
    },
];

module.exports = routes;