const dotenv = require("dotenv");
const { v4: uuidv4 } = require("uuid");

const { FrontendAuthAPI, UserAPI } = require("felixriddle.good-roots-ts-api");

const { envServerUrl } = require("../../../controllers/env/env");
const serverUrl = require("../../../public/web/serverUrl");

test("Email confirmation backdoor access", async () => {
    // Setup dotenv
    dotenv.config({
        path: ".env"
    });
    
    // Create user data
    const userData = {
        name: "Alistar",
        email: `alistar_${uuidv4()}@email.com`,
        password: "asd12345",
        confirmPassword: "asd12345"
    };
    
    // Get server url
    const ENV_SERVER_URL = envServerUrl();
    const url = serverUrl(ENV_SERVER_URL);
    
    // Auth api
    const api = new FrontendAuthAPI(userData, url);
    
    // Result
    await api.registerUser();
    
    // Confirm user email
    await api.confirmUserEmailWithPrivateKey();
    
    // Login user to be able to delete it
    await api.loginGetJwt();
    
    const userApi = UserAPI.fromAuthenticatedAPI(api);
    
    // Now delete user, because we only need to check if register was successful
    const deleteRes = await userApi.delete();
    
    expect(deleteRes.userDeleted).toBe(true);
});
