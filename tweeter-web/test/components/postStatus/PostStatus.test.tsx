import React from "react";
import { MemoryRouter } from "react-router-dom";
import PostStatus from "../../../src/components/postStatus/PostStatus"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom"
import { PostStatusPresenter } from "../../../src/presenters/PostStatusPresenter";
import { capture, instance, mock, verify } from "@typestrong/ts-mockito"
import useUserInfo from "../../../src/components/userInfo/userInfoHook";
import { AuthToken, User } from "tweeter-shared";


jest.mock("../../../src/components/userInfo/UserInfoHook", () => ({
	...jest.requireActual("../../../src/components/userInfo/UserInfoHook"),
	__esModule: true,
	default: jest.fn(),
}));

describe("PostStatus Component", () => {
	const currentUser = new User("firstname", "lastname", "alias", "" );
	const authToken = new AuthToken("token", Date.now());

	beforeAll(() => {
		(useUserInfo as jest.Mock).mockReturnValue({
			currentUser: currentUser,
			authToken: authToken,
		});
	});

	it("starts with the Post Status and Clear buttons disabled", () => {
		const { postStatusButton, clearButton } = renderLoginAndGetElements();
		expect(postStatusButton).toBeDisabled();
		expect(clearButton).toBeDisabled();
	});

	it("enables both buttons when the text field has text", async () => {
		const { postStatusButton, clearButton, textArea, user } = renderLoginAndGetElements();

		await user.type(textArea, "a");

		expect(postStatusButton).toBeEnabled();
		expect(clearButton).toBeEnabled();
	});
	
	it("disables both buttons when the text field is cleared", async () => {
		const { postStatusButton, clearButton, textArea, user } = renderLoginAndGetElements();
		
		await user.type(textArea, "a");
		expect(postStatusButton).toBeEnabled();
		expect(clearButton).toBeEnabled();

		await user.clear(textArea);
		expect(postStatusButton).toBeDisabled();
		expect(clearButton).toBeDisabled();
	});

	it("calls the presenter's submitPost method with correct parameters when the Post Status button is pressed", async () => {
		const mockPresenter = mock<PostStatusPresenter>();
		const mockPresenterInstance = instance(mockPresenter);

		const { postStatusButton, textArea, user } =
			renderLoginAndGetElements(mockPresenterInstance);

		const post = "a";

		await user.type(textArea, post);
		await user.click(postStatusButton);

		verify(mockPresenter.submitPost(authToken, post, currentUser)).once();
	});
});

const renderPostStatus = (presenter?: PostStatusPresenter) => {
	return render(
		<MemoryRouter>
			{!!presenter
				? (<PostStatus presenter={presenter} />)
				: (<PostStatus />)
			}
		</MemoryRouter>
	);
}

const renderLoginAndGetElements = (presenter?: PostStatusPresenter) => {
	const user = userEvent.setup();

	renderPostStatus(presenter);

	const postStatusButton = screen.getByRole("button", { name: /Post Status/i });
	const clearButton = screen.getByRole("button", { name: /Clear/i });
	const textArea = screen.getByTestId("postStatusTextArea");

	return { postStatusButton, clearButton, textArea, user }
}