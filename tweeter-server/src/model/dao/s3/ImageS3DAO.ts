import { ObjectCannedACL, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { ImageDAO } from "../ImageDAO";
import { ServiceException } from "../../service/exception/ServiceException";

export class ImageS3DAO implements ImageDAO {
	private static BUCKET: string = "pyford340bucket";
	private static REGION: string = "us-east-1";

	public async putImage(fileName: string, imageStringBase64Encoded: string): Promise<string> {
		let decodedImageBuffer: Buffer = Buffer.from(
			imageStringBase64Encoded,
			"base64"
		);
		const s3Params = {
			Bucket: ImageS3DAO.BUCKET,
			Key: "image/" + fileName,
			Body: decodedImageBuffer,
			ContentType: "image/png",
			ACL: ObjectCannedACL.public_read,
		};
		const c = new PutObjectCommand(s3Params);
		const client = new S3Client({ region: ImageS3DAO.REGION });
		try {
			await client.send(c);
			return (
				`https://${ImageS3DAO.BUCKET}.s3.${ImageS3DAO.REGION}.amazonaws.com/image/${fileName}`
			);
		} catch (error) {
			throw new ServiceException(500, "s3 put image failed with: " + error);
		}
	}
}