export interface AuthDAO {
	putToken(alias: string, token: string): Promise<void>
	
	getToken(alias: string): Promise<string | null>
}