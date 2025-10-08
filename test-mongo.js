const { MongoClient } = require('mongodb');

// Connection URL
const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'ecommerce';

async function run() {
    try {
        await client.connect();
        console.log('Connected successfully to MongoDB');

        const db = client.db(dbName);
        const collections = await db.collections();
        console.log('Collections in DB:', collections.map(c => c.collectionName));
    } catch (err) {
        console.error('Connection failed', err);
    } finally {
        await client.close();
    }
}

run();
