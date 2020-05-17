var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var conn = mongoose.connect("mongodb://localhost/db")
var simulationSchema = new Schema({
    id: Schema.ObjectId,
    tag: String,
    numTas: Number,
    arrivalTimes: [Number],
    startTime: [Number],
    finishTime: [Number],
    TA: [Number],

    // students: {
    //     RoleNum: Number, 
    //     arrivalTime: Number, 
    //     startTime: Number, 
    //     finishTime: Number, 
    //     TA: Number
    //     //AvgGrade: Number
    //     //Add additional parameters
    // }
});

var Simulation = mongoose.model('Simulation', simulationSchema);
module.exports = Simulation;
// export default Simulation;