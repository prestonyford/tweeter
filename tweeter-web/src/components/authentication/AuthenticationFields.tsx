import { ChangeEventHandler, KeyboardEventHandler } from "react";

interface Props {
	onEnter: KeyboardEventHandler<HTMLInputElement>,
	onAliasChange: ChangeEventHandler<HTMLInputElement>,
	onPasswordChange: ChangeEventHandler<HTMLInputElement>
}

const AuthenticationFields = (props: Props) => {
	return (
		<>
			<div className="form-floating">
				<input
					type="text"
					className="form-control"
					size={50}
					id="aliasInput"
					aria-label="alias"
					placeholder="name@example.com"
					onKeyDown={props.onEnter}
					onChange={props.onAliasChange}
				/>
				<label htmlFor="aliasInput">Alias</label>
			</div>
			<div className="form-floating">
				<input
					type="password"
					className="form-control"
					id="passwordInput"
					aria-label="password"
					placeholder="Password"
					onKeyDown={props.onEnter}
					onChange={props.onPasswordChange}
				/>
				<label htmlFor="passwordInput">Password</label>
			</div>
		</>
	)
};

export default AuthenticationFields;
