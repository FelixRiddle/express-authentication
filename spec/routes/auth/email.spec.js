const dotenv = require("dotenv");

const { serverUrl } = require("../../../src/controllers/env/env.js");
const AuthAPI = require("../../../src/api/auth/AuthAPI.js");
const { confirmUserEmail } = require("./authUtils.js");

describe("auth/email", () => {
    // Setup dotenv
    dotenv.config({
        path: ".env"
    });
    
    // Create user data
    const userData = {
        name: "Some name",
        email: "some_email1@email.com",
        password: "asd12345",
        confirmPassword: "asd12345"
    };
    
    const url = serverUrl();
    const api = new AuthAPI(userData, url);
    
    it('Confirm email', async function() {
        await api.registerUser();
        
        const confirmEmailRes = await confirmUserEmail(userData.email);
        
        await api.loginGetJwt();
        
        await api.deleteUser();
        
        expect(confirmEmailRes.emailConfirmed).toBe(true);
    });
});
