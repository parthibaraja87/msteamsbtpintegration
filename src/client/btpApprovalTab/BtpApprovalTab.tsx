import * as React from "react";
import { Provider, Flex, Text } from "@fluentui/react-northstar";
import { PrimaryButton, Button } from "@fluentui/react/lib/Button";
import { useState, useEffect } from "react";
import { useTeams } from "msteams-react-base-component";
import * as microsoftTeams from "@microsoft/teams-js";
import jwtDecode from "jwt-decode";
import axios from "axios";
import * as qs from "qs";


/**
 * Implementation of the BTP Approval content page
 */
export const BtpApprovalTab = () => {

    const [{ inTeams, theme, context }] = useTeams();
    const [entityId, setEntityId] = useState<string | undefined>();
    const [name, setName] = useState<string>();
    const [error, setError] = useState<string>();
    const [text, setText] = useState<string>();

    useEffect(() => {
        if (inTeams === true) {
            microsoftTeams.authentication.getAuthToken({
                successCallback: (token: string) => {
                    const decoded: { [key: string]: any; } = jwtDecode(token) as { [key: string]: any; };
                    setName(decoded!.name);
                    microsoftTeams.appInitialization.notifySuccess();
                },
                failureCallback: (message: string) => {
                    setError(message);
                    microsoftTeams.appInitialization.notifyFailure({
                        reason: microsoftTeams.appInitialization.FailedReason.AuthFailed,
                        message
                    });
                },
                resources: [process.env.TAB_APP_URI as string]
            });
        } else {
            setEntityId("Not in Microsoft Teams");
        }
    }, [inTeams]);

    useEffect(() => {
        if (context) {
            setEntityId(context.entityId);
        }
    }, [context]);

    const handleTextChange = (e) => {
        setText(e.target.value);
    };

    const getTaskId = () => {
        const search = window.location.search;
        const params = new URLSearchParams(search);
        const taskID = params.has('taskID') ? params.get('taskID') : "";
        return taskID;
    };

    const getId = () => {
        let urlParams = new URLSearchParams(document.location.search.substring(1));
        let taskID = urlParams.get('taskID');
        return taskID;
    };

    const onApprove = async () => {
        const tabapiuri = process.env.TAB_APP_URI;
        alert(tabapiuri);
        const authurl = process.env.AUTH_URL;
        alert(authurl);
        let TaskId = getTaskId();
        alert(TaskId);
        let userID = context?.userPrincipalName;
        alert(userID);
        let sComments = text;
        alert(`Comment: ${sComments}`);
        let result = await updateWorkflow1();
        alert(result);

    };

    const onReject = () => {
        alert("Reject Button Clicked!");
        let TaskId = getTaskId();
        alert(TaskId);
    };

    const getAccessToken = async () => {
        try {
            let sAuthurl = process.env.AUTH_URL,
                aAuthClientID = process.env.AUTH_CLIENT_ID,
                aAuthSecret = process.env.AUTH_CLIENT_SECRET,
                payload = qs.stringify({
                    "grant_type": "client_credentials",
                    "client_id": aAuthClientID,
                    "client_secret": aAuthSecret,
                    "response_type": "token"
                });

            let accessToken = await axios({
                method: 'POST',
                url: sAuthurl,
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
                },
                data: payload
            });
            let sAccessToken = `Bearer ${accessToken.data.access_token}`;
            return sAccessToken;
        }
        catch (err) {
            return err;
        }
    };

    const updateWorkflow = async () => {
        try {
            let staskID = "988f03db-a5d1-11ec-a973-eeee0a87f719" || null,
                accessToken = await getAccessToken(),
                sWfRestUrl = process.env.WF_REST_URL + staskID;

            let updateWorkflowData = {
                "context":
                {
                    "comment": "Comment from BAS - Node.js",
                    "processor": "Parthibaraja.Vijayan"
                },
                "status": "COMPLETED",
                "decision": "Approved"
            }
            let responseUpdateWorkflow = await axios({
                method: 'PATCH',
                url: sWfRestUrl,
                headers: {
                    "content-type": "application/json",
                    "Authorization": accessToken
                },
                data: updateWorkflowData
            });
            return responseUpdateWorkflow;
        }
        catch (err) {
            return err;
        }

    };

    const updateWorkflow1 = async () => {
        let accessToken = await getAccessToken();

        var axios = require('axios');
        var data = JSON.stringify({
            "context": {
                "comment": "Comment from pstmn",
                "processor": "bridget.nigina@accenture.com"
            },
            "status": "COMPLETED",
            "decision": "Approved"
        });

        var config = {
            method: 'patch',
            url: 'https://api.workflow-sap.cfapps.eu10.hana.ondemand.com/workflow-service/rest/v1/task-instances/6d2da9b9-ab38-11ec-9eab-eeee0a90869f',
            headers: {
                'Authorization': accessToken, 
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    /**
     * The render() method to create the UI of the tab
     */
    return (
        <Provider theme={theme}>
            <Flex fill={true} column styles={{
                padding: ".8rem 0 .8rem .5rem"
            }}>
                <Flex.Item>
                    <div>
                        <div>
                            <h3>Comments</h3>
                        </div>
                        <div>
                            <textarea id="comments-id" rows={10} cols={60} onChange={handleTextChange} />
                        </div>
                        <div>
                            <Button onClick={onApprove}>Approve</Button>
                            <Button onClick={onReject}>Reject</Button>
                        </div>
                    </div>
                </Flex.Item>
            </Flex>
        </Provider>
    );
};
