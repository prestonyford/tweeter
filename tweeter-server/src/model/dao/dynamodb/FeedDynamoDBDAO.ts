import { FeedDAO } from "../FeedDAO";
import { PostDTO } from "../../dto/PostDTO";
import { BatchWriteCommand, BatchWriteCommandInput, BatchWriteCommandOutput, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBDAO } from "./DynamoDBDAO";
import { UpdateFeedJob } from "../../dto/UpdateFeedJob";

interface Item {
	timestamp: number,
	senderAlias: string
}

export class FeedDynamoDBDAO extends DynamoDBDAO implements FeedDAO {
	private readonly tableName = "feed";
	private readonly aliasAttr = "alias"
	private readonly senderAliasAttr = "senderAlias"
	private readonly timestampAttr = "timestamp"
	private readonly timestampSenderAttr = "timestamp-senderAlias"
	private readonly postAttr = "post"

	private readonly client = this.dynamoDBDocumentClient;

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
			ScanIndexForward: false,
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

	/**
	 * 
	 * @param jobs usersToUpdateFeed length must be at most 25
	 */
	public async batchWriteFeeds(job: UpdateFeedJob) {
		const params = {
			RequestItems: {
				[this.tableName]: job.usersToUpdateFeed.map(userAlias => ({
					PutRequest: {
						Item: {
							[this.aliasAttr]: userAlias,
							[this.timestampSenderAttr]: `${job.post.timestamp}-${job.post.senderAlias}`,
							[this.senderAliasAttr]: job.post.senderAlias,
							[this.postAttr]: job.post.post,
							[this.timestampAttr]: job.post.timestamp
						}
					}
				}))
			},
		};

		try {
			const response = await this.client.send(new BatchWriteCommand(params));
			await this.putUnprocessedItems(response, params);
		} catch (err) {
			throw new Error(
				`Error while batch writing follows with params: ${params} \n${err}`
			);
		}
	}

	private async putUnprocessedItems(
		resp: BatchWriteCommandOutput,
		params: BatchWriteCommandInput,
	) {
		let delay = 10;
		let attempts = 0;

		while (
			resp.UnprocessedItems !== undefined &&
			Object.keys(resp.UnprocessedItems).length > 0
		) {
			attempts++;

			if (attempts > 1) {
				// Pause before the next attempt
				await new Promise((resolve) => setTimeout(resolve, delay));

				// Increase pause time for next attempt
				if (delay < 1000) {
					delay += 100;
				}
			}

			console.log(
				`Attempt ${attempts}. Processing ${Object.keys(resp.UnprocessedItems).length
				} unprocessed follow items.`
			);

			params.RequestItems = resp.UnprocessedItems;
			resp = await this.client.send(new BatchWriteCommand(params));
		}
	}
}
