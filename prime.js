import cluster from "node:cluster";
import os from "node:os";
const cpuCounter = os.cpus().length;
console.log(`number of cou's is ${cpuCounter}`);
cluster.schedulingPolicy = cluster.SCHED_RR;
cluster.setupPrimary({
    exec:'index.js'
})
for(let i = 0; i < cpuCounter; i++) {
    cluster.fork(); // creates new Node instance
}