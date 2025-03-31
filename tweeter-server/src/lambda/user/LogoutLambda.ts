import { TweeterRequest, TweeterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDBDAOFactory } from "../../model/dao/dynamodb/DynamoDBDAOFactory";
import { ImageS3DAO } from "../../model/dao/s3/ImageS3DAO";
import { doLambdaOperation } from "../LambdaHelper";

export const handler = async (request: TweeterRequest): Promise<TweeterResponse> => {
	return await doLambdaOperation<TweeterResponse>(async () => {
		const userService = new UserService(new DynamoDBDAOFactory(), new ImageS3DAO());
		await userService.logout( request.token );

		return {
			success: true,
			message: null
		}
	});
}
