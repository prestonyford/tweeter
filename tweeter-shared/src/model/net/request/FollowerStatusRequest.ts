import { UserDTO } from "../../dto/UserDTO";
import { TweeterRequest } from "./TweeterRequest";

export interface FollowerStatusRequest extends TweeterRequest {
	readonly user: UserDTO
	readonly selectedUser: UserDTO
}
