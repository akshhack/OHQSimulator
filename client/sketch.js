let numTas = 0;
let arrival_times = [];
let start_times = [];
let finish_times = [];
let assigned_servers = [];

let execs = [];
let ohQueue = null;

function setup() {
    let canvas = createCanvas(1000, 1000);

    // Move the canvas so it’s inside our <div id="sketch-holder">.
    canvas.parent('sketch_holder');

    background(133, 195, 242);

    // get data
    fetch("http://localhost:3001/getSimulationData")
        .then((data) => data.json())
        .then((data) => {
            console.log(data);
            numTas = data.numTas;
            arrival_times = data.arrival_times;
            start_times = data.start_times;
            finish_times = data.finish_times;
            assigned_servers = data.assigned_servers;
        });

    let tas = [];
    for (let i = 0; i < numTas; i += 1) {
        tas = tas.concat(new TA(i + 1));
    }
    ohQueue = new OHQueue(tas);

    for (let i = 0; i < start_times.length; i += 1) {
        let student_num = i + 1;
        let student = new Student(student_num);
        let arrival_time = arrival_times[i];
        let start_time = start_times[i];
        let finish_time = finish_times[i];
        let assigned_server = assigned_servers[i];

        let arrival_time_func = () => {
            setTimeout(() => ohQueue.addStudent(student), arrival_time);
        };

        let start_time_func = () => {
            setTimeout(() => {
                ohQueue.removeStudent(student);
                ohQueue.assignStudentToTA(student, assigned_server);
            }, start_time);
        };

        let finish_time_func = () => {
            setTimeout(() => {
                ohQueue.completeStudent(student, assigned_server);
            }, finish_time);
        };

        execs = execs.concat(arrival_time_func, start_time_func, finish_time_func);
    }
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
        }

        ellipse(x, y, 60, 60);
        fill(255, 255, 255);
        textAlign(CENTER, CENTER);
        textSize(16);
        text(this.studentNum.toString(), 0, 0, 60, 60);
    }
}

class OHQueue {
    constructor(tas) {
        this.students = [];
        this.tas = tas;
    };

    show = () => {
        translate(50, 50);
        fill(0, 0, 0);
        rect(0, 0, 100, 80);
        fill(255, 255, 255);
        textAlign(CENTER, CENTER);
        textSize(16);
        text('queue', 0, 0, 100, 80);
        let xOffset = 20;
        // display students in queue
        for (let i = 0; i < this.students.length; i += 1) {
            let student = this.students[i];
            student.show(100 * i, 0);
        }
        // display each TA and their student status [RED - WAITING, YELLOW - ASSIGNED TO TA, GREEN - COMPLETED]
        for (let i = 0; i < this.tas.length; i += 1) {
            let ta = this.tas[i];
            ta.show(80 * i, 120);
        }
    };

    removeStudent = (s) => {
        this.students = this.students.filter((x) => x.studentNum !== s.studentNum);
    };

    addStudent = (s) => {
        s.assignStatus(Student.WAITING);
        this.students = this.students.concat(s);
    };

    assignStudentToTA = (s, t) => {
        s.assignStatus(Student.BEING_SERVED);
        t.addProgressStudent(s);
    };

    completeStudent = (s, t) => {
        s.assignStatus(Student.DONE);
    }
}

class TA {
    constructor(num) {
        this.taNum = num;
        this.progressStudents = [];
    };

    addProgressStudent = (s) => {
        this.progressStudents = this.progressStudents.concat(s);
    };

    show = (x, y) => {
        // display the TA
        fill(0, 0, 0);
        ellipse(x, y, 60, 60);
        fill(255, 255, 255);
        textAlign(CENTER, CENTER);
        textSize(16);
        text("TA " + this.taNum.toString(), 0, 0, 60, 60);
        let yOffset = y + 20;

        // display all students
        for (let i = 0; i < this.progressStudents.length; i += 1) {
            let student = this.progressStudents[i];
            student.show(x, yOffset + 40 * i)
        }
    };
}