import { TweeterResponse, UnfollowRequest } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { DynamoDBDAOFactory } from "../../model/dao/dynamodb/DynamoDBDAOFactory";
import { doLambdaOperation } from "../LambdaHelper";

export const handler = async (request: UnfollowRequest) => {
	return await doLambdaOperation<TweeterResponse>(async () => {
		const followService = new FollowService(new DynamoDBDAOFactory());
		await followService.unfollow(
			request.token,
			request.userToUnfollow
		);

		return {
			success: true,
			message: null
		}
	});
}