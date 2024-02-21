const dotenv = require("dotenv");

const AuthAPI = require("../../../../src/api/auth/AuthAPI.js");
const ResetPasswordAPI = require("../../../../src/api/auth/ResetPasswordAPI.js");
const serverUrl = require("../../../../src/public/web/serverUrl.js");
const { envServerUrl } = require("../../../../src/controllers/env/env.js");

describe("Start password reset process", () => {
    // Setup dotenv
    dotenv.config({
        path: ".env"
    });
    
    // Get server url
    const ENV_SERVER_URL = envServerUrl();
    const url = serverUrl(ENV_SERVER_URL);
    
    it('Start password reset process', async function() {
        // Fast setup
        const api = await AuthAPI.createAndLogin(url);
        
        const passwordApi = new ResetPasswordAPI(api.userData, url);
        const resetRes = await passwordApi.resetPassword();
        
        // Delete user
        await api.deleteUser();
        
        expect(resetRes.resetEmailSent).toBe(true);
    });
});
