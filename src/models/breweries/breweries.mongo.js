const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }
});

const brewerySchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    brewery_type: {
        type: String,
    },
    street: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    postal_code: {
        type: String,
    },
    website_url: {
        type: String,
    },
    longitude: {
        type: String,
    },
    latitude:{
        type: String,
    }
});

module.exports = {
    breweries: mongoose.model('Brewery', brewerySchema),
    cities: mongoose.model('City', citySchema)

}