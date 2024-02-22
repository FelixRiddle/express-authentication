const dotenv = require("dotenv");

const AuthAPI = require("../../../src/api/auth/AuthAPI");
const confirmUserEmailWithPrivateKey = require("../../../src/email/confirmUserEmailWithPrivateKey");
const serverUrl = require("../../../src/public/web/serverUrl");
const { envServerUrl } = require("../../../src/controllers/env/env");

describe("User register", () => {
    // Setup dotenv
    dotenv.config({
        path: ".env"
    });
    
    const ENV_SERVER_URL = envServerUrl();
    const url = serverUrl(ENV_SERVER_URL);
    
    // Successful registration
    it('Successful user registration', async function() {
        // Create user data
        const userData = {
            name: "Successful User Registration",
            email: "some_email@email.com",
            password: "asd12345",
            confirmPassword: "asd12345"
        };
        
        const api = new AuthAPI(userData, url);
        
        await api.registerUser();
        
        // Confirm user email
        await confirmUserEmailWithPrivateKey(userData.email);
        
        // Login user to be able to delete it
        const loginResult = await api.loginUser();
        
        // Now delete user, because we only need to check if register was successful
        await api.deleteUser();
        
        // This is practically the same as jest
        expect(loginResult.loggedIn).toBe(true);
    });
});
