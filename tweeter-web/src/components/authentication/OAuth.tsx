import useToastListener from "../toaster/ToastListenerHook";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { OverlayTrigger, Tooltip } from "react-bootstrap"
import { OAuthPresenter, OAuthView } from "../../presenters/OAuthPresenter";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


const OAuth = () => {
    const { displayInfoMessage } = useToastListener();

    const listener: OAuthView = {
        displayInfoMessage,
        navigate: useNavigate(),
        clearLastInfoMessage: function (): void {
            throw new Error("Function not implemented.");
        },
        displayErrorMessage: function (message: string): void {
            throw new Error("Function not implemented.");
        }
    }

    const [presenter] = useState(new OAuthPresenter(listener));

    return (
        <div className="text-center mb-3">
            <button
                type="button"
                className="btn btn-link btn-floating mx-1"
                onClick={() =>
                    presenter.displayInfoMessageWithDarkBackground(
                        "Google registration is not implemented."
                    )
                }
            >
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="googleTooltip">Google</Tooltip>}
                >
                    <FontAwesomeIcon icon={["fab", "google"]} />
                </OverlayTrigger>
            </button>

            <button
                type="button"
                className="btn btn-link btn-floating mx-1"
                onClick={() =>
                    presenter.displayInfoMessageWithDarkBackground(
                        "Facebook registration is not implemented."
                    )
                }
            >
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="facebookTooltip">Facebook</Tooltip>}
                >
                    <FontAwesomeIcon icon={["fab", "facebook"]} />
                </OverlayTrigger>
            </button>

            <button
                type="button"
                className="btn btn-link btn-floating mx-1"
                onClick={() =>
                    presenter.displayInfoMessageWithDarkBackground(
                        "Twitter registration is not implemented."
                    )
                }
            >
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="twitterTooltip">Twitter</Tooltip>}
                >
                    <FontAwesomeIcon icon={["fab", "twitter"]} />
                </OverlayTrigger>
            </button>

            <button
                type="button"
                className="btn btn-link btn-floating mx-1"
                onClick={() =>
                    presenter.displayInfoMessageWithDarkBackground(
                        "LinkedIn registration is not implemented."
                    )
                }
            >
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="linkedInTooltip">LinkedIn</Tooltip>}
                >
                    <FontAwesomeIcon icon={["fab", "linkedin"]} />
                </OverlayTrigger>
            </button>

            <button
                type="button"
                className="btn btn-link btn-floating mx-1"
                onClick={() =>
                    presenter.displayInfoMessageWithDarkBackground(
                        "Github registration is not implemented."
                    )
                }
            >
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="githubTooltip">GitHub</Tooltip>}
                >
                    <FontAwesomeIcon icon={["fab", "github"]} />
                </OverlayTrigger>
            </button>
        </div>
    )
}

export default OAuth;
