import * as React from "react";
import { Provider, Flex, Text } from "@fluentui/react-northstar";
import { PrimaryButton, Button } from "@fluentui/react/lib/Button";
import { useState, useEffect } from "react";
import { useTeams } from "msteams-react-base-component";
import * as microsoftTeams from "@microsoft/teams-js";
import jwtDecode from "jwt-decode";
import axios from "axios";



/**
 * Implementation of the BTP Approval content page
 */
export const BtpApprovalTab = () => {

    const [{ inTeams, theme, context }] = useTeams();
    const [entityId, setEntityId] = useState<string | undefined>();
    const [name, setName] = useState<string>();
    const [error, setError] = useState<string>();
    const [text, setText] = useState<string>();
    const [actionExecuted, setActionExecuted] = useState(false);
    const [message, setMessage] = useState<string>();
    const [errorMessage, setErrorMessage] = useState<string>('');

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
        await updateWorkflow("Approved");
    };

    const onReject = async () => {
        await updateWorkflow("Rejected");
    };

    const updateWorkflow = async (decision) => {
        const userID = context?.userPrincipalName || "parthibaraja.vijayan@accenture.com";
        const comments = text;
        const taskID = context?.subEntityId || "2cee9253-c166-11ec-b0e8-eeee0a9296ab";
        const updateWorkFlowData = {
            "context":
            {
                "comment": comments,
                "processor": userID
            },
            "status": "COMPLETED",
            "decision": decision
        }

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

            setMessage("Action successfully triggered!");
            setErrorMessage(" ");
            setActionExecuted(true);
        }
        catch (error) {
            setMessage("Error triggering the action!");
            setErrorMessage(error.data);
            setActionExecuted(true);
        }

    };


    /**
     * The render() method to create the UI of the tab
     */
    return (

        <div className="container">
            {actionExecuted === false ? (
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
            ) : (
                    <div>
                        <div className="content-message">
                            <Flex column gap="gap.small">
                                <Flex hAlign="center">
                                    <div>
                                        <Text size={"large"} weight={"bold"} content={message} />
                                    </div>
                                </Flex>
                                {errorMessage ? (
                                    <Flex hAlign="center">
                                        <div>
                                            <Text align={"center"} size={"small"} content={errorMessage} />
                                        </div>
                                    </Flex>
                                ) : ''}
                            </Flex>
                        </div>
                    </div>
                )}
        </div>
    );
};
