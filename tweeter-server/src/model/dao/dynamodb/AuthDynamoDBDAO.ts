import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { AuthDAO } from "../AuthDAO";
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

export class AuthDynamoDBDAO implements AuthDAO {
	private readonly tableName = "auths";
	private readonly aliasAttr = "alias"
	private readonly tokenAttr = "token"
	
	private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

	public async putToken(alias: string, token: string): Promise<void> {
		const params = {
			TableName: this.tableName,
			Item: {
				[this.tokenAttr]: token,
				[this.aliasAttr]: alias
			}
		};

		await this.client.send(new PutCommand(params));
	}

	public async getToken(alias: string): Promise<string | null> {
		const params = {
			TableName: this.tableName,
			Key: {
				[this.aliasAttr]: alias
			}
		};
		
		const output = await this.client.send(new GetCommand(params));
		return output.Item == undefined ? null : output.Item[this.tokenAttr];
	}
}