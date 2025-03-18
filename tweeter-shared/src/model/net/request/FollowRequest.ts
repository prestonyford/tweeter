import { UserDTO } from "../../dto/UserDTO";
import { TweeterRequest } from "./TweeterRequest";

export interface FollowRequest extends TweeterRequest {
	readonly userToFollow: UserDTO
}
