const axios = require('axios');

const apiKey = 'yourapikey';
const etherpadUrl = 'http://localhost:9001/api/1.2.15';

async function createPad(padID) {
    try {
        const response = await axios.get(`${etherpadUrl}/createPad`, {
            params: {
                apikey: apiKey,
                padID: padID
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating pad:', error.response ? error.response.data : error.message);
        throw error;
    }
}

module.exports = {
    createPad
};
