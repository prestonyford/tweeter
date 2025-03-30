import { FollowerStatusRequest, FollowerStatusResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { DynamoDBDAOFactory } from "../../model/dao/dynamodb/DynamoDBDAOFactory";

export const handler = async (request: FollowerStatusRequest): Promise<FollowerStatusResponse> => {
	const followService = new FollowService(new DynamoDBDAOFactory());
	const status = await followService.getIsFollowerStatus(
		request.token,
		request.user,
		request.selectedUser
	);

	return {
		success: true,
		message: null,
		status
	}
}