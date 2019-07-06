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

const testPhoneNumberId1 = uuidv1();
const testPhoneNumberId2 = uuidv1();
const testPhoneNumberId3 = uuidv1();
const testPhoneNumberId4 = uuidv1();
const testPhoneNumberId5 = uuidv1();
const testPhoneNumberId6 = uuidv1();
const testPhoneNumberId7 = uuidv1();
const testPhoneNumberId8 = uuidv1();
const testPhoneNumberId9 = uuidv1();
const testPhoneNumberId10 = uuidv1();
const testPhoneNumberId11 = uuidv1();
const testPhoneNumberId12 = uuidv1();
const testPhoneNumberId13 = uuidv1();
const testPhoneNumberId14 = uuidv1();
const testPhoneNumberId15 = uuidv1();
const testPhoneNumberId16 = uuidv1();
const testPhoneNumberId17 = uuidv1();
const testPhoneNumberId18 = uuidv1();
const testPhoneNumberId19 = uuidv1();
const testPhoneNumberId20 = uuidv1();

// Populate the test database with some fake customer data
const testCustomer1PhoneNumbers = [
    { "id": testPhoneNumberId1, "activated": false, "phoneNumber": "+44-785-551-7478" },
    { "id": testPhoneNumberId2, "activated": false, "phoneNumber": "+44-765-555-8239" },
    { "id": testPhoneNumberId3, "activated": true, "phoneNumber": "+44-775-550-7953" },
    { "id": testPhoneNumberId4, "activated": false, "phoneNumber": "+44-785-554-2551" },
    { "id": testPhoneNumberId5, "activated": false, "phoneNumber": "+44-775-559-5768" },
    { "id": testPhoneNumberId6, "activated": false, "phoneNumber": "+44-725-550-2967" },
    { "id": testPhoneNumberId7, "activated": false, "phoneNumber": "+44-715-554-0878" }
];

const testCustomer2PhoneNumbers = [
    { "id": testPhoneNumberId8, "activated": false, "phoneNumber": "+44-745-557-4431" },
    { "id": testPhoneNumberId9, "activated": false, "phoneNumber": "+44-785-553-8959" },
    { "id": testPhoneNumberId10, "activated": false, "phoneNumber": "+44-755-555-4163" },
    { "id": testPhoneNumberId11, "activated": false, "phoneNumber": "+44-715-555-9128" },
    { "id": testPhoneNumberId12, "activated": false, "phoneNumber": "+44-725-553-8397" },
    { "id": testPhoneNumberId13, "activated": true, "phoneNumber": "+44-795-551-2137" },
    { "id": testPhoneNumberId14, "activated": false, "phoneNumber": "+44-715-550-5101" },
];

const testCustomer3PhoneNumbers = [
    { "id": testPhoneNumberId15, "activated": true, "phoneNumber": "+44-715-551-6031" },
    { "id": testPhoneNumberId16, "activated": false, "phoneNumber": "+44-755-559-7116" },
    { "id": testPhoneNumberId17, "activated": false, "phoneNumber": "+44-725-550-2081" },
    { "id": testPhoneNumberId18, "activated": false, "phoneNumber": "+44-795-557-4821" },
    { "id": testPhoneNumberId19, "activated": false, "phoneNumber": "+44-735-552-3423" },
    { "id": testPhoneNumberId20, "activated": false, "phoneNumber": "+44-765-551-6580" },
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

        expect(response.text)
            .toBe(
                'Hello! This is the customer phone number API running on Node, Express and MongoDB! Make some requests.'
            )
    });

    it('Retrieves all of the phone numbers for a specified customer', async () => {
        const retrievedCustomer1PhoneNumbers = await request(app).get(`/api/customer_phone_numbers/customer/${testCustomer1Id}`);
        expect(retrievedCustomer1PhoneNumbers.body).toEqual(testCustomer1PhoneNumbers);
    });

    it('Retrieves all of the phone numbers of all of the customers in the database', async () => {
        const retrievedPhoneNumbers = await request(app).get(`/api/customer_phone_numbers/all/`);

        const allPhoneNumbers = testCustomer1PhoneNumbers
            .concat(testCustomer2PhoneNumbers)
            .concat(testCustomer3PhoneNumbers);

        expect(retrievedPhoneNumbers.body).toEqual(allPhoneNumbers)
    });

    it('Sets a specific phone number to active', async () => {
        await request(app)
            .post('/api/customer_phone_number/activate_number/')
            .send({
                id: testPhoneNumberId14
            });

        // Assert that the item was inserted into the databse
        const expectedActivatedPhoneNumber = await Customer.find(
            {
                'phoneNumbers': {
                    $elemMatch: {
                        'id': testPhoneNumberId14
                    }
                }
            }
        );

        const updatedPhoneNumbers = expectedActivatedPhoneNumber[0].phoneNumbers;
        const expectedActivatedNumber = updatedPhoneNumbers[updatedPhoneNumbers.length - 1];
        expect(expectedActivatedNumber.activated).toBe(true)
    });
});
