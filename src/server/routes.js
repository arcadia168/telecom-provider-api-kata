const Customer = require('../server/models/customer');

module.exports = function (app) {
    // server routes ===========================================================
    app.get('/', (req, res) => {
        res.send('Hello! This is the customer phone number API running on Node, Express and MongoDB! Make some requests.')
    })

    // Route to retrieve all numbers for a given customer ID
    app.get('/api/customer_phone_numbers/:customer_id', (req, res) => {
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

                    const numberToReturn = docs[0].phoneNumbers;

                    res.send(
                        numberToReturn
                    );
                }
            }
        );
    });
}
