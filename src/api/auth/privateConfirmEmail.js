import axios from "axios";

import { emailConfirmationPrivateKey } from "../../controllers/env/privateKeys.js";
import { serverUrl } from "../../controllers/env/env.js";

/**
 * Confirm email with private key
 * 
 * @param {string} email User email
 */
export default function privateConfirmEmail(email) {
    const instance = axios.create({
        baseURL: `${serverUrl()}/auth`,
        timeout: 2000,
        headers: {
            "Content-Type": "application/json"
        }
    });
    
    const emailConfirmationData = {
        email,
        key: emailConfirmationPrivateKey(),
    };
    console.log(`Email confirmation data: `, emailConfirmationData);
    
    const res = instance.post("/email", emailConfirmationData)
        .then((res) => res.data)
        .catch((err) => {
            console.log(`Error when trying to confirm email from private endpoint: `);
            console.error(err);
        });
    
    return res;
}
