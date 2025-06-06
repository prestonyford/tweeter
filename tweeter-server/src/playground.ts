import { handler as getFollowersHandler } from "./lambda/follow/GetFollowersLambda";
import { handler as postStatusHandler } from "./lambda/status/PostStatusLambda";
import { handler as postUpdateFeedMessagesHandler } from "./lambda/status/PostUpdateFeedMessagesLambda";
import { AuthDAO } from "./model/dao/AuthDAO";
import { AuthDynamoDBDAO } from "./model/dao/dynamodb/AuthDynamoDBDAO";
import { DynamoDBDAOFactory } from "./model/dao/dynamodb/DynamoDBDAOFactory";
import { FeedDynamoDBDAO } from "./model/dao/dynamodb/FeedDynamoDBDAO";
import { FollowDynamoDBDAO } from "./model/dao/dynamodb/FollowDynamoDBDAO";
import { StoryDynamoDBDAO } from "./model/dao/dynamodb/StoryDynamoDBDAO";
import { UserDynamoDBDAO } from "./model/dao/dynamodb/UserDynamoDBDAO";
import { FeedDAO } from "./model/dao/FeedDAO";
import { FollowDAO } from "./model/dao/FollowDAO";
import { StoryDAO } from "./model/dao/StoryDAO";
import { UserDAO } from "./model/dao/UserDAO";
import { FollowService } from "./model/service/FollowService";
import { StatusService } from "./model/service/StatusService";

async function auths() {
	const authsDAO: AuthDAO = new AuthDynamoDBDAO();
	await authsDAO.putAuth({ token: "testToken", timestamp: 1 }, "testUser");

	let [alias, timestamp] = await authsDAO.getAuth("testToken") ?? [null, null];
	console.log([alias, timestamp]);

	await authsDAO.renewAuth("testToken", 5);
	[alias, timestamp] = await authsDAO.getAuth("testToken") ?? [null, null];
	console.log([alias, timestamp]);

	await authsDAO.deleteAuth("testToken");
	[alias, timestamp] = await authsDAO.getAuth("testToken") ?? [null, null];
	console.log([alias, timestamp]);
}

async function users() {
	const userDAO: UserDAO = new UserDynamoDBDAO();
	await userDAO.putUser({
		firstName: "testFirstname",
		lastName: "testLastname",
		alias: "testAlias",
		imageUrl: "testImageUrl",
	}, "passwordHashTest");

	const user = await userDAO.getUserInfo("testAlias");
	console.log(user);
}

async function follows() {
	const followDAO: FollowDAO = new FollowDynamoDBDAO();
	await followDAO.addFollow("testFollowerAlias", "testFolloweeAlias");
	await followDAO.addFollow("testFollowerAlias", "testFolloweeAlias2");

	const followerCount = await followDAO.getFollowerCount("testFollowerAlias");
	console.log(followerCount);

	const [followers, hasMore] = await followDAO.getFollowers("testFollowerAlias", 5, null);
	console.log(followers);

	const [followees, _] = await followDAO.getFollowees("testFolloweeAlias", 5, null);
	console.log(followees);
}

async function story() {
	const storyDAO: StoryDAO = new StoryDynamoDBDAO();
	await storyDAO.addStory({
		senderAlias: "testUser",
		post: "testPost",
		timestamp: 1
	});
	await storyDAO.addStory({
		senderAlias: "testUser",
		post: "testPost2",
		timestamp: 2
	});
	await storyDAO.addStory({
		senderAlias: "testUser",
		post: "testPost3",
		timestamp: 3
	});
	await storyDAO.addStory({
		senderAlias: "testUser",
		post: "testPost4",
		timestamp: 4
	});

	const [stories, hasMore] = await storyDAO.getStory("testUser", 2, null);
	console.log([stories, hasMore]);

	const lastItem = stories.at(-1)?.timestamp ?? null;
	const [moreStories, moreHasMore] = await storyDAO.getStory("testUser", 2, lastItem);
	console.log([moreStories, moreHasMore]);
}

async function feed() {
	const feedDAO: FeedDAO = new FeedDynamoDBDAO();
	await feedDAO.addFeed("testUser", {
		senderAlias: "testSender",
		post: "testPost",
		timestamp: 1
	});
	await feedDAO.addFeed("testUser", {
		senderAlias: "testSender2",
		post: "testPost2",
		timestamp: 2
	});
	await feedDAO.addFeed("testUser", {
		senderAlias: "testSender",
		post: "testPost3",
		timestamp: 2
	});
	await feedDAO.addFeed("testUser", {
		senderAlias: "testSender2",
		post: "testPost4",
		timestamp: 3
	});

	const [stories, hasMore] = await feedDAO.getFeed("testUser", 2, null);
	console.log([stories, hasMore]);

	const lastItem = stories.at(-1) ?? null;
	const [moreStories, moreHasMore] = await feedDAO.getFeed("testUser", 2, lastItem);
	console.log([moreStories, moreHasMore]);
}

async function statusService() {
	const statusService = new StatusService(new DynamoDBDAOFactory());

	await statusService.postStatus("bb809927-3134-474e-a926-565b76312426", {
		post: "test post text",
		timestamp: 1,
		user: {
			firstName: "TestUserFirstname",
			lastName: "TestUserLastname",
			alias: "TestUserAlias",
			imageUrl: "TestUserImageUrl"
		}
	});
}

async function followService() {
	const followService = new FollowService(new DynamoDBDAOFactory());

	const result = await followService.loadMoreFollowees("4aebc0bb-db8f-492c-bc96-1a4a525d599b", "b", 5, null);
	console.log(result);

	const followsDAO = new FollowDynamoDBDAO();
	const res2 = await followsDAO.getFollowees("b", 5, null);
	console.log(res2);
}

async function getFollowersLambda() {
	const result = await getFollowersHandler({
		token: "3cd2ab39-714c-4eaf-9f61-b7c0985abb84",
		userAlias: "prestonyford",
		pageSize: 5,
		lastItem: null
	});

	console.log(result);
}

async function updateFeed() {
	const followsDAO = new FollowDynamoDBDAO();
	const statusService = new StatusService(new DynamoDBDAOFactory());

	followsDAO.addFollow("test_user", "test_followee");

	statusService.postStatus("001", {
		post: "test post",
		timestamp: 1,
		user: {
			firstName: "TestUserFirstname",
			lastName: "TestUserLastname",
			alias: "TestUserAlias",
			imageUrl: "TestUserImageUrl"
		}
	})
}

async function postStatusLambda() {
	postStatusHandler({
		token: "d7287d6d-9696-4a9c-9f4c-477633ef499e",
		newStatus: {
			post: "test post 2",
			timestamp: Date.now(),
			user: {
				firstName: "Preston",
				lastName: "Ford",
				alias: "prestonyford",
				imageUrl: "https://pyford340bucket.s3.us-east-1.amazonaws.com/image/prestonyford-profile.jpg"
			}
		}
	});
}

async function postUpdateFeedMessagesLambda() {
	const event = {
		Records: [
			{
				body: JSON.stringify({
					token: "eb4bd72a-8f5d-4bb5-95ed-4d8d28bc6a67",
					newStatus: {
						user: {
							alias: "daisy",
						},
						post: "Hello, world 2!",
						timestamp: Date.now(),
					},
				})
			}
		],
	}

	await postUpdateFeedMessagesHandler(event)

}

async function main() {
	await postUpdateFeedMessagesLambda();
}

main();


/*

CHECKLIST
feed 50 RCU
feed 100 WCU
follows 100 RCU
lambda triggers

*/