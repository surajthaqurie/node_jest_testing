import { S3, S3Service } from "./s3Service";

const mockFile = {
  name: "image1.jpeg",
  data: "<Buffer ff d8 ff e0 00 10 4a 46 49 46 00 01 ff d8 ff e0 00 10 4a 46 49 46 00 01ff d8 ff e0 00 10 4a 46 49 46 00 01",
  size: 19128,
  encoding: "7bit",
  tempFilePath: "",
  truncate: false,
  mimetype: "image/jpeg",
  md5: "f130032ca8fc855c9681e8e14e8f10df",
};

const uploadRes = {
  ETag: '"f130032ca8fc855c9687e8e14e8f10df"',
  Location:
    "https://nestjs-restaurant-api.s3.amazonaws.com/resutrants/image1.jpeg",
  key: "restaurants/image1.jpeg",
  Key: "restaurants/image1.jpeg",
  Bucket: "nestjs-restaurant-api",
};

jest.mock("aws-sdk", () => {
  return {
    S3: jest.fn(() => ({
      upload: jest.fn().mockReturnThis(),
      promise: jest.fn().mockResolvedValueOnce(uploadRes),
    })),
  };
});

describe("aws-sdk", () => {
  it("should upload file to AWS S3", async () => {
    const s3Service = new S3Service();
    const response = await s3Service.upload(mockFile);
    // console.log(response);

    expect(response).toBeDefined();
    expect(response).toBe(uploadRes);
  });
});
