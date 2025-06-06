import { GetUserRequest, GetUserResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDBDAOFactory } from "../../model/dao/dynamodb/DynamoDBDAOFactory";
import { ImageS3DAO } from "../../model/dao/s3/ImageS3DAO";
import { doLambdaOperation } from "../LambdaHelper";

export const handler = async (request: GetUserRequest) => {
	return await doLambdaOperation<GetUserResponse>(async () => {
		const userService = new UserService(new DynamoDBDAOFactory(), new ImageS3DAO());
		const user = await userService.getUser(
			request.token,
			request.alias
		);

		return {
			success: true,
			message: null,
			user
		}
	});
}
