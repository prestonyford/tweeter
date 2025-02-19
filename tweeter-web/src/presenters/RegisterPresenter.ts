import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { ChangeEvent } from "react";
import { Buffer } from "buffer";
import { Presenter, View } from "./Presenter";

export interface RegisterView extends View {
	updateUserInfo: (currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean) => void;
	setLoadingState: (isLoading: boolean) => void;
	navigate: (path: string) => void;
	setImageUrl: (url: string) => void;
	setImageFileExtension: (ext: string) => void;
}

export class RegisterPresenter extends Presenter<RegisterView> {
	private userService: UserService;

	private _rememberMe = false;
	private imageBytes = new Uint8Array();

	public constructor(view: RegisterView) {
		super(view);
		this.userService = new UserService;
	}

	private getFileExtension(file: File): string | undefined {
		return file.name.split(".").pop();
	};

	private handleImageFile(file: File | undefined) {
		if (file) {
			this.view.setImageUrl(URL.createObjectURL(file));

			const reader = new FileReader();
			reader.onload = (event: ProgressEvent<FileReader>) => {
				const imageStringBase64 = event.target?.result as string;

				// Remove unnecessary file metadata from the start of the string.
				const imageStringBase64BufferContents =
					imageStringBase64.split("base64,")[1];

				const bytes: Uint8Array = Buffer.from(
					imageStringBase64BufferContents,
					"base64"
				);

				this.imageBytes = new Uint8Array(bytes.buffer as ArrayBuffer);
			};
			reader.readAsDataURL(file);

			// Set image file extension (and move to a separate method)
			const fileExtension = this.getFileExtension(file);
			if (fileExtension) {
				this.view.setImageFileExtension(fileExtension);
			}
		} else {
			this.view.setImageUrl("");
			this.imageBytes = new Uint8Array();
		}
	}

	public async register(
		firstName: string,
		lastName: string,
		alias: string,
		password: string,
		imageFileExtension: string
	) {
		this.doFailureReportingOperation("register user", async () => {
			this.view.setLoadingState(true);

			const [user, authToken] = await this.userService.register(
				firstName,
				lastName,
				alias,
				password,
				this.imageBytes,
				imageFileExtension
			);

			this.view.updateUserInfo(user, user, authToken, this._rememberMe);
			this.view.navigate("/");
		}, () => {
			this.view.setLoadingState(false);
		});
	}

	public async registerOnEnter(
		event: React.KeyboardEvent<HTMLElement>,
		firstName: string,
		lastName: string,
		alias: string,
		password: string,
		imageUrl: string,
		imageFileExtension: string
	) {
		const submitButtonStatus = this.checkSubmitButtonStatus(firstName, lastName, alias, password, imageUrl, imageFileExtension);
		if (event.key == "Enter" && !submitButtonStatus) {
			this.register(firstName, lastName, alias, password, imageFileExtension);
		}
	}

	public checkSubmitButtonStatus(
		firstName: string,
		lastName: string,
		alias: string,
		password: string,
		imageUrl: string,
		imageFileExtension: string
	) {
		return (
			!firstName ||
			!lastName ||
			!alias ||
			!password ||
			!imageUrl ||
			!imageFileExtension
		);
	}

	public handleFileChange(event: ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];
		this.handleImageFile(file);
	}

	public set rememberMe(value: boolean) {
		this._rememberMe = value;
	}
}
