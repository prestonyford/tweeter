import { PostStatusRequest, UserDTO } from "tweeter-shared";
import { DynamoDBDAOFactory } from "../../model/dao/dynamodb/DynamoDBDAOFactory";
import { doLambdaOperation } from "../LambdaHelper";
import { SQSClient, SendMessageBatchCommand, SendMessageCommand } from "@aws-sdk/client-sqs";
import { UpdateFeedJob } from "../../model/dto/UpdateFeedJob";
import { StatusService } from "../../model/service/StatusService";

const statusService = new StatusService(new DynamoDBDAOFactory());

export const handler = async function (event: any) {
	console.log("in handler");
	for (let i = 0; i < event.Records.length; ++i) {

		const { body } = event.Records[i];
		const job: UpdateFeedJob = JSON.parse(body);

		const chunkSize = 25;
		const chunks: UpdateFeedJob[] = [];
		for (let j = 0; j < job.usersToUpdateFeed.length; j += chunkSize) {
			chunks.push({
				...job,
				usersToUpdateFeed: job.usersToUpdateFeed.slice(j, j + chunkSize),
			});
		}

		// Process each chunk sequentially
		for (const chunk of chunks) {
			const startTime = Date.now();
			
			await statusService.batchWriteFeeds(chunk);

			const endTime = Date.now();
			
			const elapsedTime = endTime - startTime;
			const sleepTime = Math.max(0, 300 - elapsedTime);

			if (sleepTime >= 0) {
				await new Promise((resolve) => setTimeout(resolve, sleepTime));
			}
		}


	}

	// One iter is 1 second
	// Get diff in time from before and after that iter. Sleep the difference

	return null;
};