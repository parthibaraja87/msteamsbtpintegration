import { PreventIframe } from "express-msteams-host";

/**
 * Used as place holder for the decorators
 */
@PreventIframe("/btpApprovalTab/index.html")
@PreventIframe("/btpApprovalTab/config.html")
@PreventIframe("/btpApprovalTab/remove.html")
export class BtpApprovalTab {
}
