const AuthAPI = require("../api/auth/AuthAPI");
const { envServerUrl } = require("../controllers/env/env");

/**
 * Test register
 */
async function testRegister() {
    const ENV_SERVER_URL = envServerUrl();
    console.log(`Env server url: ${ENV_SERVER_URL}`);
    const url = (ENV_SERVER_URL);
    
    // Create user data
    const userData = {
        name: "Successful User Registration",
        email: "some_email@email.com",
        password: "asd12345",
        confirmPassword: "asd12345"
    };
    
    const api = new AuthAPI(userData, url);
    
    const registeredUser = await api.registerUser();
    console.log(`Registered user: `, registeredUser);
    
    // Confirm user email
    await confirmUserEmail(userData.email);
    
    // Login user to be able to delete it
    await api.loginGetJwt();
    
    // Now delete user, because we only need to check if register was successful
    await api.deleteUser();
}

async function testRegisterMain(args) {
    // Seed categories
    const testRegisterCmd = args["test_register"];
    if(testRegisterCmd) {
        // Start server
        await testRegister();
    }
    console.log(`Was test register given: ${testRegisterCmd}`);
}

module.exports = testRegisterMain;
