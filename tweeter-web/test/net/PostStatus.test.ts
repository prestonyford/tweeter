import { LoginRequest } from "tweeter-shared";
import { ServerFacade } from "../../src/net/ServerFacade";
import { anything, instance, mock, spy, verify, when } from "@typestrong/ts-mockito"
import { PostStatusView, PostStatusPresenter } from "../../src/presenters/PostStatusPresenter";

describe("ServerFacade", () => {
	let serverFacade: ServerFacade;

	beforeEach(() => {
		serverFacade = new ServerFacade();
	});

	test("when a user sends a status, the status is correctly appended to the user's story", async () => {
		const request: LoginRequest = {
			alias: "prestonyford",
			password: "pass"
		};
		const [user, authToken] = await serverFacade.login(request);

		const mockView = mock<PostStatusView>();
		const mockViewInstance = instance(mockView);

		const presenter = new PostStatusPresenter(mockViewInstance);

		const post = `TestPost-${Date.now()}`;
		await presenter.submitPost(authToken, post, user);

		verify(mockView.displayInfoMessage("Status posted!", anything())).once();

		const [story, hasMore] = await serverFacade.loadMoreStoryItems({
			token: authToken.token,
			userAlias: "prestonyford",
			pageSize: 10,
			lastItem: null
		});

		expect(story.map(status => status.post)).toContain(post);

	}, 15000);
});