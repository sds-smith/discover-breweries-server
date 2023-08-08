const mongoose = require('mongoose');

require('dotenv').config();

mongoose.connection.once('open', () => {
    console.log('MongoDB connection ready!')
});

mongoose.connection.on('error', (err) => {
    console.error(err)
})

async function mongoConnect() {
    mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.MONGO_URL);
}

async function mongoDisconnect() {
    await mongoose.disconnect()
}

module.exports = {
    mongoConnect,
    mongoDisconnect
}

