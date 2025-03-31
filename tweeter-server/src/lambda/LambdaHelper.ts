import { TweeterResponse } from "tweeter-shared";
import { ServiceException } from "../model/service/exception/ServiceException";

export async function doLambdaOperation<T extends TweeterResponse>(operation: () => Promise<T>) {
	try {
		return await operation();
	} catch (e) {
		const error = e as ServiceException;
		const response: TweeterResponse = {
			success: false,
			message: error.message ?? null
		}
		return response;
	}
}