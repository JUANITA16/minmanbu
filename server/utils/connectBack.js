const axios = require('axios');
const { getSecret } = require('./secret');

const connectBack = async (url, method, params, headers, body) => {
    try {
        console.info("Getting secretApiKey");
        const Authorization = await getSecret(process.env.SECRET_API_AUTH); // ApiKey para consumir lambdas
        console.info("Front call Back to:", url);
        const config = { 
            method,
            url,
            baseURL: process.env.BACK_BASE,
            params,
            data: body,
            headers: {
                Accept: "application/json",
                Authorization,
                ...headers
            }
        };
        const resp = await axios.request(config)
        const data = await resp.data;
        console.info("get success");
        return {
            status: resp.status,
            data
        }
    }
    catch (err){
        const { status, data } = err.response;
        console.error("Error call back", data);
        return {
            status,
            data
        }
    }
}

module.exports = { connectBack }