import * as React from "react";
import { Provider, Flex, Text} from "@fluentui/react-northstar";
import { PrimaryButton, Button } from "@fluentui/react/lib/Button";
import { useState, useEffect } from "react";
import { useTeams } from "msteams-react-base-component";
import * as microsoftTeams from "@microsoft/teams-js";
import jwtDecode from "jwt-decode";

/**
 * Implementation of the BTP Approval content page
 */
export const BtpApprovalTab = () => {

    const [{ inTeams, theme, context }] = useTeams();
    const [entityId, setEntityId] = useState<string | undefined>();
    const [name, setName] = useState<string>();
    const [error, setError] = useState<string>();

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
                            <textarea id="comments-id" rows={10} cols={60} />
                        </div>
                        <div>
                            <Button color={"#ff5c5c"} onClick={() => alert("Approve Button Clicked!")}>Approve</Button>
                            <Button onClick={() => alert("Reject Button Clicked!")}>Reject</Button>
                        </div>
                    </div>
                </Flex.Item>
            </Flex>
        </Provider>
    );
};
