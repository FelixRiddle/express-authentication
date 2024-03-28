const ServerWrapper = require("./ServerWrapper.cjs");
const cluster = require('cluster');
const OS = require('os');

const { isEmailDisabled, envServerUrl } = require("./../controllers/env/env");

const numCPUs = OS.cpus().length;

/**
 * Create server
 */
module.exports = class Server {
    routesMounted = false;
    
    constructor() {
        this.server = new ServerWrapper();
    }
    
    /**
     * Start cluster server
     */
    async startClusterServer() {
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
            this.startServer();
        }
    }
    
    /**
     * Start single server
     */
    async startServer() {
        // Serve
        await this.server.serve();
    }
    
    /**
     * Set server routes
     */
    mountRoutes(routes) {
        if(this.routesMounted) {
            throw Error("You've tried to mount routes twice!");
        }
        
        if(!routes) {
            throw Error("You didn't give any routes");
        }
        
        // Setup middleware, mount routes
        this.server.setup();
        
        this.server.mountRoutes(routes);
        
        this.routesMounted = true;
        
        return this;
    }
}
