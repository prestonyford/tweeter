import {
	AuthResponse,
	AuthToken,
	FollowCountRequest,
	FollowCountResponse,
	FollowerStatusRequest,
	FollowerStatusResponse,
	FollowRequest,
	GetUserRequest,
	GetUserResponse,
	LoginRequest,
	PagedStatusItemRequest,
	PagedStatusItemResponse,
	PagedUserItemRequest,
	PagedUserItemResponse,
	PostStatusRequest,
	RegisterRequest,
	Status,
	TweeterRequest,
	TweeterResponse,
	UnfollowRequest,
	User
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
	private SERVER_URL = "https://noruw8wpv2.execute-api.us-east-1.amazonaws.com/dev";

	private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

	private handleResponse<T>(response: TweeterResponse, successCallback: () => T) {
		if (response.success) {
			return successCallback();
		} else {
			console.error(response);
			throw new Error(response.message ?? undefined);
		}
	}

	//
	// Follow
	//

	public async getIsFollowerStatus( request: FollowerStatusRequest ): Promise<boolean> {
		const response = await this.clientCommunicator.doPost<
			FollowerStatusRequest,
			FollowerStatusResponse
		>(request, "/follow/status");

		// Handle errors    
		return this.handleResponse(response, () => {
			if (response.status == null) {
				throw new Error(`No follower status found`);
			} else {
				return response.status;
			}
		});
	}

	public async getFolloweeCount( request: FollowCountRequest ): Promise<number> {
		const response = await this.clientCommunicator.doPost<
			FollowCountRequest,
			FollowCountResponse
		>(request, "/followee/count");

		// Handle errors    
		return this.handleResponse(response, () => {
			if (response.count == null) {
				throw new Error(`No followee count found`);
			} else {
				return response.count;
			}
		});
	}
	
	public async getFollowerCount( request: FollowCountRequest ): Promise<number> {
		const response = await this.clientCommunicator.doPost<
			FollowCountRequest,
			FollowCountResponse
		>(request, "/follower/count");

		// Handle errors    
		return this.handleResponse(response, () => {
			if (response.count == null) {
				throw new Error(`No follower count found`);
			} else {
				return response.count;
			}
		});
	}

	public async getMoreFollowees( request: PagedUserItemRequest ): Promise<[User[], boolean]> {
		const response = await this.clientCommunicator.doPost<
			PagedUserItemRequest,
			PagedUserItemResponse
		>(request, "/followee/list");

		// Convert the UserDTO array returned by ClientCommunicator to a User array
		const items: User[] | null = response.success && response.items
			? response.items.map((dto) => User.fromDto(dto) as User)
			: null;

		// Handle errors
		return this.handleResponse(response, () => {
			if (items == null) {
				throw new Error(`No followees found`);
			} else {
				return [items, response.hasMore];
			}
		});
	}

	public async getMoreFollowers( request: PagedUserItemRequest ): Promise<[User[], boolean]> {
		const response = await this.clientCommunicator.doPost<
			PagedUserItemRequest,
			PagedUserItemResponse
		>(request, "/follower/list");

		// Convert the UserDTO array returned by ClientCommunicator to a User array
		const items: User[] | null = response.success && response.items
			? response.items.map((dto) => User.fromDto(dto) as User)
			: null;

		// Handle errors  
		return this.handleResponse(response, () => {
			if (items == null) {
				throw new Error(`No followers found`);
			} else {
				return [items, response.hasMore];
			}
		});
	}

	
	public async follow( request: FollowRequest ): Promise<void> {
		const response = await this.clientCommunicator.doPost<
			FollowRequest,
			TweeterResponse
		>(request, "/follow/follow");

		this.handleResponse(response, () => {});
	}

	public async unfollow( request: UnfollowRequest ): Promise<void> {
		const response = await this.clientCommunicator.doPost<
			UnfollowRequest,
			TweeterResponse
		>(request, "/follow/unfollow");

		this.handleResponse(response, () => {});
	}

	
	//
	// Status
	//
	
	public async postStatus( request: PostStatusRequest ): Promise<void> {
		const response = await this.clientCommunicator.doPost<
			PostStatusRequest,
			TweeterResponse
		>(request, "/status/post");

		this.handleResponse(response, () => {});
	}

	public async loadMoreFeedItems( request: PagedStatusItemRequest ): Promise<[Status[], boolean]> {
		const response = await this.clientCommunicator.doPost<
			PagedStatusItemRequest,
			PagedStatusItemResponse
		>(request, "/status/feed");

		// Convert the StatusDTO array returned by ClientCommunicator to a Status array
		const items: Status[] | null = response.success && response.items
			? response.items.map((dto) => Status.fromDto(dto) as Status)
			: null;

		// Handle errors  
		return this.handleResponse(response, () => {
			if (items == null) {
				throw new Error(`No feed items found`);
			} else {
				return [items, response.hasMore];
			}
		});
	}

	
	public async loadMoreStoryItems( request: PagedStatusItemRequest ): Promise<[Status[], boolean]> {
		const response = await this.clientCommunicator.doPost<
			PagedStatusItemRequest,
			PagedStatusItemResponse
		>(request, "/status/story");

		// Convert the StatusDTO array returned by ClientCommunicator to a Status array
		const items: Status[] | null = response.success && response.items
			? response.items.map((dto) => Status.fromDto(dto) as Status)
			: null;

		// Handle errors  
		return this.handleResponse(response, () => {
			if (items == null) {
				throw new Error(`No story items found`);
			} else {
				return [items, response.hasMore];
			}
		});
	}

	
	//
	// User
	//

	public async getUser( request: GetUserRequest ): Promise<User> {
		const response = await this.clientCommunicator.doPost<
			GetUserRequest,
			GetUserResponse
		>(request, "/user/get");

		// Handle errors  
		return this.handleResponse(response, () => {
			if (response.user == null) {
				throw new Error(`No user found`);
			} else {
				return User.fromDto(response.user) as User;
			}
		});
	}

	public async login( request: LoginRequest ): Promise<[User, AuthToken]> {
		const response = await this.clientCommunicator.doPost<
			LoginRequest,
			AuthResponse
		>(request, "/user/login");

		// Handle errors  
		return this.handleResponse(response, () => {
			return [User.fromDto(response.user) as User, AuthToken.fromDto(response.authToken) as AuthToken];
		});
	}

	public async register( request: RegisterRequest ): Promise<[User, AuthToken]> {
		const response = await this.clientCommunicator.doPost<
			RegisterRequest,
			AuthResponse
		>(request, "/user/register");

		// Handle errors  
		return this.handleResponse(response, () => {
			return [User.fromDto(response.user) as User, AuthToken.fromDto(response.authToken) as AuthToken];
		});
	}
	
	public async logout( request: TweeterRequest ): Promise<void> {
		const response = await this.clientCommunicator.doPost<
			TweeterRequest,
			TweeterResponse
		>(request, "/user/logout");

		this.handleResponse(response, () => {});
	}
}
