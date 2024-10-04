const { MongoClient } = require('mongodb');

const db = async (connectionString, app) => {
    console.log("Connection String:", connectionString);
    const client = new MongoClient(connectionString);

    try {
        await client.connect();
        app.locals.db = client.db('RootMath');
        console.log("+++Database Connected");

    } catch (error) {
        console.error("Database connection error:", error);
        await client.close();
        throw new Error("Database connection error");
    }
}

module.exports.db = db;



//this is our DB function that we called inside of our server to connect us to MongoDB. we tehn attach it to our app as a variable under app.locals.db, allowing us to quickly access the database from any endpoint
// under req.app.locals.db

