import express from 'express';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import routes from '../../src/server/routes';

// Test utils
var request = require('supertest');

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

// May require additional time for downloading MongoDB binaries
jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;

let mongoServer;
let app;
describe('Customer Phone Number API', () => {
    beforeAll(async () => {
        app = express();
        app.use(bodyParser.json());
        app.use(bodyParser.json({
            type: 'application/vnd.api+json'
        }));
        app.use(bodyParser.urlencoded({
            extended: true
        }));
        app.use(methodOverride('X-HTTP-Method-Override'));

        // connect to our mongoDB database
        mongoServer = new MongoMemoryServer();
        const mongoUri = await mongoServer.getConnectionString();
        await mongoose.connect(mongoUri, { useNewUrlParser: true }, (err) => {
            if (err) console.error(err);
        });
        routes(app);
    });

    afterAll(async () => {
        mongoose.disconnect();
        await mongoServer.stop();
    });

    it('Spins up a server that returns a simple request', async () => {
        const response = await request(app)
            .get('/')

        expect(response.text).toBe('Hello! This is the customer phone number API running on Node, Express and MongoDB! Make some requests.')
    });
});
