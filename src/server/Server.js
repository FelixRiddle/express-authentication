const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');

const getUser = require("../middleware/auth/getUser");
const routes = require("./routes/index")
const { createPublicUserFolder } = require("../user/userFolder");

/**
 * Server
 */
module.exports = class Server {
    constructor() {
        const app = express();
        this.app = app;
        
        this.createDirectories();
        
        this.setupPrivateAccessKeys();
    }
    
    /**
     * Setup private access keys
     * 
     * Mainly for testing, should be disabled on deployment
     */
    setupPrivateAccessKeys() {
        // --- Email private key ---
        // Key for accessing a single endpoint to confirm the email
        // Setup the env var first
        const emailPrivKey = new ConfirmationEmailPrivateKey();
        emailPrivKey.setConfirmationEmailPrivateKey();
        
        // Now handle saving the file so that the testing framework can access it
        const fileExists = emailPrivKey.fileExists();
        if(!fileExists) {
            // The file doesn't exists?, create it.
            emailPrivKey.saveLocally();
        }
        
        // --- Reset password private key ---
        const resetPassPrivKey = new ResetPasswordPrivateKey();
        resetPassPrivKey.setPrivateKey();
        
        const fileExistsA = resetPassPrivKey.fileExists();
        if(!fileExistsA) {
            resetPassPrivKey.saveLocally();
        }
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
     * Start serving requests
     */
    serve() {
        // Open server
        this.app.listen(process.env.SERVER_PORT, () => {
            console.log(`Server running at http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`);
        });
    }
    
    /**
     * Setup all
     */
    async setup() {
        await this.setupMiddleware();
        
        this.mountRoutes();
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
        let whitelist = [process.env.ORIGIN];
        
        // Add another one
        let new_origin = process.env.ORIGIN_1;
        if(new_origin) whitelist.push(new_origin);
        
        this.app.use(cors({
            origin: [
                ...whitelist,
            ]
        }));
        
        // Enable cookie parser
        this.app.use(cookieParser());
        
        // Connect to db
        try {
            await databaseConnection.authenticate();
            
            databaseConnection.sync();
            
            console.log("Successfully connected to db");
        } catch(err) {
            console.error(err);
        }
    }
};
