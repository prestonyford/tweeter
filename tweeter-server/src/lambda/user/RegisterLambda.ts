import { AuthResponse, RegisterRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDBDAOFactory } from "../../model/dao/dynamodb/DynamoDBDAOFactory";
import { ImageS3DAO } from "../../model/dao/s3/ImageS3DAO";
import { doLambdaOperation } from "../LambdaHelper";

export const handler = async (request: RegisterRequest): Promise<AuthResponse> => {
	const userService = new UserService(new DynamoDBDAOFactory(), new ImageS3DAO());

	return doLambdaOperation(async () => {
		const [user, authToken] = await userService.register(
			request.firstName,
			request.lastName,
			request.alias,
			request.password,
			request.imageStringBase64,
			request.imageFileExtension
		);
	
		return {
			success: true,
			message: null,
			user,
			authToken
		}
	})
}
