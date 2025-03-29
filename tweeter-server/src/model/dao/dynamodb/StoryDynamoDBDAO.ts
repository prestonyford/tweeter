import { StoryDAO } from "../StoryDAO";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { PostDTO } from "../../dto/PostDTO";

export class StoryDynamoDBDAO implements StoryDAO {
	private readonly tableName = "story";
	private readonly aliasAttr = "alias"
	private readonly timestampAttr = "timestamp"
	private readonly postAttr = "post"

	private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

	public async getStory(userAlias: string, pageSize: number, lastItemTimestamp: number | null): Promise<[PostDTO[], boolean]> {
		const params = {
			TableName: this.tableName,
			KeyConditionExpression: this.aliasAttr + " = :v",
			ExpressionAttributeValues: {
				":v": userAlias,
			},
			Limit: pageSize,
			ExclusiveStartKey: lastItemTimestamp === null
				? undefined
				: {
					[this.aliasAttr]: userAlias,
					[this.timestampAttr]: lastItemTimestamp,
				},
		};
		
		const items: PostDTO[] = [];
		const data = await this.client.send(new QueryCommand(params));
		const hasMorePages = data.LastEvaluatedKey !== undefined;
		data.Items?.forEach((item) =>
			items.push({
				senderAlias: userAlias,
				post: item[this.postAttr],
				timestamp: item[this.timestampAttr]
			})
		);
		return [items, hasMorePages];
	}

	public async addStory(post: PostDTO): Promise<void> {
		const params = {
			TableName: this.tableName,
			Item: {
				[this.aliasAttr]: post.senderAlias,
				[this.timestampAttr]: post.timestamp,
				[this.postAttr]: post.post
			}
		};
		await this.client.send(new PutCommand(params));
	}
}