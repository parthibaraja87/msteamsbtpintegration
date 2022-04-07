
import axios from 'axios'

class WfClient {
    constructor(){
        this.WfRestUrl = process.env.WF_REST_URL;
    }
    /**
     * This method is to update the workflow
     */
       // Update the approval status of a workflow passed in via the data parameter
    async updateWorkFlow(token, data) {
        const WfRestUrl = this.WfRestUrl + data.taskID ;
		const payload = data.updateWorkFlowData ;
		  try {
            let res = await axios({
                method: 'PATCH',
                url: WfRestUrl,
                headers: {
                    "content-type": "application/json",
                    "Authorization": token
                },
                data: payload
            });
            return res;
        }
        catch (err) {
            console.log(err);
            return err;
        }
        
    }

}

export default WfClient;