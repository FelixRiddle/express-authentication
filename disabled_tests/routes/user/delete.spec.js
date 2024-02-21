const dotenv = require("dotenv");

const { serverUrl } = require("../../../src/controllers/env/env");
const AuthAPI = require("../../../src/api/auth/AuthAPI");
const { confirmUserEmail } = require("../auth/authUtils");

describe("Delete user", () => {
    // Setup dotenv
    dotenv.config({
        path: ".env"
    });
    
    // Create user data
    const userData = {
        name: "Delete user",
        email: "delete_user@email.com",
        password: "asd12345",
        confirmPassword: "asd12345"
    };
    
    const url = serverUrl();
    const api = new AuthAPI(userData, url);
    
    it('Delete user', async function() {
        await api.registerUser();
        
        await confirmUserEmail(userData.email);
        
        await api.loginGetJwt();
        
        const deleteRes = await api.deleteUser();
        
        expect(deleteRes.userDeleted).toBe(true);
    });
});
