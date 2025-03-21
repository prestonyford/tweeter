import { AuthToken, FollowCountRequest, PagedUserItemRequest, RegisterRequest } from "tweeter-shared";
import { ServerFacade } from "../../src/net/ServerFacade";

describe("ServerFacade", () => {
	let serverFacade: ServerFacade;

	const authToken = new AuthToken("abc123", Date.now());

	beforeEach(() => {
		serverFacade = new ServerFacade();
	});

	test("register", async () => {
		const request: RegisterRequest = {
			firstName: "firstName",
			lastName: "lastName",
			alias: "alias",
			password: "password",
			imageStringBase64: "image",
			imageFileExtension: "png"
		};
		const [user, authToken] = await serverFacade.register(request);
		expect(typeof user.firstName).toBe("string");
		expect(typeof user.lastName).toBe("string");
		expect(typeof user.alias).toBe("string");
		expect(typeof user.imageUrl).toBe("string");
		expect(typeof authToken.token).toBe("string");
		expect(typeof authToken.timestamp).toBe("number");
	});
	
	test("getMoreFollowers", async () => {
		const request: PagedUserItemRequest = {
			token: "token",
			userAlias: "lastName",
			pageSize: 5,
			lastItem: {
				firstName: "firstName",
				lastName: "lastName",
				alias: "alias",
				imageUrl: "url"
			}
		};
		const [users, hasMore] = await serverFacade.getMoreFollowers(request);
		expect(users.length).toBe(request.pageSize);
		expect(hasMore).toBe(true);
	});
	
	test("getFollowerCount", async () => {
		const request: FollowCountRequest = {
			token: "token",
			user: {
				firstName: "firstName",
				lastName: "lastName",
				alias: "alias",
				imageUrl: "url"
			}
		};
		const count = await serverFacade.getFollowerCount(request);
		expect(count).toBeGreaterThanOrEqual(0);
	});
});