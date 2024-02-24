const dotenv = require("dotenv");
const { v4: uuidv4 } = require("uuid");

const AuthAPI = require("../../../api/auth/AuthAPI");
const { envServerUrl } = require("../../../controllers/env/env");
const serverUrl = require("../../../public/web/serverUrl");
const UserAPI = require("../../../api/secure/UserAPI");

test("Email confirmation backdoor access", async () => {
    // Setup dotenv
    dotenv.config({
        path: ".env"
    });
    
    // Create user data
    const userData = {
        name: "Alistar",
        email: `${uuidv4()}@email.com`,
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
    const confirmationResult = await api.confirmUserEmailWithPrivateKey();
    
    // Login user to be able to delete it
    await api.loginGetJwt();
    
    const userApi = UserAPI.fromAuthenticatedAPI(api);
    
    // Now delete user, because we only need to check if register was successful
    await userApi.delete();
    
    expect(confirmationResult.emailConfirmed).toBe(true);
});
