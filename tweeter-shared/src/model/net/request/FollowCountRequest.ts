import { UserDTO } from "../../dto/UserDTO";
import { TweeterRequest } from "./TweeterRequest";

export interface FollowCountRequest extends TweeterRequest {
	readonly user: UserDTO
}