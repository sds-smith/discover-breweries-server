const {
    getDefaultBreweries,
} = require('../../models/breweries/breweries.model');

const {
    getBreweriesNearMe,
    getSearchCityBreweries
} = require('../../models/open-brewery-db/open-brewery-db.model');

async function httpgetDefaultBreweries(req, res) {
    const response = await getDefaultBreweries()
    return res.status(200).json(response)
};

async function httpGetSearchCityBreweries(req, res) {
    const {city, state} = req.query
    const response = await getSearchCityBreweries(city, state)
    return res.status(response.status).json(response.data)
};

async function httpGetBreweriesNearMe(req, res) {
    const {latLong} = req.query
    const response = await getBreweriesNearMe(latLong)
    return res.status(response.status).json(response.data)
};

module.exports = {
    httpgetDefaultBreweries,
    httpGetSearchCityBreweries,
    httpGetBreweriesNearMe
};