import { PagedStatusItemRequest, PagedStatusItemResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { DynamoDBDAOFactory } from "../../model/dao/dynamodb/DynamoDBDAOFactory";

export const handler = async (request: PagedStatusItemRequest): Promise<PagedStatusItemResponse> => {
	const statusService = new StatusService(new DynamoDBDAOFactory());
	const [items, hasMore] = await statusService.loadMoreFeedItems(
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
}