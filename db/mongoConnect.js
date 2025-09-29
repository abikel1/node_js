const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
    // mongoose.set('strictQuery', false);
    console.log("mongo connect started");

    await mongoose.connect('mongodb://127.0.0.1:27017/ATIDA2025');
    console.log("mongo connect work");
    // use await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test'); if your database has auth enabled
}