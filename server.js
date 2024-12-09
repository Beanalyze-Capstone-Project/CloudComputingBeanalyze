const express = require("express")
require("dotenv").config()

const predict = require("./src")
const PredictService = require("./src/service");

const init = async () => {
    const predictServiceInstance = new PredictService();

    const server = express.server({
        port: process.env.PORT,
        host: "localhost",
        routes:{
        },
    });

    server.ext('onRequest', (request, h) => {
        if (request.headers['content-type'] === 'application/json' && typeof request.payload === 'string') {
            try {
                request.payload = JSON.parse(request.payload);
            } catch (err) {
                return h.response({ error: 'Invalid JSON' }).code(400).takeover();
            }
        }
        return h.continue;
    });

    await server.register([
        {
            plugin: predict,
            options: {
                service: predictServiceInstance,
            },
        },
    ]);

    await server.start();
    console.log("Server running on", server.info.uri);
};

init();
