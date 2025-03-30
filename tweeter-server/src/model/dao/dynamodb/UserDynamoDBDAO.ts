import { UserDTO } from "tweeter-shared";
import { UserDAO } from "../UserDAO";
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export class UserDynamoDBDAO implements UserDAO {
	private readonly tableName = "users";
	private readonly firstNameAttr = "firstName"
	private readonly lastNameAttr = "lastName"
	private readonly aliasAttr = "alias"
	private readonly imageUrlAttr = "imageUrl"
	private readonly hashedPasswordAttr = "hashedPassword";
	
	private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());
	
	public async putUser(user: UserDTO, passwordHash: string): Promise<void> {
		const params = {
			TableName: this.tableName,
			Item: {
				[this.firstNameAttr]: user.firstName,
				[this.lastNameAttr]: user.lastName,
				[this.aliasAttr]: user.alias,
				[this.imageUrlAttr]: user.imageUrl,
				[this.hashedPasswordAttr]: passwordHash
			}
		};
		await this.client.send(new PutCommand(params));
	}	

	public async getUserInfo(alias: string): Promise<UserDTO | null> {
		const params = {
			TableName: this.tableName,
			Key: {
				[this.aliasAttr]: alias
			}
		};
		
		const output = await this.client.send(new GetCommand(params));
		return output.Item == undefined ? null : {
			firstName: output.Item[this.firstNameAttr],
			lastName: output.Item[this.lastNameAttr],
			alias: output.Item[this.aliasAttr],
			imageUrl: output.Item[this.imageUrlAttr]
		};
	}

	public async getUserCredentials(alias: string): Promise<string | null> {
		const params = {
			TableName: this.tableName,
			Key: {
				[this.aliasAttr]: alias
			}
		};
		
		const output = await this.client.send(new GetCommand(params));
		return output.Item == undefined ? null : output.Item[this.hashedPasswordAttr];
	}
}
