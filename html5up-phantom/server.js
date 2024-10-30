const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Use CORS to allow communication between frontend and backend on localhost
app.use(cors());

//!! Serve static files from your project folder (adjust this path to point to the directory with pad.html)
app.use(express.static(path.join(__dirname)));

//!! Etherpad and OpenAI configuration
const etherpadUrl = 'http://localhost:9001/api/1.2.13/getText';
const etherpadApiKey = '16a76a7a6c0df35725f2d57c27395f649a6b73e4c070fd6141fe50d630875a42';
const openAiApiKey = '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';
const openAiUrl = 'https://api.openai.com/v1/chat/completions';

//!! Default route to serve pad.html when you navigate to localhost:3000/pad
app.get('/pad', (req, res) => {
    res.sendFile(path.join(__dirname, 'pad.html'));
  });

// Endpoint to get AI suggestions based on pad content
app.get('/get-suggestions', async (req, res) => {
    const { padID } = req.query;

    try {
        // Fetch the pad text from Etherpad
        const etherpadResponse = await axios.get(etherpadUrl, {
            params: { apikey: etherpadApiKey, padID: padID }
        });
        const padText = etherpadResponse.data.data.text;

        // Request AI suggestions from OpenAI based on the pad text
        const openAiResponse = await axios.post(
            openAiUrl,
            {
                model: 'gpt-3.5-turbo-0125',
                messages: [
                    { role: "system", content: "You are an AI helping to generate story suggestions." },
                    { role: "user", content: `Based on the following story, provide bullet-pointed suggestions on how to continue:\n\n${padText}` }
                ],
                max_tokens: 100,
                temperature: 0.7
            },
            {
                headers: {
                    'Authorization': `Bearer ${openAiApiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        // Format the suggestions into an array of bullet points
        const suggestions = openAiResponse.data.choices[0].message.content
            .trim()
            .split('\n')
            .map(s => s.trim().replace(/^-/, '').trim());

        res.json({ suggestions });
    } catch (error) {
        console.error('Error fetching AI suggestions:', error);
        res.status(500).json({ error: 'Failed to fetch AI suggestions' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
