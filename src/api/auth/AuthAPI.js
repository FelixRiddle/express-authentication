import axios from "axios";
import generator from 'generate-password';

import { confirmUserEmail } from "../../../spec/routes/auth/authUtils.js";
import { serverUrl } from "../../controllers/env/env.js";

export default class AuthAPI {
    loggedIn = false;
    
    /**
     * User data
     * 
     * @param {Object} userData User data
     * @param {string} serverUrl The server url
     */
    constructor(userData, serverUrl) {
        this.userData = userData;
        this.serverUrl = serverUrl;
        
        this.setInstance(serverUrl);
    }
    
    // --- For easier setup ---
    /**
     * Creates the class and logs in with a random user email to prevent collisions
     */
    static async createAndLogin() {
        // I don't think using the environment variables works in the frontend
        const url = serverUrl();
        
        // Setup user
        const extendEmail = generator.generate({
            length: 10,
            numbers: true
        });
        const email = `user_${extendEmail}@email.com`;
        const userData = {
            name: "Some name",
            email: email,
            password: "asd12345",
            confirmPassword: "asd12345"
        };
        const api = new AuthAPI(userData, url);
        await api.setupLoggedInInstance();
        
        return api;
    }
    
    /**
     * Create and log in, but with custom user data
     * 
     * @param {object} userData User data
     */
    static async createAndLoginCustomUserData(userData) {
        // I don't think using the environment variables works in the frontend
        const url = serverUrl();
        
        // Setup user
        const api = new AuthAPI(userData, url);
        await api.setupLoggedInInstance();
        
        return api;
    }
    
    /**
     * Create logged in axios instance
     * 
     * Create user, confirm email, login and get axios instance
     * 
     * @param {boolean} [debug=false] Debug data
     * @returns {AxiosInstance} Axios instance
     */
    async createLoginGetInstance(debug = false) {
        const registerRes = await this.registerUser();
        if(debug) {
            console.log(`Register res: `, registerRes);
        }
        
        // Confirm user email
        const confirmRes = await confirmUserEmail(this.userData.email);
        if(debug) {
            console.log(`Confirm email res: `, confirmRes);
        }
        
        // Login user to be able to delete it
        const loginRes = await this.loginGetJwt();
        if(debug) {
            console.log(`Login res: `, loginRes);
            console.log(`Is user logged in?: ${this.loggedIn}`);
        }
        
        return this.instance;
    }
    
    /**
     * Alias
     */
    async setupLoggedInInstance() {
        return this.createLoginGetInstance();
    }
    
    /**
     * Create instance
     * 
     * @param {string} serverUrl The server url
     * @param {string} jwtToken JWT Authentication token(optional)
     */
    setInstance(serverUrl, jwtToken = '') {
        // Location is not defined in nodejs
        const isUndefined = typeof(location) === 'undefined';
        
        // Create headers
        let headers = {
            "Content-Type": "application/json"
        };
        if(jwtToken) {
            // Add jwt token
            headers["Cookie"] = `_token=${jwtToken}`;
        }
        
        if(!isUndefined) {
            this.instance = axios.create({
                withCredentials: true,
                baseURL: `${location.origin}`,
                timeout: 2000,
                headers,
            });
        } else if(!serverUrl) {
            throw Error("Server url is required when the AuthenticationAPI is used in NodeJS");
        } else {
            this.instance = axios.create({
                withCredentials: true,
                baseURL: `${serverUrl}`,
                timeout: 2000,
                headers,
            });
        }
    }
    
    /**
     * Register user
     */
    async registerUser() {
        const res = await this.instance.post("/auth/register", this.userData)
            .then((res) => res)
            .catch((err) => {
                console.error(err);
                return;
            });
        
        return res.data;
    }
    
    /**
     * Login user
     * 
     * It's not very helpful, because I can't access protected endpoints with the axios instance.
     */
    async loginUser() {
        const res = await this.instance.post("/auth/login", {
            email: this.userData.email,
            password: this.userData.password,
        })
            .then((res) => res)
            .catch((err) => {
                console.error(err);
                return;
            });
        
        return res.data;
    }
    
    /**
     * Login get jwt
     * 
     * Use to login and get the jwt token directly
     */
    async loginGetJwt() {
        const res = await this.instance.post('/auth/login_get_jwt', {
            email: this.userData.email,
            password: this.userData.password,
        })
            .then((res) => res)
            .catch((err) => {
                console.log(`Couldn't get JWT token`);
                console.error(err);
                return;
            });
        
        // Update instance
        this.setInstance(this.serverUrl, res.data.token);
        
        this.loggedIn = true;
        
        return res.data;
    }
    
    /**
     * Delete user
     */
    async deleteUser() {
        const res = await this.instance.post("/user/delete", this.userData)
            .then((res) => res)
            .catch((err) => {
                console.error(err);
                return;
            });
        
        return res.data;
    }
    
    // --- Email ---
    /**
     * Send email to reset password
     * 
     * The reset password process can't be done without this step, to ensure the user and
     * email exists and the user owns that email.
     */
    async enableResetPassword() {
        const res = await this.instance.post("/user/password/reset", {
            email: this.userData.email,
        })
            .then((res) => res.data)
            .catch((err) => {
                console.error(err);
                return;
            });
        
        return res;
    }
    
    /**
     * Create new passsword
     * 
     * Second step of resetting password, with this step the user sets the new password.
     * 
     * @param {string} token Token to reset the password
     * @param {string} password 
     * @param {string} confirmPassword 
     */
    async createNewPassword(token, password, confirmPassword) {
        const res = await this.instance.post(`/user/password/create/${token}`, {
            password,
            confirmPassword
        })
            .then((res) => res.data)
            .catch((err) => {
                console.error(err);
                return;
            });
        
        return res;
    }
}
