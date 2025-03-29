import { PostDTO } from "../dto/PostDTO";

export interface FeedDAO {
	/**
	 * 
	 * @param userAlias The alias of the user whose feed should be queried.
	 * @param pageSize The limit on the number of items to be returned.
	 * @param lastItem The last item on the previous page queried, if applicable, or null.
	 */
	getFeed(userAlias: string, pageSize: number, lastItem: { timestamp: number, senderAlias: string } | null): Promise<[PostDTO[], boolean]>

	/**
	 * 
	 * @param userAlias The alias of the user whose feed is being updated.
	 * @param senderAlias The alias of the user who is sending `post`.
	 * @param post The post. `post.senderAlias` is the alias of the user who sent `post`.
	 */
	addFeed(userAlias: string, post: PostDTO): Promise<void>
}