import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

export abstract class DynamoDBDAO {
	private static dynamoDBDocumentClientInstance: DynamoDBDocumentClient

	public constructor() {
		if (!DynamoDBDAO.dynamoDBDocumentClientInstance) {
			DynamoDBDAO.dynamoDBDocumentClientInstance = DynamoDBDocumentClient.from(new DynamoDBClient());
		}
	}

	protected get dynamoDBDocumentClient(): DynamoDBDocumentClient {
		return DynamoDBDAO.dynamoDBDocumentClientInstance;
	}
}