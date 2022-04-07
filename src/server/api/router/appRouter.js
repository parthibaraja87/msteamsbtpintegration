/**
 * appRouter.js provides the express routes used by the client app (React component)
 * to retrieve data to be displayed in the UI or to trigger actions 
 */

import { Router } from 'express';

// Load custom modules
import AuthClient from '../services/AuthClient.js';
import WfClient  from '../services/WfClient.js';


const appRouter = Router();

appRouter.get('/testRoute', (req, res) => res.send('<h1>SMB Request Approval API</h1>'));
// Route to update a workflow 
appRouter.post('/updateworkflow', async (req, res) => {
    try {
        const authClient = new AuthClient();
        const client = new WfClient();
        const token = await authClient.getAccessTokenForWFAccess(req);
        const data = req.body;
        const result = await client.updateWorkFlow(token,data);
        res.json(result);
    }catch(error){
        res.status(500).send(error.message ? error.message : 'Internal server error!');
    }
});


export default appRouter;
