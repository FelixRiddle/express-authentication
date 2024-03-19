const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');

const { MSQLDC_FetchENV } = require("app-models");

const getUser = require("../middleware/auth/getUser");
const routes = require("./routes/index")
const { createPublicUserFolder } = require("../user/userFolder");
const SERVER_URL_MAPPINGS = require("../mappings/env/SERVER_URL_MAPPINGS");
const { PortSeeker } = require('felixriddle.port-seeker');
const ConfMap = require("felixriddle.configuration-mappings");

/**
 * Server
 */
module.exports = class Server {
    constructor() {
        const app = express();
        this.app = app;
        
        this.createDirectories();
    }
    
    /**
     * Start serving requests
     */
    async serve() {
        // TODO: This can be put into the repository 'configuration-mappings' to not
        // have to do it for each other repository('real-estate', 'backdoor-server-access', etc.)
        
        // Port priority
        // TODO: process.env.SERVER_PORT > Default url port > Random ephemeral port
        
        // Attempt 3
        const attempt3 = async () => {
            // --- Ephemeral port ---
            console.log(`Attempt 3`);
            
            // The original port didn't work?
            // Let's use another one
            const seeker = new PortSeeker();
            const port = await seeker.firstOpen();
            
            // TODO: Set the new port in configuration
            
            // TODO: Make other servers aware of it
            
            // If the server couldn't start then we will try with another port
            const serverInstance = this.app.listen(port, () => {
                console.log(`Server running at http://${process.env.SERVER_HOST}:${port}`);
            });
            
            serverInstance.on('error', (err) => {
                // console.log(`On error`);
                // console.error(err);
                
                console.log(`Server couldn't start!`);
                console.log(`No more attempts`);
            });
        }
        
        const attempt2 = async () => {
            // --- Default port ---
            console.log(`Attempt 2`);
            
            // Parse url
            const defaultUrl = ConfMap.SERVERS_DEFAULT_LOCATION['express-authentication'];
            const parsedDefaultUrl = new URL(defaultUrl);
            
            const port = parsedDefaultUrl.port;
            
            console.log(`New port: `, port);
            
            const serverInstance = this.app.listen(port, () => {
                console.log(`Server running at http://${process.env.SERVER_HOST}:${port}`);
            });
            
            serverInstance.on('error', async (err) => {
                // console.log(`On error`);
                // console.error(err);
                
                console.log(`Server couldn't start!`);
                await attempt3();
            });
        }
        
        const attempt1 = async () => {
            // --- Environment port ---
            // Will use 3000 if available, otherwise fall back to a random port
            // Try to open the server
            let port = process.env.SERVER_PORT;
        
            console.log(`Attempt 1`);
            
            // Parse port
            if(typeof port === typeof "") {
                port = parseInt(port);
            }
            
            console.log(`Port: `, port);
            
            const instance = this.app.listen(port, () => {
                console.log(`Server running at http://${process.env.SERVER_HOST}:${port}`);
            });
            
            // To catch errors you have to do this
            // (I didn't know 😭😭)
            instance.on('error', async (err) => {
                // console.log(`On error`);
                // console.error(err);
                
                console.log(`Server couldn't start!`);
                await attempt2();
            });
        }
        
        await attempt1();
    }
    
    /**
     * Setup all
     */
    async setup() {
        await this.setupMiddleware();
        
        this.mountRoutes();
    }
    
    /**
     * Create directories if they don't exist
     */
    createDirectories() {
        // Public user folder, so they upload thingies
        createPublicUserFolder();
    }
    
    /**
     * Mount routes
     */
    mountRoutes() {
        this.app.use(getUser, routes);
    }
    
    /**
     * Enable CSP
     * 
     * TODO: Eval should be removed, but there's a package that uses it, I don't even know which one.
     * TODO: A lot of things should be banned, that's the point of CSP.
     */
    enableCsp() {
        // CSP policy
        let cspPolicy = (() => {
            // Array of allowed domains
            // Note that subdomains are disallowed by default, so you must set the star
            // to allow every subdomain.
            let allowedDomains = [
                "unpkg.com",
                "*.unpkg.com",
                "openstreetmap.org",
                "*.openstreetmap.org",
                "cloudflare.com",
                "*.cloudflare.com",
                "cdnjs.cloudflare.com",
                "geocode-api.arcgis.com",
                "cdn.jsdelivr.net",
                // My domains
                "*.perseverancia.com.ar",
                "perseverancia.com.ar",
            ];
            
            // Add domains to the list
            let domains = "";
            for(let domain of allowedDomains) {
                domains += `${domain} `;
            }
            
            // Unsafe things
            // let scriptSrc = `script-src ${domains}'self' 'unsafe-eval' 'unsafe-inline';`;
            // let styleSrc = `style-src ${domains}'self' 'unsafe-inline';`;
            // let defaultSrc = `default-src ${domains}'self' 'unsafe-eval' 'unsafe-inline';`;
            
            // A lil more safe
            let scriptSrc = `script-src ${domains}'self';`;
            let styleSrc = `style-src ${domains}'self';`;
            let imgSrc = `img-src ${domains}'self' data:;`;
            let defaultSrc = `default-src ${domains}'self';`;
            let fontAndFrame = "font-src 'self'; frame-src 'self';";
            
            let cspPolicy = `${fontAndFrame} ${defaultSrc} ${scriptSrc} ${styleSrc} ${imgSrc}`;
            
            return cspPolicy;
        })();
        
        // Set CSP
        this.app.use((req, res, next) => {
            res.setHeader(
                'Content-Security-Policy',
                cspPolicy
            );
            next();
        });
    }
    
    /**
     * Setup some things
     */
    async setupMiddleware() {
        this.enableCsp();
        
        // I don't know
        this.app.use(express.urlencoded({
            extended: true,
        }));
        
        // Json parser middleware
        this.app.use(express.json())
        
        // Cors whitelist
        const whitelist = [
            process.env.ORIGIN,
            SERVER_URL_MAPPINGS.AUTHENTICATION,
            SERVER_URL_MAPPINGS.BACKDOOR_SERVER_ACCESS,
            SERVER_URL_MAPPINGS.GOOD_ROOTS,
            SERVER_URL_MAPPINGS.REAL_ESTATE,
        ];
        
        // And another one
        const nextFrontendUrl = process.env.GOOD_ROOTS_NEXT_FRONTEND_URL;
        if(nextFrontendUrl) whitelist.push(nextFrontendUrl);
        else console.log(`Warning: Next frontend url not found!!!`);
        
        this.app.use(cors({
            credentials: true,
            origin: [
                ...whitelist,
            ]
        }));
        
        // Enable cookie parser
        this.app.use(cookieParser());
        
        // Connect to db
        try {
            const mysqlConn = MSQLDC_FetchENV();
            
            await mysqlConn.authenticate();
            
            mysqlConn.sync();
            
            console.log("Successfully connected to db");
        } catch(err) {
            console.error(err);
        }
    }
};
