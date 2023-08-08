const axios = require('axios');
require('dotenv').config();

const GOOGLE_MAPS_API_BASE_URL=`https://maps.googleapis.com/maps/api`

async function getGeoCode(postal_code) {

    try {
        const geoResponse = await axios.get(
            `${GOOGLE_MAPS_API_BASE_URL}/geocode/json?components=postal_code:${postal_code}&key=${process.env.GOOGLE_MAPS_API_KEY}`
        );
        const {lat, lng} = await geoResponse.data.results[0].geometry.location;
        return {
            ok: true,
            status: 200,
            data: {
                message: "lat long retrieved",
                lat: Number(lat),
                lng: Number(lng)
            }
        };
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

module.exports = {
    getGeoCode
}