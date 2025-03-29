import { UserDTO } from "tweeter-shared";

export interface UserDAO {
	putUser(user: UserDTO): Promise<void>
	
	getUser(alias: string): Promise<UserDTO | null>
}