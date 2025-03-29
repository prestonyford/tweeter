import { StatusDTO } from "tweeter-shared";
import { PostDTO } from "../dto/PostDTO";

export interface StoryDAO {
	getStory(userAlias: string, pageSize: number, lastItemTimestamp: number | null): Promise<[PostDTO[], boolean]>

	addStory(post: PostDTO): Promise<void>
}