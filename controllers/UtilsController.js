module.exports = {
    inspectPayload: (req, res) => {
        console.log('HEADERS : ')
        console.log(req.headers);
        console.log('---------------------')
        console.log('BODY: ')
        console.log(JSON.stringify(req.body));
        console.log('---------------------')
    }
};