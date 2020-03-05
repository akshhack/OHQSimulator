function createTAFields(numTas) {
    console.log(numTas);
    let ta_fields_container = document.getElementById("ta_fields");
    ta_fields_container.innerHTML = "";

    for (let i = 0; i < numTas; i += 1) {
        let label1 = document.createElement("label");
        label1.htmlFor = "ta_alpha" + i;
        label1.textContent = "Alpha time for TA " + (i + 1) + ":";
        ta_fields_container.appendChild(label1);
        ta_fields_container.appendChild(document.createElement("br"));
        let inputBox1 = document.createElement("input");
        inputBox1.id = "ta_alpha" + i;
        inputBox1.type = "text";
        ta_fields_container.appendChild(inputBox1);
        ta_fields_container.appendChild(document.createElement("br"));

        let label2 = label1.cloneNode(false);
        label2.htmlFor = "ta_lambda" + i;
        label2.textContent = "Lambda time for TA " + (i + 1) + ":";
        ta_fields_container.appendChild(label2);
        ta_fields_container.appendChild(document.createElement("br"));
        let inputBox2 = inputBox1.cloneNode(false);
        inputBox2.id = "ta_lambda" + i;
        inputBox2.type = "text";
        ta_fields_container.appendChild(inputBox2);
        ta_fields_container.appendChild(document.createElement("br"));
        ta_fields_container.appendChild(document.createElement("br"));
        ta_fields_container.appendChild(document.createElement("br"));
    }
}

document.getElementById("form").addEventListener("submit", (event) => {
    event.preventDefault();
    let numTas = document.getElementById("num_tas").value;
    let form = new FormData(document.getElementById("form"));
    let myBody = {};
    myBody["numTas"] = numTas;
    myBody["mean_arrival_time"] = Number(form.get("inter_arrival_time"));
    let alphas = [];
    let lambdas = [];
    for (let i = 0; i < numTas; i += 1) {
        alphas = alphas.concat(Number(document.getElementById("ta_alpha" + i).value));
        lambdas = lambdas.concat(Number(document.getElementById("ta_lambda" + i).value));
    }
    myBody["alphas"] = alphas;
    myBody["lambdas"] = lambdas;
    console.log(myBody);

    const userAction = async () => {
        const response = await fetch('http://localhost:3001/doSimulation', {
            method: 'POST',
            body: JSON.stringify(myBody), // string or object
            headers: {
                'Content-Type': 'application/json'
            }
        });
    };
    userAction().then(() => {
        console.log("done");
        window.location.href = 'visualizer.html';
    });
});