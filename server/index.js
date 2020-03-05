const express = require('express');
const cors = require('cors');
const simulator = require("./generateSimulation");

let app = express();
app.use(cors());
const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send("Hello World");
});

let data = null;

app.post('/doSimulation', (req,res) => {
    console.log(req.body);
    data = simulator.simulate(req.body.numTas, req.body.mean_arrival_time, req.body.alphas, req.body.lambdas);
    console.log(data);
    res.send("completed");
});

app.get('/getSimulationData', (req, res) => {
    if (data !== null) {
        res.end(JSON.stringify(data));
    } else {
        res.end("Please configure simulation first");
    }
});

app.listen(3001, () => {
    console.log('server listening at port 3001');
});
