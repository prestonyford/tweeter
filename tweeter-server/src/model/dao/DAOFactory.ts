import { AuthDAO } from "./AuthDAO";
import { FeedDAO } from "./FeedDAO";
import { FollowDAO } from "./FollowDAO";
import { StoryDAO } from "./StoryDAO";
import { UserDAO } from "./UserDAO";

export interface DAOFactory {
	getAuthDAO(): AuthDAO
	getFeedDAO(): FeedDAO
	getFollowDAO(): FollowDAO
	getStoryDAO(): StoryDAO
	getUserDAO(): UserDAO
}
