const dotenv = require("dotenv");
const { v4: uuidv4 } = require("uuid");

const { FrontendAuthAPI, ResetPasswordAPI, UserAPI } = require("felixriddle.good-roots-ts-api");

const { envServerUrl } = require("../../../../controllers/env/env");

/**
 * Send reset email without authentication
 */
test('Create new password', async function() {
    // Setup dotenv
    dotenv.config({
        path: ".env"
    });
    
    const url = envServerUrl();
    
    const userPassword = "asd12345";
    const email = `alistar_${uuidv4()}@email.com`;
    const userData = {
        name: "Incorrect password",
        email,
        password: userPassword,
        confirmPassword: userPassword
    };
    const api = new FrontendAuthAPI(userData, url);
    
    // Create user and login
    await api.registerUser();
    await api.confirmUserEmailWithPrivateKey(userData.email);
    await api.loginGetJwt();
    
    // Create new password
    const newPassword = "adfasdfjasfj3io2j3";
    const newUserData = {
        name: "Incorrect password",
        email,
        password: newPassword,
        confirmPassword: newPassword
    };
    const passApi = new ResetPasswordAPI(newUserData, url);
    passApi.setBackdoorServerUrl(process.env.BACKDOOR_SERVER_ACCESS_URL);
    const res = await passApi.createWithKey();
    
    // Now login with that
    const newApi = new FrontendAuthAPI(newUserData, url);
    const loginResult = await newApi.loginGetJwt();
    
    // User api
    const userApi = UserAPI.fromAuthenticatedAPI(api);
    
    // Delete user
    await userApi.delete();
    
    expect(loginResult.loggedIn).toBe(true);
});
