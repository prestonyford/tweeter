import { AuthDAO } from "../AuthDAO";
import { DAOFactory } from "../DAOFactory";
import { FeedDAO } from "../FeedDAO";
import { FollowDAO } from "../FollowDAO";
import { StoryDAO } from "../StoryDAO";
import { UserDAO } from "../UserDAO";
import { AuthDynamoDBDAO } from "./AuthDynamoDBDAO";
import { FeedDynamoDBDAO } from "./FeedDynamoDBDAO";
import { FollowDynamoDBDAO } from "./FollowDynamoDBDAO";
import { StoryDynamoDBDAO } from "./StoryDynamoDBDAO";
import { UserDynamoDBDAO } from "./UserDynamoDBDAO";

export class DynamoDBDAOFactory implements DAOFactory {
	getAuthDAO(): AuthDAO {
		return new AuthDynamoDBDAO();
	}
	getFeedDAO(): FeedDAO {
		return new FeedDynamoDBDAO();
	}
	getFollowDAO(): FollowDAO {
		return new FollowDynamoDBDAO();
	}
	getStoryDAO(): StoryDAO {
		return new StoryDynamoDBDAO();
	}
	getUserDAO(): UserDAO {
		return new UserDynamoDBDAO();
	}	
}
