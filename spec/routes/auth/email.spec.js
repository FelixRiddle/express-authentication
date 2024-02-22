const dotenv = require("dotenv");

const AuthAPI = require("../../../src/api/auth/AuthAPI.js");
const confirmUserEmailWithPrivateKey = require("../../../src/email/confirmUserEmailWithPrivateKey");
const serverUrl = require("../../../src/public/web/serverUrl.js");
const { envServerUrl } = require("../../../src/controllers/env/env.js");

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
    
    const url = serverUrl(envServerUrl());
    const api = new AuthAPI(userData, url);
    
    it('Confirm email', async function() {
        await api.registerUser();
        
        const confirmEmailRes = await confirmUserEmailWithPrivateKey(userData.email);
        
        await api.loginGetJwt();
        
        await api.deleteUser();
        
        expect(confirmEmailRes.emailConfirmed).toBe(true);
    });
});
