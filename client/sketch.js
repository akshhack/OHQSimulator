const SIMULATION_DATA_URL = 'http://localhost:3001/getSimulationData'

let numTas = 0;
let arrival_times = [];
let start_times = [];
let finish_times = [];
let assigned_servers = [];

let execs = [];
let ohQueue = null;

function setup() {
    let canvas = createCanvas(5000, 5000);

    // Move the canvas so it’s inside our <div id="sketch-holder">.
    canvas.parent('sketch_holder');

    // get data
    fetch(SIMULATION_DATA_URL)
        .then((data) => data.json())
        .then((data) => {
            numTas = data.numTas;
            arrival_times = data.arrival_times;
            start_times = data.start_times;
            finish_times = data.finish_times;
            assigned_servers = data.assigned_servers;

            let tas = {};
            new Array(numTas).fill(0).map((_, i) => tas[i] = new TA(i + 1));
            ohQueue = new OHQueue(tas);

            for (let i = 0; i < start_times.length; i += 1) {
                let student_num = i + 1;
                let student = new Student(student_num);
                let arrival_time = arrival_times[i];
                let start_time = start_times[i];
                let finish_time = finish_times[i];
                let assigned_server = assigned_servers[i];

                let arrival_time_func = () => {
                    setTimeout(() => ohQueue.addStudent(student), arrival_time * 200);
                };

                let start_time_func = () => {
                    setTimeout(() => {
                        ohQueue.removeStudent(student);
                        if (assigned_server !== -1) {
                            ohQueue.assignStudentToTA(student, tas[assigned_server]);
                        } else {
                            // student was not serviced
                            student.assignStatus(Student.UNSERVICED);
                        }
                    }, start_time * 200);
                };

                let finish_time_func = () => {
                    setTimeout(() => {
                        ohQueue.completeStudent(student);
                    }, finish_time * 200);
                };

                execs.push(arrival_time_func, start_time_func, finish_time_func);
            }

            execs.map((x) => {
                x();
            });
        }
    );
}

function draw() {
    if (ohQueue != null) {
        ohQueue.show();
    }
}

class Student {

    static WAITING = -1;
    static BEING_SERVED = 0;
    static DONE = 1;
    static UNSERVICED = 2;

    constructor(num) {
        this.studentNum = num;
        this.status = Student.WAITING;
    }

    assignStatus = (status) => {
        this.status = status;
    };

    show = (x, y) => {
        // display student with their color status
        switch(this.status) {
            case Student.WAITING:
                fill(246, 34, 69);
            break;
            case Student.BEING_SERVED:
                fill(243, 243, 58);
            break;
            case Student.DONE:
                fill(58, 243, 64);
            break;
            case Student.UNSERVICED:
                fill(192, 192, 192);
            break;
        }

        ellipse(x, y, 60, 60);
        fill(255, 255, 255);
        textAlign(CENTER, CENTER);
        textSize(16);
        text(this.studentNum.toString(), x - 18, y - 20, 40, 40);
    }
}

class OHQueue {
    constructor(tas) {
        this.students = [];
        this.tas = tas;
        this.unservicedStudents = [];
    };

    show = () => {
        clear();
        background(133, 195, 242);
        translate(50, 50);
        fill(0, 0, 0);
        rect(0, 0, 100, 80);
        fill(255, 255, 255);
        textAlign(CENTER, CENTER);
        textSize(16);
        text('queue', 0, 0, 100, 80);

        // display students in queue
        this.students.map((student, i) => student.show(200 * (i + 1), 40));

        // display each TA and their student status [RED - WAITING, YELLOW - ASSIGNED TO TA, GREEN - COMPLETED]
        Object.keys(this.tas).map((ta, i) => this.tas[ta].show(200 * (i + 1), 200));

        fill(0, 0, 0);
        rect(1000, 200, 100, 80);
        fill(255, 255, 255);
        textAlign(CENTER, CENTER);
        textSize(16);
        text('left', 1000, 200, 100, 80);

        // show all unserviced students
        this.unservicedStudents.map((student, i) => student.show(1050, 250 + 80 * (i + 1)));
    };

    removeStudent = (s) => {
        this.students = this.students.filter((x) => x.studentNum !== s.studentNum);
    };

    addStudent = (s) => {
        s.assignStatus(Student.WAITING);
        this.students.push(s);
    };

    assignStudentToTA = (s, t) => {
        s.assignStatus(Student.BEING_SERVED);
        t.addProgressStudent(s);
    };

    completeStudent = (s) => {
        if (s.status === Student.UNSERVICED) {
            this.unservicedStudents.push(s);
        } else {
            s.assignStatus(Student.DONE);
        }
    };
}

class TA {
    constructor(num) {
        this.taNum = num;
        this.progressStudents = [];
    };

    addProgressStudent = (s) => {
        this.progressStudents.push(s);
    };

    show = (x, y) => {
        // display the TA
        fill(0, 0, 0);
        ellipse(x, y, 60, 60);
        fill(255, 255, 255);
        textSize(16);
        textAlign(CENTER, CENTER);
        text("TA " + this.taNum.toString(), x - 15, y - 20, 40, 40);

        // display all students
        this.progressStudents.map((student, i) => student.show(x, y + 80 * (i + 1)));
    };
}