import { AuthToken, Status, User } from "tweeter-shared";
import { PostStatusPresenter, PostStatusView } from "../../src/presenters/PostStatusPresenter"
import { anything, capture, instance, mock, spy, verify, when } from "@typestrong/ts-mockito"
import { StatusService } from "../../src/model/service/StatusService";

describe("PostStatusPresenter", () => {
	let mockPostStatusView: PostStatusView;
	let postStatusPresenter: PostStatusPresenter;
	let mockStatusService: StatusService;

	const authToken = new AuthToken("abc123", Date.now());
	const user = new User("firstName", "lastName", "alias", "");

	beforeEach(() => {
		mockPostStatusView = mock<PostStatusView>();
		const mockPostStatusViewInstance = instance(mockPostStatusView);

		const postStatusPresenterSpy = spy(new PostStatusPresenter(mockPostStatusViewInstance));
		postStatusPresenter = instance(postStatusPresenterSpy);

		mockStatusService = mock<StatusService>();
		const mockStatusServiceInstance = instance(mockStatusService);

		when(postStatusPresenterSpy.statusService).thenReturn(mockStatusServiceInstance);
	});

	it("tells the view to display a posting status message", async () => {
		await postStatusPresenter.submitPost(authToken, "post", user);
		verify(mockPostStatusView.displayInfoMessage("Posting status...", 0)).once();
	});

	it("calls postStatus on the post status service with the correct status string and auth token", async () => {
		await postStatusPresenter.submitPost(authToken, "post", user);

		const [capturedAuthToken, capturedStatus] = capture(mockStatusService.postStatus).last();
        expect(capturedAuthToken).toEqual(authToken);
        expect(capturedStatus.post).toEqual("post");
	});
	
	it("tells the view to clear the last info message, clear the post, and display a status posted message when post is successful", async () => {
		await postStatusPresenter.submitPost(authToken, "post", user);

		verify(mockPostStatusView.clearLastInfoMessage()).once();
		verify(mockPostStatusView.setPost("")).once();
		verify(mockPostStatusView.displayInfoMessage("Status posted!", anything())).once();
		
		verify(mockPostStatusView.displayErrorMessage(anything())).never();
	});
	
	it("tells the view to display an error message and clear the last info message and does not tell it to clear the post or display a status posted message when post fails", async () => {
		const error = new Error("An error occurred");
		when(mockStatusService.postStatus(anything(), anything())).thenThrow(error);

		await postStatusPresenter.submitPost(authToken, "post", user);

		verify(mockPostStatusView.displayErrorMessage("Failed to post the status because of exception: An error occurred")).once();
		verify(mockPostStatusView.clearLastInfoMessage()).once();

		verify(mockPostStatusView.setPost("")).never();
		verify(mockPostStatusView.displayInfoMessage("Status posted!", anything())).never();
	});
});