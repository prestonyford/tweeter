import { PostStatusRequest, TweeterResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { DynamoDBDAOFactory } from "../../model/dao/dynamodb/DynamoDBDAOFactory";
import { doLambdaOperation } from "../LambdaHelper";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

const sqsClient = new SQSClient();

export const handler = async (request: PostStatusRequest) => {
	return await doLambdaOperation<TweeterResponse>(async () => {
		const statusService = new StatusService(new DynamoDBDAOFactory());
		const sqs_url = "https://sqs.us-east-1.amazonaws.com/303041824135/PostsQueue";
		const params = {
			DelaySeconds: 10,
			MessageBody: JSON.stringify(request),
			QueueUrl: sqs_url,
		};

		await Promise.all([
			statusService.addToStory(
				request.token,
				request.newStatus
			),
			sqsClient.send(new SendMessageCommand(params))
		])

		return {
			success: true,
			message: null
		}
	});
}
