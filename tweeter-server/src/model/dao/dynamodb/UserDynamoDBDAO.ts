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
	
	private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());
	
	public async putUser(user: UserDTO): Promise<void> {
		const params = {
			TableName: this.tableName,
			Item: {
				[this.firstNameAttr]: user.firstName,
				[this.lastNameAttr]: user.lastName,
				[this.aliasAttr]: user.alias,
				[this.imageUrlAttr]: user.imageUrl
			}
		};
		await this.client.send(new PutCommand(params));
	}	

	public async getUser(alias: string): Promise<UserDTO | null> {
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
}