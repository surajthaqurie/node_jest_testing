import jwt from "jsonwebtoken";
import User from "../models/users";
import { isAuthenticatedUser } from "./auth";

const mockRequest = () => {
  return {
    headers: {
      authorization: "Bearer",
    },
  };
};

const mockResponse = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
});

const mockNext = jest.fn();

const mockUser = {
  _id: "6368dadd983d6c4b181e37c1",
  name: "Test user",
  email: "test@gmail.com",
  password: "hashedPassword",
};

describe("Authentication middleware", () => {
  it("Should throw missing authorization header error", async () => {
    const mockReq = (mockRequest().headers = { headers: {} });
    const mockRes = mockResponse();
    // const next = mockNext();

    await isAuthenticatedUser(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Missing Authorization header with Bearer token",
    });
  });

  it("Should throw missing JWT error", async () => {
    const mockReq = mockRequest();
    const mockRes = mockResponse();
    // const next = mockNext();

    await isAuthenticatedUser(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Authentication Failed",
    });
  });

  it("Should authenticate the user", async () => {
    jest.spyOn(jwt, "verify").mockResolvedValueOnce({ id: mockUser._id });
    jest.spyOn(User, "findById").mockResolvedValueOnce(mockUser);

    const mockReq = (mockRequest().headers = {
      headers: { authorization: "Bearer token" },
    });

    const mockRes = mockResponse();
    // const next = mockNext();

    await isAuthenticatedUser(mockReq, mockRes, mockNext);

    expect(mockNext).toBeCalledTimes(1);
  });
});
