const { connectBack } = require("../utils/connectBack");

async function simpleController(req, res) {
    const resp = await connectBack(
        req.path, 
        req.method, 
        req.query,
        {},
        req.body
    )

    res.status(resp.status).json(resp.data)
}

module.exports = simpleController