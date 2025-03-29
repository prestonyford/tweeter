import { AuthDAO } from "./model/dao/AuthDAO";
import { AuthDynamoDBDAO } from "./model/dao/dynamodb/AuthDynamoDBDAO";
import { FeedDynamoDBDAO } from "./model/dao/dynamodb/FeedDynamoDBDAO";
import { FollowDynamoDBDAO } from "./model/dao/dynamodb/FollowDynamoDBDAO";
import { StoryDynamoDBDAO } from "./model/dao/dynamodb/StoryDynamoDBDAO";
import { UserDynamoDBDAO } from "./model/dao/dynamodb/UserDynamoDBDAO";
import { FeedDAO } from "./model/dao/FeedDAO";
import { FollowDAO } from "./model/dao/FollowDAO";
import { StoryDAO } from "./model/dao/StoryDAO";
import { UserDAO } from "./model/dao/UserDAO";

async function auths() {
	const authsDAO: AuthDAO = new AuthDynamoDBDAO();
	await authsDAO.putToken("testAlias", "testToken");

	const token = await authsDAO.getToken("testAlias");
	console.log(token);
}

async function users() {
	const userDAO: UserDAO = new UserDynamoDBDAO();
	await userDAO.putUser({
		firstName: "testFirstname",
		lastName: "testLastname",
		alias: "testAlias",
		imageUrl: "testImageUrl",
	});

	const user = await userDAO.getUser("testAlias");
	console.log(user);
}

async function follows() {
	const followDAO: FollowDAO = new FollowDynamoDBDAO();
	await followDAO.addFollow("testFollowerAlias", "testFolloweeAlias");
	await followDAO.addFollow("testFollowerAlias", "testFolloweeAlias2");

	const followeeCount = await followDAO.getFolloweeCount("testFollowerAlias");
	console.log(followeeCount);

	const [followees, hasMore] = await followDAO.getFollowees("testFollowerAlias", 5, null);
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

async function main() {
	feed();
}

main();