const Customer = require('../server/models/customer');

module.exports = function (app) {
    // server routes ===========================================================
    app.get('/', (req, res) => {
        res.send('Hello! This is the customer phone number API running on Node, Express and MongoDB! Make some requests.')
    })

    // Route to retrieve all numbers for a given customer ID
    app.get('/api/customer_phone_numbers/customer/:customer_id', (req, res) => {
        const customerIdToLookup = req.params.customer_id;
        console.log(`customerIdToLookup is: ${customerIdToLookup}`);

        Customer.find(
            { id: customerIdToLookup },
            '-_id phoneNumbers',
            (err, docs) => {
                if (err) {
                    console.error(
                        `An error occurred when attempting to list phone numbers for customer with customerId: ${err.message}`);
                    res.sendStatus(400);
                } else {
                    console.info(`${JSON.stringify(docs)} customer phone numbers listed`);

                    const numbersToReturn = docs[0].phoneNumbers;

                    res.send(
                        numbersToReturn
                    );
                }
            }
        );
    });

    app.get('/api/customer_phone_numbers/all', (req, res) => {
        Customer.find(
            {},
            '-_id phoneNumbers',
            (err, docs) => {
                if (err) {
                    console.error(
                        `An error occurred when attempting to list phone numbers for all customers: ${err.message}`);
                    res.sendStatus(400);
                } else {
                    console.info(`${JSON.stringify(docs)} all customers phone numbers listed`);

                    // Reduce down the retrieved docs to returns single array of all numbers.
                    const aggregatedPhoneNumbers = [];
                    docs.forEach(currentPhoneNumbers => {
                        aggregatedPhoneNumbers.push(
                            ...currentPhoneNumbers.phoneNumbers
                        );
                    });

                    console.info(`The aggregated numbers to return are: ${JSON.stringify(aggregatedPhoneNumbers)}`);

                    res.send(
                        aggregatedPhoneNumbers
                    );
                }
            }
        );
    });

    app.post('/api/customer_phone_number/activate_number', (req, res) => {
        const phoneNumberIdToActivate = req.body;
        console.info(`The phone number ID to activate is: ${JSON.stringify(phoneNumberIdToActivate)}`);

        // Set the specific phone number to be 'activated'
        Customer.updateOne(
            {
                'phoneNumbers.id' : phoneNumberIdToActivate.id
            },
            {
                "$set" : {
                    "phoneNumbers.$.activated": true
                }
            }
        ).then(outcome => {
            if (outcome.ok !== 1) {
                console.info(`The outcome of Customer.findOneAndUpdate for ${phoneNumberIdToActivate.id} was: ${JSON.stringify(outcome)}`);
                console.error(
                    `An error occurred when attempting to upsert phone number with ID: ${JSON.stringify(phoneNumberIdToActivate)}`
                );
                res.sendStatus(500);
            } else {
                console.info(
                    `${JSON.stringify(outcome.n)} records upserted`
                );
                res.sendStatus(200);
            }
        }).catch(error => {
            console.error(`An error occurred when upserting: ${error.message}`);
            res.sendStatus(500);
        });;
    });
}
