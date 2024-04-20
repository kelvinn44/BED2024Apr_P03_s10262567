const express = require('express');
const app = express();
const port = 3000;

app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}`)
});

// Basic routing - Express
app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.post('/post', (req, res) => {
    res.send('Got a POST request at /post')
});

app.put('/user', (req, res) => {
    res.send('Got a PUT request at /user')
});

app.delete('/delete', (req, res) => {
    res.send('Got a DELETE request at /delete')
});

// Serving static files in Express
app.use(express.static('public'));