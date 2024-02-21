const dotenv = require("dotenv");

const { serverUrl } = require("../../../src/controllers/env/env");
const AuthAPI = require("../../../src/api/auth/AuthAPI");
const { confirmUserEmail } = require("./authUtils");

describe("auth/login_get_jwt", () => {
    // Setup dotenv
    dotenv.config({
        path: ".env"
    });
    
    const url = serverUrl();
    
    it('Successful login', async function() {
        // Create user data
        const userData = {
            name: "Successful login",
            email: "successful_login@email.com",
            password: "asd12345",
            confirmPassword: "asd12345"
        };
        const api = new AuthAPI(userData, url);
        
        await api.registerUser();
        
        await confirmUserEmail(userData.email);
        
        const loginRes = await api.loginGetJwt();
        
        await api.deleteUser();
        
        // expect(loginRes && loginRes.token && typeof(loginRes.token) === 'string').toBe(true);
        expect(loginRes.loggedIn).toBe(true);
    });
    
    // --- Test login validation ---
    // Password
    it('Incorrect password', async function() {
        const userPassword = "asd12345";
        const userData = {
            name: "Incorrect password",
            email: "incorrect_password@email.com",
            password: userPassword,
            confirmPassword: userPassword
        };
        const api = new AuthAPI(userData, url);
        
        await api.registerUser();
        
        await confirmUserEmail(userData.email);
        
        // Change password
        api.userData.password = "asdf123456";
        const loginRes = await api.loginGetJwt();
        
        // You can't delete the user if you have incorrect login hahha
        // I can't believe I didn't realize that earlier 😂😂
        api.userData.password = userPassword;
        await api.loginGetJwt();
        
        // Delete user
        await api.deleteUser();
        
        expect(!loginRes.loggedIn).toBe(true);
    });
    
    it('Short password', async function() {
        const userPassword = "asd12345";
        const userData = {
            name: "Short Password",
            email: "short_password@email.com",
            password: userPassword,
            confirmPassword: userPassword
        };
        const api = new AuthAPI(userData, url);
        
        await api.registerUser();
        
        await confirmUserEmail(userData.email);
        
        api.userData.password = "asd";
        const loginRes = await api.loginGetJwt();
        
        // Restore user password and login
        api.userData.password = userPassword;
        await api.loginGetJwt();
        
        await api.deleteUser();
        
        expect(!loginRes.loggedIn).toBe(true);
    });
    
    it('Long password', async function() {
        const userPassword = "asd12345";
        const userData = {
            name: "Long password",
            email: "long_password@email.com",
            password: userPassword,
            confirmPassword: userPassword
        };
        const api = new AuthAPI(userData, url);
        
        await api.registerUser();
        
        await confirmUserEmail(userData.email);
        
        api.userData.password = "sK4z5HQeMT5wQzyrqkwkKi1fTyc7eJe0sBjPpHM83pE3PRce4utfPlOpA6h4pEGm9";
        const loginRes = await api.loginGetJwt();
        
        // Restore user password and login
        api.userData.password = userPassword;
        await api.loginGetJwt();
        
        await api.deleteUser();
        
        expect(!loginRes.loggedIn).toBe(true);
    });
    
    // Email
    it('Wrong email', async function() {
        const userEmail = "wrong_email@email.com";
        const userPassword = "asd12345";
        const userData = {
            name: "Wrong email",
            email: userEmail,
            password: userPassword,
            confirmPassword: userPassword
        };
        const api = new AuthAPI(userData, url);
        
        await api.registerUser();
        
        await confirmUserEmail(userData.email);
        
        api.userData.email = "aaaaa@com";
        const loginRes = await api.loginGetJwt();
        
        // Restore user email and login
        api.userData.email = userEmail;
        await api.loginGetJwt();
        
        await api.deleteUser();
        
        expect(!loginRes.loggedIn).toBe(true);
    });
});
