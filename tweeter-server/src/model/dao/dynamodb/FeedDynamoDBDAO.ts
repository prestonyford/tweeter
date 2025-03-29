import { FeedDAO } from "../FeedDAO";
import { PostDTO } from "../../dto/PostDTO";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

interface Item {
	timestamp: number,
	senderAlias: string
}

export class FeedDynamoDBDAO implements FeedDAO {
	private readonly tableName = "feed";
	private readonly aliasAttr = "alias"
	private readonly senderAliasAttr = "senderAlias"
	private readonly timestampAttr = "timestamp"
	private readonly timestampSenderAttr = "timestamp-senderAlias"
	private readonly postAttr = "post"

	private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

	/**
	 * 
	 * @param userAlias The alias of the user whose feed should be queried.
	 * @param pageSize The limit on the number of items to be returned.
	 * @param lastItem The concatenation of timestamp-senderAlias of the last item from the previous page queried, or null if not applicable.
	 */
	public async getFeed(userAlias: string, pageSize: number, lastItem: Item | null): Promise<[PostDTO[], boolean]> {
		const params = {
			TableName: this.tableName,
			KeyConditionExpression: this.aliasAttr + " = :v",
			ExpressionAttributeValues: {
				":v": userAlias,
			},
			Limit: pageSize,
			ExclusiveStartKey: lastItem === null
				? undefined
				: {
					[this.aliasAttr]: userAlias,
					[this.timestampSenderAttr]: `${lastItem.timestamp}-${lastItem.senderAlias}`,
				},
		};
		
		const items: PostDTO[] = [];
		const data = await this.client.send(new QueryCommand(params));
		const hasMorePages = data.LastEvaluatedKey !== undefined;
		data.Items?.forEach((item) =>
			items.push({
				senderAlias: item[this.senderAliasAttr],
				post: item[this.postAttr],
				timestamp: item[this.timestampAttr]
			})
		);
		return [items, hasMorePages];
	}

	public async addFeed(userAlias: string, post: PostDTO): Promise<void> {
		const params = {
			TableName: this.tableName,
			Item: {
				[this.aliasAttr]: userAlias,
				[this.timestampSenderAttr]: `${post.timestamp}-${post.senderAlias}`,
				[this.senderAliasAttr]: post.senderAlias,
				[this.postAttr]: post.post,
				[this.timestampAttr]: post.timestamp
			}
		};
		await this.client.send(new PutCommand(params));
	}
	
}