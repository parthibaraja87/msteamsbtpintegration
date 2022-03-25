
import axios from 'axios'

class WfClient {
    constructor(){
        this.WfRestUrl = process.env.WF_REST_URL;
    }
    /**
     * This method is to update the workflow
     */
       // Update the approval status of a workflow passed in via the data parameter
    async updateWorkflow(token, data) {
        const WfRestUrl = this.WfRestUrl + data.taskID ;
		const payload = data.payload ;
		  try {
            let res = await axios({
                method: 'PATCH',
                url: WfRestUrl,
                headers: {
                    "content-type": "application/json",
                    "Authorization": accessToken
                },
                data: payload
            });
            return res;
        }
        catch (err) {
            return err;
        }
		

        if (res.status >= 400) {
            console.error(res.data);
            throw new Error(res.data); 
        } else {
            if (res.data){
                console.log(res.status)
                return res.data;
            }else{
                console.error("HTTP Response was invalid and cannot be deserialized.");
                throw new Error("HTTP Response was invalid and cannot be deserialized."); 
            }
        }
        
    }

}

export default WfClient;