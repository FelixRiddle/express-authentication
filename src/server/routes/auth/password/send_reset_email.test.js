const dotenv = require("dotenv");
const { v4: uuidv4 } = require("uuid");

const AuthAPI = require("../../../../api/auth/AuthAPI");
const UserAPI = require("../../../../api/secure/UserAPI");
const { envServerUrl } = require("../../../../controllers/env/env");
const ResetPasswordAPI = require("../../../../api/auth/password/ResetPasswordAPI");

/**
 * You can do it whether you're authenticated or not
 */
test('Reset email sent(Authenticated)', async function() {
    // Setup dotenv
    dotenv.config({
        path: ".env"
    });
    
    const url = envServerUrl();
    
    const userPassword = "asd12345";
    const userData = {
        name: "Incorrect password",
        email: `alistar_${uuidv4()}@email.com`,
        password: userPassword,
        confirmPassword: userPassword
    };
    const api = new AuthAPI(userData, url);
    
    await api.registerUser();
    await api.confirmUserEmailWithPrivateKey(userData.email);
    await api.loginGetJwt();
    
    const passApi = ResetPasswordAPI.fromAuthenticatedAPI(api);
    const sendEmailRes = await passApi.sendResetEmail();
    
    // User api
    const userApi = UserAPI.fromAuthenticatedAPI(api);
    
    // Delete user
    await userApi.delete();
    
    expect(sendEmailRes.resetEmailSent).toBe(true);
});

/**
 * Send reset email without authentication
 */
test('Reset email sent', async function() {
    // Setup dotenv
    dotenv.config({
        path: ".env"
    });
    
    const url = envServerUrl();
    
    const userPassword = "asd12345";
    const userData = {
        name: "Incorrect password",
        email: `alistar_${uuidv4()}@email.com`,
        password: userPassword,
        confirmPassword: userPassword
    };
    const api = new AuthAPI(userData, url);
    
    await api.registerUser();
    await api.confirmUserEmailWithPrivateKey(userData.email);
    await api.loginGetJwt();
    
    const passApi = new ResetPasswordAPI(userData, url);
    const sendEmailRes = await passApi.sendResetEmail();
    
    // User api
    const userApi = UserAPI.fromAuthenticatedAPI(api);
    
    // Delete user
    await userApi.delete();
    
    expect(sendEmailRes.resetEmailSent).toBe(true);
});
