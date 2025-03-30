import { FollowRequest, TweeterResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { DynamoDBDAOFactory } from "../../model/dao/dynamodb/DynamoDBDAOFactory";

export const handler = async (request: FollowRequest): Promise<TweeterResponse> => {
	const followService = new FollowService(new DynamoDBDAOFactory());
	await followService.follow(
		request.token,
		request.userToFollow
	);

	return {
		success: true,
		message: null
	}
}