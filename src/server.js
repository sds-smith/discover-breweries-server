const http = require('http');

const {mongoConnect} = require('./services/mongo');
const {loadCitiesData, loadBreweriesData} = require('./models/breweries/breweries.model')

const app = require('./app');

const PORT = process.env.PORT || 80;

const server = http.createServer(app);

async function startServer() {
    await mongoConnect();
    await loadBreweriesData();
    await loadCitiesData();
    
    server.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`)
    });
};

startServer();