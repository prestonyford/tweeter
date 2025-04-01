import { PagedUserItemRequest, PagedUserItemResponse, TweeterResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { DynamoDBDAOFactory } from "../../model/dao/dynamodb/DynamoDBDAOFactory";
import { doLambdaOperation } from "../LambdaHelper";

export const handler = async (request: PagedUserItemRequest) => {
	return await doLambdaOperation<PagedUserItemResponse>(async () => {
		const followService = new FollowService(new DynamoDBDAOFactory());
		const [items, hasMore] = await followService.loadMoreFollowers(
			request.token,
			request.userAlias,
			request.pageSize,
			request.lastItem
		);
	
		return {
			success: true,
			message: null,
			items: items,
			hasMore: hasMore
		}
	});
}