import { StatusDTO } from "../../dto/StatusDTO";
import { TweeterRequest } from "./TweeterRequest";

export interface PagedStatusItemRequest extends TweeterRequest {
	readonly userAlias: string,
	readonly pageSize: number,
	readonly lastItem: StatusDTO | null
}