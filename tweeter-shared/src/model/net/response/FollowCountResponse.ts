import { UserDTO } from "../../dto/UserDTO";
import { TweeterResponse } from "./TweeterResponse";

export interface FollowCountResponse extends TweeterResponse {
	readonly count: number
}