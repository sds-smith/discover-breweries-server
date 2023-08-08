require('dotenv').config();

const {cities, breweries} = require('./breweries.mongo');
const { getAllBreweries, getBreweriesByCity } = require('../open-brewery-db/open-brewery-db.model')

let DEFAULT_CITY='asheville';
let YESTERDAYS_CITY
let CITIES_COUNT
const INTERVAL = 1000 * 60 * 60 * 24


function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  function transform(string) {
    return string.split(' ').map(word => capitalize(word)).join(' ')
  };

//Mongo Functions
async function loadCitiesData() {
    const citiesCount = await cities.count();
    if (citiesCount) {
        CITIES_COUNT = citiesCount
        console.log('City data already loaded!');
    } else {
        await populateCitiesData();
        CITIES_COUNT = await cities.count();
    };
    startClock()
};

async function loadBreweriesData() { 
    const checkBrewery = await findBrewery({
        city: transform(DEFAULT_CITY)
    });
    if (checkBrewery) {
        console.log('Brewery data already loaded!');
    } else {
        populateBreweriesData();
    };
};

async function populateCitiesData() {
    console.log('Downloading cities data...');
    try {
        const breweryDocs = await getAllBreweries();

        let id = 0;
        for (const breweryDoc of breweryDocs) {
            const {city, country} = breweryDoc;
            if (country === "United States") {
                const saved = await saveCity({
                    name: city,
                    id
                });
                if (saved) id ++
            }
        };

        return {
            ok: true,
            status: 201
        }
    } catch (err) {
        console.log(err.message)
        return {
            ok: false,
            status: 500,
            message: err.message
        } 
    }
};

async function populateBreweriesData() {
    console.log('Downloading breweries data...');
    try {
        await clearDefaultBreweries();
        const response = await getBreweriesByCity(DEFAULT_CITY);
        const breweryDocs = response.breweriesToReturn

        for (const breweryDoc of breweryDocs) {
            await saveBrewery(breweryDoc)
        };
        return {
            ok: true,
            status: 201
        }
    } catch (err) {
        console.log(err.message)
        return {
            ok: false,
            status: 500,
            message: err.message
        } 
    }
};

function startClock() {
    console.log('starting clock')
    setInterval(async () => {
        const defaultCityId = Math.floor(Math.random() * CITIES_COUNT).toString();
        console.log({CITIES_COUNT,defaultCityId})
        const city = await findCity({id: defaultCityId})
        console.log({city})
        YESTERDAYS_CITY = DEFAULT_CITY
        DEFAULT_CITY = city.name.toLowerCase();
        await loadBreweriesData();
    }, INTERVAL)
}

async function getDefaultBreweries() {
        const breweriesToReturn = await breweries
        .find({}, {
            '_id': 0,
            '__v': 0
        })
        return {
            DEFAULT_CITY,
            breweries: breweriesToReturn
        }
};

async function clearDefaultBreweries() {
    if (YESTERDAYS_CITY) {
        await breweries.deleteMany({
            city: transform(YESTERDAYS_CITY)
        });
    }
};

async function findCity(filter) {
    return await cities.findOne(filter)
};

async function findBrewery(filter) {
    return await breweries.findOne(filter)
};

async function saveCity(city) {
    const foundCity = await cities.findOne({
        name: city.name
    }).exec();
    if (!foundCity) {
        console.log(`saving ${city.name}`)
        await cities.findOneAndUpdate({
            name: city.name
        },
        city,
        {
            upsert: true
        });
        return true
    }
    return false
}

async function saveBrewery(brewery) {
    await breweries.findOneAndUpdate({
        id: brewery.id
    },
    brewery,
    {
        upsert: true
    });
};

module.exports = {
    loadCitiesData,
    loadBreweriesData,
    startClock,
    getDefaultBreweries,
}