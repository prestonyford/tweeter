import { FollowCountRequest, FollowCountResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { DynamoDBDAOFactory } from "../../model/dao/dynamodb/DynamoDBDAOFactory";

export const handler = async (request: FollowCountRequest): Promise<FollowCountResponse> => {
	const followService = new FollowService(new DynamoDBDAOFactory());
	const count = await followService.getFollowerCount(
		request.token,
		request.user
	);

	return {
		success: true,
		message: null,
		count
	}
}