import { UserDTO } from "tweeter-shared";

export interface FollowDAO {
	
	/**
	 * @param followerAlias 
	 * @param followeeAlias 
	 * @returns a Promise that resolves to `true` if `followeeAlias` follows `followerAlias`, otherwise `false`
	 */
	isFollower(followerAlias: string, followeeAlias: string): Promise<boolean>;

	/**
	 * @param userAlias 
	 * @returns a Promise that resolves to the number of followees of `userAlias`
	 */
	getFolloweeCount(userAlias: string): Promise<number>;

	/**
	 * @param userAlias 
	 * @returns a Promise that resolves to the number of followers of `userAlias`
	 */
	getFollowerCount(userAlias: string): Promise<number>;

	/**
	 * @param userAlias 
	 * @param pageSize 
	 * @param lastItemAlias 
	 * @returns a tuple containing an array of the aliases of `userAlias`'s followers, and a hasMore flag.
	 */
	getFollowers(userAlias: string, pageSize: number, lastItemAlias: string | null): Promise<[string[], boolean]>;

	/**
	 * @param userAlias 
	 * @param pageSize 
	 * @param lastItemAlias 
	 * @returns a tuple containing an array of the aliases of `userAlias`'s followees, and a hasMore flag.
	 */
	getFollowees(userAlias: string, pageSize: number, lastItemAlias: string | null): Promise<[string[], boolean]>;

	/**
	 * Adds a follow relationship where `followeeAlias` follows `userAlias`
	 * @param userAlias
	 * @param followeeAlias
	 */
	addFollow(userAlias: string, followeeAlias: string): Promise<void>;

	
	/**
	 * Removes an existing follow relationship where `followeeAlias` followed `userAlias`
	 * @param userAlias
	 * @param followeeAlias
	 */
	removeFollow(userAlias: string, followeeAlias: string): Promise<void>;
}