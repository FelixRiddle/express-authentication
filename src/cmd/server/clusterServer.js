const cluster = require('cluster');
const OS = require('os');

const { isEmailDisabled, envServerUrl } = require("../../controllers/env/env");
const Server = require('../../server/Server.cjs');

const numCPUs = OS.cpus().length;

/**
 * Cluster server creations
 */
async function clusterServer() {
    // Clusters events
    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
    });
    
    let index = 1;
    cluster.on('listening', (worker, address) => {
        console.log(`Worker(${index}) ${worker.process.pid} listening`);
        index++;
    });
    
    // The primary will fork childs
    if(cluster.isPrimary) {
        console.log(`Number of CPUs: `, numCPUs);
        console.log(`Primary process pid: `, process.pid);
        console.log(`Server url: ${envServerUrl()}`);
        console.log(`Is email disabled?: `, isEmailDisabled());
        
        // Fork processes
        for(let i = 0; i < numCPUs; i++) {
            cluster.fork();
        }
    } else {
        // Workers can share any TCP connection
        let server = new Server();
        
        // Setup middleware, mount routes
        server.setup();
        
        // Serve
        await server.serve();
    }
}

module.exports = clusterServer;
