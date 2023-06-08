import request from "supertest";
import { connectDatabase, closeDatabase } from "./db-handler";
import app from "../app";

beforeAll(async () => await connectDatabase());

afterAll(async () => await closeDatabase());

describe("Auth (e2e)", () => {
  describe("(Post) - Register User", () => {
    it("Should throw validation error", async () => {
      const res = await request(app).post("/api/v1/register").send({
        name: "Test User",
        email: "test@gmail.com",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Please enter all values");
    });

    it("Should request the user", async () => {
      const res = await request(app).post("/api/v1/register").send({
        name: "Test User",
        email: "test@gmail.com",
        password: "12345678",
      });

      expect(res.statusCode).toBe(201);
      expect(res.body.token).toBeDefined();
    });

    it("Should request the user", async () => {
      const res = await request(app).post("/api/v1/register").send({
        name: "Test User",
        email: "test@gmail.com",
        password: "12345678",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Duplicate email");
    });
  });

  describe("(Post) - Login User", () => {
    it("Should throw missing email or password error", async () => {
      const res = await request(app).post("/api/v1/login").send({
        email: "test@gmail.com",
      });
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Please enter & Password");

    it("Should throw invalid email or password error", async () => {
      const res = await request(app).post("/api/v1/login").send({
        email: "test@gmail.com",
        password: "123456",
      });

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe("Invalid Email or Password");
    });

    it("Should login user", async () => {
      const res = await request(app).post("/api/v1/login").send({
        email: "test@gmail.com",
        password: "12345678",
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.token).toBeDefined();
    });
  });

  describe("(404) - Route not found", () => {
    it("Should throw route not found error", async () => {
      const res = await request(app).post("/api/v1/notFound");
      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe("Route not found");
    });
  });
});
