import { Status, FakeData, StatusDTO } from "tweeter-shared";
import { Service } from "./Service";
import { DAOFactory } from "../dao/DAOFactory";
import { StoryDAO } from "../dao/StoryDAO";
import { FeedDAO } from "../dao/FeedDAO";
import { FollowDAO } from "../dao/FollowDAO";
import { UserDAO } from "../dao/UserDAO";
import { ServiceException } from "./exception/ServiceException";
import { PostDTO } from "../dto/PostDTO";
import { UpdateFeedJob } from "../dto/UpdateFeedJob";

export class StatusService extends Service {
	private readonly storyDAO: StoryDAO;
	private readonly feedDAO: FeedDAO;
	private readonly followDAO: FollowDAO;
	private readonly userDAO: UserDAO;

	public constructor(daoFactory: DAOFactory) {
		super(daoFactory);
		this.storyDAO = daoFactory.getStoryDAO();
		this.feedDAO = daoFactory.getFeedDAO();
		this.followDAO = daoFactory.getFollowDAO();
		this.userDAO = daoFactory.getUserDAO();
	}
	
	public async postStatus(
		token: string,
		newStatus: StatusDTO
	): Promise<void> {
		await this.checkAuthorizedAndRenew(token);
		const alias = await this.getUserAlias(token);

		this.storyDAO.addStory({
			senderAlias: alias,
			post: newStatus.post,
			timestamp: newStatus.timestamp
		});

		let lastItemAlias = null;
		let hasMore = true;
		const followers = []
		do {
			let page;
			[page, hasMore] = await this.followDAO.getFollowers(alias, 1000, lastItemAlias);
			lastItemAlias = page[page.length - 1];
			followers.push( ...page );
		} while (hasMore);

		await Promise.all(followers.map(follower => this.feedDAO.addFeed(follower, {
			senderAlias: alias,
			post: newStatus.post,
			timestamp: newStatus.timestamp
		})));
	};

	public async loadMoreFeedItems (
		token: string,
		userAlias: string,
		pageSize: number,
		lastItem: StatusDTO | null
	): Promise<[StatusDTO[], boolean]> {
		await this.checkAuthorizedAndRenew(token);

		const [posts, hasMore] = await this.feedDAO.getFeed(
			userAlias,
			pageSize,
			lastItem == null ? null : { timestamp: lastItem.timestamp, senderAlias: lastItem.user.alias }
		);

		const feed: StatusDTO[] = await Promise.all(posts.map(async post => {
			const userDTO = await this.userDAO.getUserInfo(post.senderAlias);
			return {
				post: post.post,
				user: userDTO!, // Handle case where user is not found?
				timestamp: post.timestamp
			};
		}));

		return [feed, hasMore];
	};

	public async loadMoreStoryItems (
		token: string,
		userAlias: string,
		pageSize: number,
		lastItem: StatusDTO | null
	): Promise<[StatusDTO[], boolean]> {
		await this.checkAuthorizedAndRenew(token);

		const [posts, hasMore] = await this.storyDAO.getStory(
			userAlias,
			pageSize,
			lastItem?.timestamp ?? null
		);

		const user = await this.userDAO.getUserInfo(userAlias);
		if (!user) {
			throw new ServiceException(500, "Error while obtaining feed");
		}

		const feed: StatusDTO[] = posts.map(post => ({
			post: post.post,
			user: user,
			timestamp: post.timestamp
		}));

		return [feed, hasMore];
	};

	public async addToStory(
		token: string,
		newStatus: StatusDTO
	) {
		await this.checkAuthorizedAndRenew(token);
		const alias = await this.getUserAlias(token);

		this.storyDAO.addStory({
			senderAlias: alias,
			post: newStatus.post,
			timestamp: newStatus.timestamp
		});

	}
	
	public async addToFeed(
		userAlias: string,
		newPost: PostDTO
	) {
		await this.feedDAO.addFeed(userAlias, newPost);
	}

	public async batchWriteFeeds(job: UpdateFeedJob) {
		await this.feedDAO.batchWriteFeeds(job);
	}
}