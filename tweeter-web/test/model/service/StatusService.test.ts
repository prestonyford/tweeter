import { AuthToken, FollowCountRequest, PagedUserItemRequest, RegisterRequest, Status, User } from "tweeter-shared";
import { StatusService } from "../../../src/model/service/StatusService";

describe("StatusService", () => {
	let statusService: StatusService;
	const authToken = new AuthToken("abc123", Date.now());

	beforeEach(() => {
		statusService = new StatusService();
	});

	test("postStatus", async () => {
		await expect(statusService.postStatus(authToken, new Status(
			"post",
			new User("firstName", "lastName", "alias", "imageUrl"),
			123
		))).resolves.not.toThrow();
	});

	test("loadMoreFeedItems", async () => {
		await testLoadItems(statusService.loadMoreFeedItems.bind(statusService));
	});

	
	test("loadMoreStoryItems", async () => {
		await testLoadItems(statusService.loadMoreStoryItems.bind(statusService));
	});

	async function testLoadItems(loadItemsFn: (authToken: AuthToken, alias: string, pageSize: number, lastItem: Status) => Promise<[Status[], boolean]>) {
		const pageSize = 5;
		const [items, hasMore] = await loadItemsFn(authToken, "alias", pageSize, new Status(
			"post",
			new User("firstName", "lastName", "alias", "imageUrl"),
			123
		));

		expect(items.length).toBe(pageSize);
		expect(hasMore).toBe(true);
	}
});