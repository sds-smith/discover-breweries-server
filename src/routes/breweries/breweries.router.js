const express = require('express');

const {
    httpgetDefaultBreweries,
    httpGetBreweriesNearMe,
    httpGetSearchCityBreweries
} = require('./breweries.controller')

const breweriesRouter = express.Router();

breweriesRouter.use('/default_city', httpgetDefaultBreweries);
breweriesRouter.use('/by-dist?', httpGetBreweriesNearMe)
breweriesRouter.use('/search?', httpGetSearchCityBreweries)

module.exports = breweriesRouter;