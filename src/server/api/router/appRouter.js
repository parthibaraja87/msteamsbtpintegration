/**
 * appRouter.js provides the express routes used by the client app (React component)
 * to retrieve data to be displayed in the UI or to trigger actions 
 */

import { Router } from 'express';

// Load custom modules
import AuthClient from '../services/AuthClient.js';
import WfClient  from '../services/WfClient.js';
import responseConfig from '../responseConfig.js';


const appRouter = Router();

//Test route
appRouter.get('/testRoute', (req, res) => res.send('<h1>SMB Request Approval API</h1>'));


// Route to update a workflow 
appRouter.post('/updateworkflow', async (req, res) => {
    try {
        const authClient = new AuthClient();
        const client = new WfClient();
        const token = await authClient.getAccessTokenForWFAccess(req);
        const data = req.body;
        const result = await client.updateWorkFlow(token,data);
        console.log("Router try block executed" + result);
        res.json(result);
    }catch(error){
        console.log("Router catch block executed");
        res.setHeader('Content-Type', 'application/json');
        res.status(500).send(error.message ? error.message : 'Internal server error!');
    }
});

export default appRouter;
