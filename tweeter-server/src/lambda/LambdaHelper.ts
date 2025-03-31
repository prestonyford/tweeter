import { ServiceException } from "../model/service/exception/ServiceException";

export async function doLambdaOperation(operation: () => any) {
	try {
		return await operation();
	} catch (e) {
		const error = e as ServiceException;
		return {
			success: false,
			message: error.message
		}
	}
}