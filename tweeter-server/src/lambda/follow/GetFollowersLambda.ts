import { PagedUserItemRequest, PagedUserItemResponse, TweeterResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { DynamoDBDAOFactory } from "../../model/dao/dynamodb/DynamoDBDAOFactory";
import { ServiceException } from "../../model/service/exception/ServiceException";

export const handler = async (request: PagedUserItemRequest): Promise<PagedUserItemResponse | TweeterResponse> => {
	try {
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
	} catch (e) {
		const error = e as ServiceException; 
		return {
			success: false,
			message: error.message
		}
	}
}