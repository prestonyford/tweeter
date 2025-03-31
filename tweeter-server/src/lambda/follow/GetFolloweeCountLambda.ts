import { FollowCountRequest, FollowCountResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { DynamoDBDAOFactory } from "../../model/dao/dynamodb/DynamoDBDAOFactory";
import { doLambdaOperation } from "../LambdaHelper";

export const handler = async (request: FollowCountRequest) => {
	return await doLambdaOperation<FollowCountResponse>(async () => {
		const followService = new FollowService(new DynamoDBDAOFactory());
		const count = await followService.getFolloweeCount(
			request.token,
			request.user
		);

		return {
			success: true,
			message: null,
			count
		}
	});
}