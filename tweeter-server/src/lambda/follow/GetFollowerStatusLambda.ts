import { FollowerStatusRequest, FollowerStatusResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { DynamoDBDAOFactory } from "../../model/dao/dynamodb/DynamoDBDAOFactory";
import { doLambdaOperation } from "../LambdaHelper";

export const handler = async (request: FollowerStatusRequest) => {
	return await doLambdaOperation<FollowerStatusResponse>(async () => {
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
	});
}