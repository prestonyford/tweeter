import { PagedStatusItemRequest, PagedStatusItemResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { DynamoDBDAOFactory } from "../../model/dao/dynamodb/DynamoDBDAOFactory";
import { doLambdaOperation } from "../LambdaHelper";

export const handler = async (request: PagedStatusItemRequest) => {
	return await doLambdaOperation<PagedStatusItemResponse>(async () => {
		const statusService = new StatusService(new DynamoDBDAOFactory());
		const [items, hasMore] = await statusService.loadMoreStoryItems(
			request.token,
			request.userAlias,
			request.pageSize,
			request.lastItem
		);

		return {
			success: true,
			message: null,
			items,
			hasMore
		}
	});
}