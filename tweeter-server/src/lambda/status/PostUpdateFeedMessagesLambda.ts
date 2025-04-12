import { PostStatusRequest, UserDTO } from "tweeter-shared";
import { DynamoDBDAOFactory } from "../../model/dao/dynamodb/DynamoDBDAOFactory";
import { doLambdaOperation } from "../LambdaHelper";
import { SQSClient, SendMessageBatchCommand, SendMessageCommand } from "@aws-sdk/client-sqs";
import { FollowService } from "../../model/service/FollowService";
import { UpdateFeedJob } from "../../model/dto/UpdateFeedJob";

const sqsClient = new SQSClient();

export const handler = async function (event: any) {
	const followService = new FollowService(new DynamoDBDAOFactory());

	for (let i = 0; i < event.Records.length; ++i) {
		const { body } = event.Records[i];
		const request: PostStatusRequest = JSON.parse(body);
		// const alias = await followService.getUserAlias(request.token);
		const alias = request.newStatus.user.alias;

		// Get followers
		let lastItemAlias = null;
		let hasMore = true;
		const followerAliases: string[] = []
		do {
			let page;
			[page, hasMore] = await followService.loadFollowerAliases(
				request.token,
				alias,
				100,
				lastItemAlias
			);
			if (page.length) {
				// console.log(page)
				lastItemAlias = page[page.length - 1];
				followerAliases.push(...page);
			}
		} while (hasMore);

		// console.log(followerAliases)

		if (!followerAliases.length) {
			continue;
		}

		// Sent to next queue
		const sqs_url = "https://sqs.us-east-1.amazonaws.com/303041824135/JobsQueue";
		const numMessages = 10;
		const numUsersPerJob = 150;

		const followerChunks: string[][] = [];
		for (let j = 0; j < followerAliases.length; j += numUsersPerJob) {
			followerChunks.push(followerAliases.slice(j, j + numUsersPerJob));
		}

		for (let j = 0; j < followerChunks.length; j += numMessages) {
			const batch = followerChunks.slice(j, j + numMessages).map((followerChunk) => {
				const job: UpdateFeedJob = {
					usersToUpdateFeed: followerChunk,
					post: {
						senderAlias: alias,
						post: request.newStatus.post,
						timestamp: request.newStatus.timestamp
					}
				};

				return {
					Id: `${i}-${j}-${followerChunk[0]}`,
					MessageBody: JSON.stringify(job)
				}
			});

			const params = {
				QueueUrl: sqs_url,
				Entries: batch,
			};

			await sqsClient.send(new SendMessageBatchCommand(params));
		}
	}

	return null;
};