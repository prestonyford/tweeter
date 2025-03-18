import { UserDTO } from "../../dto/UserDTO";
import { TweeterRequest } from "./TweeterRequest";

export interface UnfollowRequest extends TweeterRequest {
	readonly userToUnfollow: UserDTO
}
