const dotenv = require("dotenv");
const { v4: uuidv4 } = require("uuid");

const AuthAPI = require("../../api/auth/AuthAPI");
const { envServerUrl } = require("../../controllers/env/env");
const serverUrl = require("../../public/web/serverUrl");
const UserAPI = require("../../api/secure/UserAPI");
const createAxiosInstance = require("../../public/axios/createAxiosInstance");

/**
 * The same test as with /user/data
 * 
 * However different context
 * 
 * Here we are testing that protectRoute works
 */
test("Route accessed", async () => {
    // Setup dotenv
    dotenv.config({
        path: ".env"
    });
    
    // Create user data
    const email = `alistar_${uuidv4()}@email.com`;
    const userData = {
        name: "Alistar",
        email: email,
        password: "asd12345",
        confirmPassword: "asd12345"
    };
    
    // Get server url
    const ENV_SERVER_URL = envServerUrl();
    const url = serverUrl(ENV_SERVER_URL);
    
    // Auth api
    const api = new AuthAPI(userData, url);
    
    // Result
    await api.registerUser();
    
    // Confirm user email
    await api.confirmUserEmailWithPrivateKey();
    
    // Get user data from protected endpoint
    let userDataFetch = "";
    try {
        // We will manually log in into it
        const loginRes = await api.loginGetJwt();
        const axiosInstance = createAxiosInstance(ENV_SERVER_URL, "", loginRes.token);
        userDataFetch = await axiosInstance.get("/user/data")
            .then((res) => res.data.user);
        
        // Login and delete
        const userApi = UserAPI.fromAuthenticatedAPI(api);
        await userApi.delete();
    } catch(err) { }
    
    // Emails match
    expect((userDataFetch && userDataFetch.email) === email).toBe(true);
});

/**
 * The same test as with /user/data
 * 
 * However different context
 * 
 * Here we are testing that protectRoute works
 */
test("Couldn't access protected route without logging in", async () => {
    // Setup dotenv
    dotenv.config({
        path: ".env"
    });
    
    // Create user data
    const email = `alistar_${uuidv4()}@email.com`;
    const userData = {
        name: "Alistar",
        email: email,
        password: "asd12345",
        confirmPassword: "asd12345"
    };
    
    // Get server url
    const ENV_SERVER_URL = envServerUrl();
    const url = serverUrl(ENV_SERVER_URL);
    
    // Auth api
    const api = new AuthAPI(userData, url);
    
    // Result
    await api.registerUser();
    
    // Confirm user email
    await api.confirmUserEmailWithPrivateKey();
    
    // Get user data from protected endpoint
    let userDataFetch = "";
    try {
        const axiosInstance = createAxiosInstance(ENV_SERVER_URL);
        userDataFetch = await axiosInstance.get("/user/data")
            .then((res) => res.data.user);
        
        // Login and delete
        await api.loginGetJwt();
        const userApi = UserAPI.fromAuthenticatedAPI(api);
        await userApi.delete();
    } catch(err) { }
    
    // Emails don't match
    expect((userDataFetch && userDataFetch.email) === email).toBe(false);
});
