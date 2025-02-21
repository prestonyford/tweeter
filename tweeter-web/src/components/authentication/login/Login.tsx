import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import useToastListener from "../../toaster/ToastListenerHook";
import AuthenticationFields from "../AuthenticationFields";
import useUserInfo from "../../userInfo/userInfoHook";
import { LoginPresenter, LoginView } from "../../../presenters/LoginPresenter";

interface Props {
	originalUrl?: string;
}

const Login = (props: Props) => {
	// alias and password must be state in the view instead of
	// members in the presenter because they must be reactive.
	const [alias, setAlias] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const navigate = useNavigate();
	const { updateUserInfo } = useUserInfo();
	const { displayErrorMessage } = useToastListener();

	const listener: LoginView = {
		updateUserInfo,
		displayErrorMessage,
		setLoadingState: setIsLoading,
		navigate,
		clearUserInfo: function (): void {
			throw new Error("Function not implemented.");
		}
	};

	const [presenter] = useState(new LoginPresenter(listener));

	
	const doLogin = async () => {
		presenter.login(alias, password, props.originalUrl);
	}

	const loginOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
		presenter.loginOnEnter(event, alias, password, props.originalUrl);
	};

	const setRememberMe = (value: boolean) => {
		presenter.rememberMe = value;
	}

	const checkSubmitButtonStatus = () => {
		return presenter.checkSubmitButtonStatus(alias, password);
	}

	const inputFieldGenerator = () => {
		return (
			<div className="mb-3">
				<AuthenticationFields
					onEnter={loginOnEnter}
					onAliasChange={(event) => setAlias(event.target.value)}
					onPasswordChange={(event) => setPassword(event.target.value)}
				/>
			</div>
		);
	};

	const switchAuthenticationMethodGenerator = () => {
		return (
			<div className="mb-3">
				Not registered? <Link to="/register">Register</Link>
			</div>
		);
	};

	return (
		<AuthenticationFormLayout
			headingText="Please Sign In"
			submitButtonLabel="Sign in"
			oAuthHeading="Sign in with:"
			inputFieldGenerator={inputFieldGenerator}
			switchAuthenticationMethodGenerator={switchAuthenticationMethodGenerator}
			setRememberMe={setRememberMe}
			submitButtonDisabled={checkSubmitButtonStatus}
			isLoading={isLoading}
			submit={doLogin}
		/>
	);
};

export default Login;
