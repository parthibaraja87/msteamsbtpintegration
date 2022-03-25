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


    const onApprove = async () => {
        const userID = context?.userPrincipalName;
        alert(`userID: ${userID}`);
        const comments = text;
        alert(`Comment: ${comments}`);
        const taskID =context?.subEntityId;
        alert(`taskID: ${taskID}`);
        const data = {

        };
        const updateWorkFlowData = {
            "context":
            {
                "comment": comments,
                "processor": userID
            },
            "status": "COMPLETED",
            "decision": "Approved"
        }
        let result = await updateWorkflow(updateWorkFlowData, taskID);
        alert(result);

    };

    const onReject = () => {
        alert("Reject Button Clicked!");
    };

    const updateWorkflow = async (updateWorkFlowData, taskID) => {
        try {
            const payload = {
                taskID: taskID,
                updateWorkFlowData: updateWorkFlowData
            };
            
            let responseUpdateWorkflow = await axios({
                method: 'post',
                url: '/api/updateworkflow',
                headers: {
                    "content-type": "application/json"
                },
                data: payload
            });
            return responseUpdateWorkflow;
        }
        catch (err) {
            console.log(err.Error);
            return err;
        }

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
