import { PostStatusRequest, TweeterResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { DynamoDBDAOFactory } from "../../model/dao/dynamodb/DynamoDBDAOFactory";
import { doLambdaOperation } from "../LambdaHelper";

export const handler = async (request: PostStatusRequest) => {
	return await doLambdaOperation<TweeterResponse>(async () => {
		const statusService = new StatusService(new DynamoDBDAOFactory());
		await statusService.postStatus(
			request.token,
			request.newStatus
		);

		return {
			success: true,
			message: null
		}
	});
}