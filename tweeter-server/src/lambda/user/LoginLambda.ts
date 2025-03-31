import { AuthResponse, LoginRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDBDAOFactory } from "../../model/dao/dynamodb/DynamoDBDAOFactory";
import { ImageS3DAO } from "../../model/dao/s3/ImageS3DAO";
import { doLambdaOperation } from "../LambdaHelper";

export const handler = async (request: LoginRequest) => {
	return await doLambdaOperation<AuthResponse>(async () => {
		const userService = new UserService(new DynamoDBDAOFactory(), new ImageS3DAO());
		const [user, authToken] = await userService.login(
			request.alias,
			request.password
		);

		return {
			success: true,
			message: null,
			user,
			authToken
		}
	});
}
