const express = require('express');
const redis = require('redis');

const app = express();
const port = 3000;

// init redis base 64 data saving
const client = redis.createClient({
  url: 'redis://:@redis:6379'
});

(async () => {
    await client.connect();
})();

client.on('connect', async () => {

    console.log('Connected to Redis');

    // save heavybase64 100 time to redis 
    for (let i = 0; i < 100; i++) { 
        const key = i + 'a';
        await client.set(key, 'base64ImageTosave'+i);
    }
});


client.on('error', (err) => {
  console.log(`Error: ${err}`);
});

// Routes
app.get('/', (req, res) => {
  res.send('Yes, server is up !');
});

app.get('/getfromredis/:id', async (req, res) => {
    const keyToRetrieve = req.params['id'];
    const redisResp = await client.get(keyToRetrieve);
    res.json({ id:keyToRetrieve, data: redisResp });
});


app.post('/saveIntoRedisHash', async (req, res) => {
    const keyToRetrieve = req.body.data;
    const redisResp = await client.get(keyToRetrieve);
    res.json({ id:keyToRetrieve, data: redisResp });
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});


