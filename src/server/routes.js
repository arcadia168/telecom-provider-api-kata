module.exports = function (app) {
    // server routes ===========================================================
    app.get('/', (req, res) => {
        res.send('Hello! This is the customer phone number API running on Node, Express and MongoDB! Make some requests.')
    })
}
