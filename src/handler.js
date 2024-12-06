const predictClassification = require('./inferenceService');
const { Firestore } = require('@google-cloud/firestore');
const crypto = require('crypto');
const InputError = require('./InputError');
const dotenv = require('dotenv');
dotenv.config();

const firestore = new Firestore({
    projectId: process.env.GCP_PROJECT_ID,
    keyFilename: process.env.GCP_STORAGE_SERVICE,
});

async function postPredictHandler(request, h) {
    const { image } = request.payload;
    const { model } = request.server.app;

    console.log('Received payload:', request.payload);
    console.log('Using model:', model);

    try {
        console.log('Starting prediction...');
        const { confidenceScore, label, suggestion } = await predictClassification(model, image);
        console.log('Prediction completed:', { confidenceScore, label, suggestion });

        const id = crypto.randomUUID();
        const createdAt = new Date().toISOString();

        const data = {
            id,
            result: label,
            suggestion,
            createdAt,
        };

        console.log('Saving prediction to Firestore...');
        await firestore.collection('predictions').doc(id).set(data);
        console.log('Prediction saved to Firestore');
        return h.response({
            status: 'success',
            message: 'Model is predicted successfully',
            data,
        }).code(201);
    } catch (error) {
        if (error instanceof InputError) {
            console.error('Input error:', error);
            return h.response({
                status: 'fail',
                message: 'Terjadi kesalahan dalam melakukan prediksi',
            }).code(400);
        }
        console.error('Internal Server Error:', error);
        return h.response({
            status: 'error',
            message: 'An internal server error occurred',
        }).code(500);
    }
}

module.exports = postPredictHandler;