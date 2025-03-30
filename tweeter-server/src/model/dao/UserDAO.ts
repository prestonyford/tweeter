import { UserDTO } from "tweeter-shared";

export interface UserDAO {
	putUser(user: UserDTO, passwordHash: string): Promise<void>
	
	getUserInfo(alias: string): Promise<UserDTO | null>
	
	getUserCredentials(alias: string): Promise<string | null>
}