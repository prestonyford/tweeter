import { StoryDAO } from "../StoryDAO";
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { PostDTO } from "../../dto/PostDTO";
import { DynamoDBDAO } from "./DynamoDBDAO";

export class StoryDynamoDBDAO extends DynamoDBDAO implements StoryDAO {
	private readonly tableName = "story";
	private readonly aliasAttr = "alias"
	private readonly timestampAttr = "timestamp"
	private readonly postAttr = "post"

	private readonly client = this.dynamoDBDocumentClient;

	public async getStory(userAlias: string, pageSize: number, lastItemTimestamp: number | null): Promise<[PostDTO[], boolean]> {
		const params = {
			TableName: this.tableName,
			KeyConditionExpression: this.aliasAttr + " = :v",
			ExpressionAttributeValues: {
				":v": userAlias,
			},
			Limit: pageSize,
			ScanIndexForward: false,
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