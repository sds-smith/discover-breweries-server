const axios = require('axios');
require('dotenv').config();

const {getGeoCode} = require('../geo-code/geo-code.model')

const OPEN_BREWERY_DB_BASE_URL = 'https://api.openbrewerydb.org/breweries';

async function getAllBreweries() {
    return await getBreweries();
}

async function getBreweries(city=undefined, state=undefined, page=1, breweryDocs=[]) {
    let queryString = '';
    if (city) queryString += `by_city=${city}`
    if (state) {
        if (queryString.length > 0) queryString += '&';
        queryString += `by_state=${state}`
    }
    const response = await axios.get(`${OPEN_BREWERY_DB_BASE_URL}?${queryString}&per_page=50&page=${page}`);
    const breweriesResponse = await response.data;
    breweryDocs.push(...breweriesResponse);
    if (breweriesResponse.length === 50) {
        page ++
        await getBreweries(city, state, page, breweryDocs)
    };
    return breweryDocs;
};

async function getBreweriesNearMe(latLong) {
    try {
        const response = await axios.get(`${OPEN_BREWERY_DB_BASE_URL}?by_dist=${latLong}`);
        const breweries = await response.data;
        const {breweriesToReturn} = await transformBreweryData(breweries)
        return {
            ok: true,
            status: 200,
            data: {
                message: "Breweries Retrieved",
                breweries: breweriesToReturn
            }
        }
    } catch(err) {
        return {
            ok: false,
            status: 500,
            data: {
                message: err.message
            }
        }
    }
};

// ! Helper functions
async function getBreweriesByCity(city, state) {
    try {
        const breweryDocs = await getBreweries(city, state);
        const {breweriesToReturn} = await transformBreweryData(breweryDocs);
        return {
            status: 200,
            breweriesToReturn
        }
    } catch (err) {
        console.log(err.message)
        return err
    }
};

async function getSearchCityBreweries(city, state) {
    const searchCityBreweries = await getBreweriesByCity(city, state)
    if (searchCityBreweries.status === 200) {
        return {
            ok: true,
            status: searchCityBreweries.status,
            data: {
                breweries: searchCityBreweries.breweriesToReturn,
                message: `Breweries Retrieved`
            }
        }
    } else {
        return {
            ok: false,
            status: 500,
            data: {
                message: searchCityBreweries.message
            }
        }
    }
}

async function transformBreweryData(breweryDocs) {
    try {
        const breweriesToReturn = []
        for (const breweryDoc of breweryDocs) {
            const {id, name, brewery_type, street, city, state, postal_code, website_url, longitude, latitude} = breweryDoc;
            let longToSet
            let latToSet
            if (!longitude || !latitude) {
                const {data} = await getGeoCode(postal_code?.split('-')[0])
                longToSet = data.lng
                latToSet = data.lat
            } else {
                longToSet = longitude
                latToSet = latitude
            }
            const brewery = {
                id,
                name,
                brewery_type,
                street,
                city,
                state,
                postal_code,
                website_url,
                longitude: longToSet,
                latitude: latToSet
            }
            breweriesToReturn.push(brewery)
        };
        return {
            status: 200,
            breweriesToReturn
        }
    } catch (err) {
        console.log(err.message)
        return err
    }
}


module.exports = {
    getAllBreweries,
    getBreweries,
    getBreweriesNearMe,
    getBreweriesByCity,
    getSearchCityBreweries,
    transformBreweryData
}