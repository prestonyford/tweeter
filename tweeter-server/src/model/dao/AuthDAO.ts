import { AuthTokenDTO } from "tweeter-shared"

export interface AuthDAO {
	putAuth(token: AuthTokenDTO, alias: string): Promise<void>
	
	/**
	 * 
	 * @param token 
	 * @returns A tuple containing the alias of the user associated with the token, and the token's timestamp.
	 */
	getAuth(token: string): Promise<[string, number] | null>

	deleteAuth(token: string): Promise<void>

	renewAuth(token: string, timestamp: number): Promise<void>
}