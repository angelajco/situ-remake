import React from "react";
import { sendAuthorizationRequest, sendTokenRequest } from "../actions/sign-in";
import { dispatchLogout } from "../actions/sign-out";
import { isValidSession, getAllSessionParameters, decodeIdToken } from "../actions/session";
import { faUserCircle } from '@fortawesome/free-solid-svg-icons'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

/** @see https://github.com/brionmario/is-samples/tree/master/react-oidc */
class SsoAuthorizationComponent extends React.Component {
    state = {
        idToken: {},
        tokenResponse: {},
        isLoggedIn: false
    };

    componentDidMount() {
        // See if there is a valid session.
        if (isValidSession()) {
            const session = getAllSessionParameters();
            const _tokenResponse = {
                access_token: session.ACCESS_TOKEN,
                refresh_token: session.REFRESH_TOKEN,
                scope: session.SCOPE,
                id_token: session.ID_TOKEN,
                token_type: session.TOKEN_TYPE,
                expires_in: parseInt(session.EXPIRES_IN),
            };
            this.setState({
                tokenResponse: _tokenResponse,
                idToken: decodeIdToken(session.ID_TOKEN),
                isLoggedIn: true
            });
            return;
        }

        // Reads the URL and retrieves the `code` param.
        const code = new URL(window.location.href).searchParams.get("code");

        // If a authorization code exists, sends a token request.
        if (code) {
            sendTokenRequest(code)
                .then(response => {
                    console.log("TOKEN REQUEST SUCCESS", response);
                    this.setState({
                        tokenResponse: response[0],
                        idToken: response[1],
                        isLoggedIn: true
                    })
                })
                .catch((error => {
                    console.log("TOKEN REQUEST ERROR", error);
                    this.setState({ isLoggedIn: false });
                }));
        }
    }

    /**
     * Handles login button click
     */
    handleLoginBtnClick = () => {
        sendAuthorizationRequest();
    };

    /**
     * Handles logout button click
     */
    handleLogoutBtnClick = () => {
        dispatchLogout();
    };


    renderTooltip = (props) => (
        <Tooltip className="tooltip-pass" id="button-tooltip" {...props}>
            <div>
                {this.state.isLoggedIn ? 'Cerrar sesión' : 'Iniciar sesión'}
            </div>
        </Tooltip>
    );

    render() {
        const { isLoggedIn } = this.state;
        return (
            <div className="container home-container">
                <br />
                {
                    isLoggedIn ?
                        <>
                            <a className={this.props.noActive} onClick={this.handleLogoutBtnClick}>
                                <OverlayTrigger placement="right" overlay={this.renderTooltip}>
                                    <FontAwesomeIcon size="3x" icon={faUserCircle} />
                                </OverlayTrigger>
                            </a>
                        </>
                        :
                        <a className={this.props.deshabilitarSesion ? this.props.active : this.props.noActive} onClick={this.handleLoginBtnClick}>
                            <OverlayTrigger placement="right" overlay={this.renderTooltip}>
                                <FontAwesomeIcon size="3x" icon={faUserCircle} />
                            </OverlayTrigger>
                        </a>
                }
            </div>
        )
    }
}

export default SsoAuthorizationComponent;