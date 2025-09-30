const { config } = require('dotenv');
const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
    // mongoose.set('strictQuery', false);
    console.log("mongo connect started");

    await mongoose.connect(`mongodb+srv://${config.userDb}:${config.passDb}@cluster0.hnj8f3f.mongodb.net/`);
    console.log("mongo connect work");
    // use await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test'); if your database has auth enabled
}