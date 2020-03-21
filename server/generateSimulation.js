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
        arrival_times.push(T);

        let nFree = -1;
        for (let i = 0; i < A.length; i += 1) {
            if (A[i] < T) {
                nFree = i;
                break;
            }
        }

        let u = 0;

        if (nFree === -1) {
            for (let v = 0; v < numTas; v += 1) {
                if (A[v] < A[u]) {
                    u = v;
                }
            }

            if (A[u] - T > 30) {
                start_times.push(T + 15);
                finish_times.push(T + 15);
                u = -1;
            } else {
                start_times.push(A[u]);
            }
        } else {
            u = nFree;
            while (A[u] > T) {
                u = (u + 1) % numTas;
            }
            start_times.push(T);
        }

        assigned_servers.push(u);

        if (u >= 0) {
            let rand_arr = new Array(alphas[u]).fill(Math.random());
            let arr_adj = rand_arr.map((x) => Math.log(x) * -1.0 / lambdas[u]);
            let S = arr_adj.reduce((a, b) => a + b, 0);
            finish_times.push(start_times[job_num] + S);
            A[u] = start_times[job_num] + S;
        }
        job_num = job_num + 1;
    }
    return {numTas : numTas, arrival_times : arrival_times, start_times : start_times, finish_times : finish_times, assigned_servers : assigned_servers};
};

exports.simulate = simulate;

