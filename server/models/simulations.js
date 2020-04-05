var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var simulationsSchema = new Schema({
    id: Schema.ObjectId,
    tag: String,
    numTas: Number,
    students: {
        RoleNum: Number, 
        arrivalTime: Number, 
        startTime: Number, 
        finishTime: Number, 
        TA: Number
        //AvgGrade: Number
        //Add additional parameters
    }
});

mongoose.model('simulations', simulationSchema);