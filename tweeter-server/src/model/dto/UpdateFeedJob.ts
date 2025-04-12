import { PostDTO } from "./PostDTO";

export interface UpdateFeedJob {
	post: PostDTO,
	usersToUpdateFeed: string[]
}
