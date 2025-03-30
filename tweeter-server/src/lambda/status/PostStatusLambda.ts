import { PostStatusRequest, TweeterResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { DynamoDBDAOFactory } from "../../model/dao/dynamodb/DynamoDBDAOFactory";

export const handler = async (request: PostStatusRequest): Promise<TweeterResponse> => {
	const statusService = new StatusService(new DynamoDBDAOFactory());
	await statusService.postStatus(
		request.token,
		request.newStatus
	);

	return {
		success: true,
		message: null
	}
}