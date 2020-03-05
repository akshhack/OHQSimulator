let simulate = (numTas, mean_inter_arrival_time, alphas, lambdas) => {
    let arrival_times = [];
    let start_times = [];
    let finish_times = [];
    let assigned_servers = [];

    let job_num = 0;
    let T = 0;
    let A = new Array(numTas).fill(0);

    while (T < 840) {
        T = T - mean_inter_arrival_time * Math.log(Math.random());
        arrival_times = arrival_times.concat(T);

        let nFree = 0;
        for (let i = 0; i < A.length; i += 1) {
            if (A[i] < T) {
                nFree += 1;
            }
        }

        let u = 0;

        if (nFree === 0) {
            for (let v = 0; v < numTas; v += 1) {
                if (A[v] < A[u]) {
                    u = v;
                }
            }

            if (A[u] - T > 15) {
                start_times = start_times.concat(T + 15);
                finish_times = finish_times.concat(T + 15);
                u = -1;
            } else {
                start_times = start_times.concat(A[u]);
            }
        } else {
            u = Math.floor(Math.random() * numTas);
            while (A[u] > T) {
                u = Math.floor(Math.random() * numTas);
            }
            start_times = start_times.concat(T);
        }

        assigned_servers = assigned_servers.concat(u);

        if (u >= 0) {
            const reducer = (accumulator, currentValue) => accumulator + currentValue;
            let S = sum_array(create_random_array(alphas[u]).map((x) => Math.log(x) * -1.0 / lambdas[u]));
            finish_times = finish_times.concat(start_times[job_num] + S);
            A[u] = start_times[job_num] + S;
        }
        job_num = job_num + 1;
    }
    return {numTas : numTas, arrival_times : arrival_times, start_times : start_times, finish_times : finish_times, assigned_servers : assigned_servers};
    //console.log(Array.from(Array(job_num).keys()), arrival_times, start_times, finish_times, assigned_servers);
};

let create_random_array = (num) => {
    let arr = [];
    for (let i = 0; i < num; i += 1) {
        arr = arr.concat(Math.random());
    }
    return arr;
};

let sum_array = (arr) => {
    let sum = 0;
    for (let i = 0; i < arr.length; i += 1) {
        sum += arr[i];
    }
    return sum;
};

exports.simulate = simulate;

