import { FollowDAO } from "../FollowDAO";
import { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient, Select } from "@aws-sdk/client-dynamodb";

export class FollowDynamoDBDAO implements FollowDAO {
	private readonly tableName = "follows";
	private readonly indexName = "followeeAlias-alias-index"
	private readonly followerAliasAttr = "alias"
	private readonly followeeAliasAttr = "followeeAlias"

	private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

	public async isFollower(followerAlias: string, followeeAlias: string): Promise<boolean> {
		const params = {
			TableName: this.tableName,
			Key: {
				[this.followerAliasAttr]: followerAlias,
				[this.followeeAliasAttr]: followeeAlias
			}
		};

		const output = await this.client.send(new GetCommand(params));
		return output.Item == undefined
			? false
			: true;
	}

	public async getFolloweeCount(userAlias: string): Promise<number> {
		const params = {
			TableName: this.tableName,
			KeyConditionExpression: `${this.followerAliasAttr} = :userAlias`,
			ExpressionAttributeValues: {
				":userAlias": userAlias,
			},
			Select: Select.COUNT
		};
		const output = await this.client.send(new QueryCommand(params));
		return output.Count ?? 0;
	}

	public async getFollowerCount(userAlias: string): Promise<number> {
		const params = {
			TableName: this.tableName,
			KeyConditionExpression: `${this.followeeAliasAttr} = :userAlias`,
			ExpressionAttributeValues: {
				":userAlias": userAlias,
			},
			IndexName: this.indexName,
			Select: Select.COUNT
		};
		const output = await this.client.send(new QueryCommand(params));
		return output.Count ?? 0;
	}

	public async getFollowers(userAlias: string, pageSize: number, lastItemAlias: string | null): Promise<[string[], boolean]> {
		const params: QueryCommandInput = {
			KeyConditionExpression: this.followeeAliasAttr + " = :v",
			ExpressionAttributeValues: {
				":v": userAlias,
			},
			TableName: this.tableName,
			Limit: pageSize,
			IndexName: this.indexName,
			ExclusiveStartKey: lastItemAlias === null
				? undefined
				: {
					[this.followeeAliasAttr]: userAlias,
					[this.followerAliasAttr]: lastItemAlias,
				},
		};

		const items: string[] = [];
		const data = await this.client.send(new QueryCommand(params));
		const hasMorePages = data.LastEvaluatedKey !== undefined;
		data.Items?.forEach((item) =>
			items.push(item[this.followerAliasAttr])
		);
		return [items, hasMorePages];
	}

	public async getFollowees(userAlias: string, pageSize: number, lastItemAlias: string | null): Promise<[string[], boolean]> {
		const params: QueryCommandInput = {
			KeyConditionExpression: this.followerAliasAttr + " = :v",
			ExpressionAttributeValues: {
				":v": userAlias,
			},
			TableName: this.tableName,
			Limit: pageSize,
			ExclusiveStartKey: lastItemAlias === null
				? undefined
				: {
					[this.followerAliasAttr]: userAlias,
					[this.followeeAliasAttr]: lastItemAlias,
				},
		};

		const items: string[] = [];
		const data = await this.client.send(new QueryCommand(params));
		const hasMorePages = data.LastEvaluatedKey !== undefined;
		data.Items?.forEach((item) =>
			items.push(item[this.followeeAliasAttr])
		);
		return [items, hasMorePages];
	}

	public async addFollow(userAlias: string, followeeAlias: string): Promise<void> {
		const params = {
			TableName: this.tableName,
			Item: {
				[this.followerAliasAttr]: userAlias,
				[this.followeeAliasAttr]: followeeAlias
			}
		};
		await this.client.send(new PutCommand(params));
	}

	public async removeFollow(userAlias: string, followeeAlias: string): Promise<void> {
		const params = {
			TableName: this.tableName,
			Key: {
				[this.followerAliasAttr]: userAlias,
				[this.followeeAliasAttr]: followeeAlias
			}
		};
		await this.client.send(new DeleteCommand(params));
	}
}
