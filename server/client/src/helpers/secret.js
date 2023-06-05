const AWS = require('aws-sdk');

const getSecret = async (secretId) => {
    const client = new AWS.SecretsManager({
        region: process.env.REGION
    });

    const response = await client.getSecretValue({ SecretId: secretId }).promise();
    if ("SecretString" in response) return response.SecretString;
    
    return null;
}

module.exports = { getSecret }