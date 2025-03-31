export class ServiceException extends Error {
	private _statusCode: number;

	public constructor(statusCode: number, message: string) {
		if (statusCode >= 500) {
			super("[Server Error] " + message);
		} else if (statusCode >= 400) {
			super("[Bad Request] " + message);
		} else {
			super(message);
		}
		
		this.name = this.constructor.name;
		this._statusCode = statusCode;

		Object.setPrototypeOf(this, ServiceException.prototype);
	}

	public get statusCode(): number {
		return this._statusCode;
	}
	
	public get message(): string {
		return this.message;
	}
}