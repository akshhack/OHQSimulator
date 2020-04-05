const express = require('express');
const cors = require('cors');
const simulator = require("./generateSimulation");

// Loads up all models in models directory
//https://www.youtube.com/watch?v=5e1NEdfs4is (FOLLOW THIS TUTORIAL)
var fs = require('fs');
fs.readdirSync(__dirname + '/models').forEach(function(filename) {
    if (~filename.indexOf('.js')) require(__dirname + '/models/' + filename)
});


let app = express();
app.use(cors());
const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send("OHQ Simulator");
});

let data = null; // This variable needs to be converted into a database stored locally
// Add a field to do simulation request
// 

app.post('/doSimulation', (req,res) => { // Data variable is populated
    data = simulator.simulate(req.body.numTas, req.body.mean_arrival_time, req.body.alphas, req.body.lambdas);
    // data.numTas
    // data.arrival_times
    // data.start_times
    // data.finish_times
    // data.assigned_servers
    // req.body.simTag

    res.send("completed");
});

app.get('/getSimulationData', (req, res) => { // request should have a <tag> param to specify what simulation to get 
    if (data !== null) {
        res.end(JSON.stringify(data));
    } else {
        res.end("Please configure simulation first");
    }
});

app.listen(3001, () => {
    console.log('server listening at port 3001');
    // View using http://localhost:3001/
});
