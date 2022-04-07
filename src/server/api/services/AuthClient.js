

import querystring from 'querystring';
import qs from 'qs';
import axios from 'axios';


class AuthClient {
    constructor(){
        // Client Id and secret of Workflow
        this.Authurl = process.env.AUTH_URL;
        this.AuthClientID = process.env.AUTH_CLIENT_ID;
		this.AuthSecret= process.env.AUTH_CLIENT_SECRET;
    }
    
    /**
     * This method allows to request an OAuth Bearer token
     */
    async getAccessTokenForWFAccess (){
          try {
            const payload = qs.stringify({
                    "grant_type": "client_credentials",
                    "client_id": this.AuthClientID,
                    "client_secret": this.AuthSecret,
                    "response_type": "token"
                });
            let accessToken = await axios({
                method: 'POST',
                url: this.Authurl,
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
                },
                data: payload
            });
            let sAccessToken = `Bearer ${accessToken.data.access_token}`;
            return sAccessToken;
        }
        catch (err) {
            console.log(err);
            return err;
        }
    }

}

export default AuthClient;