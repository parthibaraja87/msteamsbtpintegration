
import axios from 'axios'

class WfClient {
    constructor() {
        this.WfRestUrl = process.env.WF_REST_URL;
    }
    /**
     * This method is to update the workflow
     */
    // Update the approval status of a workflow passed in via the data parameter
    async updateWorkFlow(token, data) {
        const WfRestUrl = this.WfRestUrl + data.taskID;
        const payload = data.updateWorkFlowData;
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
        catch (error) {
            console.log("Error captured in WF catch block");
            console.error(typeof (error), error.response.status, error.response.data.error.details[0].message);
            error.status = error.response.status;
            error.message = error.response.data.error.details[0].message;
            throw new Error(error);
        }
    }
}

export default WfClient;