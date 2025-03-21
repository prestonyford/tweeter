import { AuthToken, Status, User } from "tweeter-shared";
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
		await testLoadItems(statusService.loadMoreFeedItems);
	});

	
	test("loadMoreStoryItems", async () => {
		await testLoadItems(statusService.loadMoreStoryItems);
	});

	async function testLoadItems(loadItemsFn: (authToken: AuthToken, alias: string, pageSize: number, lastItem: Status) => Promise<[Status[], boolean]>) {
		const pageSize = 5;
		const [items, hasMore] = await loadItemsFn.bind(statusService)(authToken, "alias", pageSize, new Status(
			"post",
			new User("firstName", "lastName", "alias", "imageUrl"),
			123
		));

		expect(items.length).toBe(pageSize);
		expect(hasMore).toBe(true);
	}
});