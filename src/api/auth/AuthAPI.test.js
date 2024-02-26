const dotenv = require("dotenv");
const { v4: uuidv4 } = require("uuid");

const ExpressAuthentication = require('../../ExpressAuthentication');

test("Conversion test: ExpressAuthentication -> AuthAPI -> UserAPI", async () => {
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
    
    // Create general manager
    const expressAuth = new ExpressAuthentication();
    
    // Auth api
    const api = expressAuth.authApi(userData);
    
    // Result
    await api.registerUser();
    
    // Confirm user email
    await api.confirmUserEmailWithPrivateKey();
    
    // Login user to be able to delete it
    await api.loginGetJwt();
    
    // Why separate it?
    // const userApi = UserAPI.fromAuthenticatedAPI(api);
    // If that can be made into the same class
    const userApi = api.userApi();
    
    // Now delete user, because we only need to check if register was successful
    const deleteRes = await userApi.delete();
    
    expect(deleteRes.userDeleted).toBe(true);
});
