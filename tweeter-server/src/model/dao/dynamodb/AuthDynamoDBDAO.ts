import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { AuthDAO } from "../AuthDAO";
import { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { AuthTokenDTO } from "tweeter-shared";

export class AuthDynamoDBDAO implements AuthDAO {
	private readonly tableName = "auths";
	private readonly tokenAttr = "token";
	private readonly aliasAttr = "alias";
	// private readonly hashedPasswordAttr = "hashedPassword";
	// private readonly saltAttr = "salt";
	private readonly timestampAttr = "timestamp";

	private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

	public async putAuth(token: AuthTokenDTO, alias: string): Promise<void> {
		const params = {
			TableName: this.tableName,
			Item: {
				[this.aliasAttr]: alias,
				// [this.hashedPasswordAttr]: hashedPassword,
				// [this.saltAttr]: salt,
				[this.tokenAttr]: token.token,
				[this.timestampAttr]: token.timestamp,
			}
		};

		await this.client.send(new PutCommand(params));
	}

	public async getAuth(token: string): Promise<[string, number] | null> {
		const params = {
			TableName: this.tableName,
			Key: {
				[this.tokenAttr]: token
			}
		};

		const output = await this.client.send(new GetCommand(params));
		return output.Item == undefined
			? null
			: [output.Item[this.aliasAttr], output.Item[this.timestampAttr]];
	}

	public async deleteAuth(token: string): Promise<void> {
		const params = {
			TableName: this.tableName,
			Key: {
				[this.tokenAttr]: token
			}
		};
		await this.client.send(new DeleteCommand(params));
	}

	public async renewAuth(token: string, timestamp: number) {
		const params = {
			TableName: this.tableName,
			Key: {
				[this.tokenAttr]: token
			},
			ExpressionAttributeNames: {
				"#ts": this.timestampAttr
			},
			ExpressionAttributeValues: {
				":timestampVal": timestamp
			},
			UpdateExpression: "SET #ts = :timestampVal"
		};
		await this.client.send(new UpdateCommand(params));
	}
}
