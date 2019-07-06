import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import uuidv1 from 'uuid/v1';
import methodOverride from 'method-override';
import routes from '../../src/server/routes';
import Customer from '../../src/server/models/customer';

// Test utils
const request = require('supertest');

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

// May require additional time for downloading MongoDB binaries
jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;

let mongoServer;
let app;

// Set up test data
const testCustomer1Id = uuidv1();
const testCustomer2Id = uuidv1();
const testCustomer3Id = uuidv1();

// Populate the test database with some fake customer data
const testCustomer1PhoneNumbers = [
    { "phoneNumber": "+44-785-551-7478" },
    { "phoneNumber": "+44-765-555-8239" },
    { "phoneNumber": "+44-775-550-7953" },
    { "phoneNumber": "+44-785-554-2551" },
    { "phoneNumber": "+44-775-559-5768" },
    { "phoneNumber": "+44-725-550-2967" },
    { "phoneNumber": "+44-715-554-0878" }
];

const testCustomer2PhoneNumbers = [
    { "phoneNumber": "+44-745-557-4431" },
    { "phoneNumber": "+44-785-553-8959" },
    { "phoneNumber": "+44-755-555-4163" },
    { "phoneNumber": "+44-715-555-9128" },
    { "phoneNumber": "+44-725-553-8397" },
    { "phoneNumber": "+44-795-551-2137" },
    { "phoneNumber": "+44-715-550-5101" },
];

const testCustomer3PhoneNumbers = [
    { "phoneNumber": "+44-715-551-6031" },
    { "phoneNumber": "+44-755-559-7116" },
    { "phoneNumber": "+44-725-550-2081" },
    { "phoneNumber": "+44-795-557-4821" },
    { "phoneNumber": "+44-735-552-3423" },
    { "phoneNumber": "+44-765-551-6580" },
];

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
        const sess = {
            genid: function (req) {
                return uuidv1() // use UUIDs for session IDs
            },
            secret: 'keyboard dog',
            cookie: {}
        }
        app.use(session(sess));

        // connect to our mongoDB database
        mongoServer = new MongoMemoryServer();
        const mongoUri = await mongoServer.getConnectionString();
        await mongoose.connect(mongoUri, { useNewUrlParser: true }, (err) => {
            if (err) console.error(err);
        });
        routes(app);

        const firstCustomer = {
            id: testCustomer1Id,
            name: 'first test customer',
            phoneNumbers: testCustomer1PhoneNumbers,
        };
        const secondCustomer = {
            id: testCustomer2Id,
            name: 'second test customer',
            phoneNumbers: testCustomer2PhoneNumbers,
        };
        const thirdCustomer = {
            id: testCustomer3Id,
            name: 'third test customer',
            phoneNumbers: testCustomer3PhoneNumbers,
        };

        const firstCustomerToSave = new Customer(firstCustomer);
        await firstCustomerToSave.save();

        const secondCustomerToSave = new Customer(secondCustomer);
        await secondCustomerToSave.save();

        const thirdCustomerToSave = new Customer(thirdCustomer);
        await thirdCustomerToSave.save();
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

    it('Retrieves all of the phone numbers for a specified customer', async () => {
        const retrievedCustomer1PhoneNumbers = await request(app)
            .get(`/api/customer_phone_numbers/${testCustomer1Id}`);

        expect(retrievedCustomer1PhoneNumbers.body).toEqual(testCustomer1PhoneNumbers);
    });
});
