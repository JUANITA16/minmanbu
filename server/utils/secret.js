const AWS = require('aws-sdk');

const getSecret = async (secretId) => {
    const client = new AWS.SecretsManager({
        region: process.env.REGION
    });
    console.log("secretId: ", secretId);

    let secret = null;
    const response = await client.getSecretValue({ SecretId: secretId }).promise();
    
    if ("SecretString" in response) {
        secret = JSON.parse(response.SecretString);
    }
    
    return secret;
}

module.exports = { getSecret }