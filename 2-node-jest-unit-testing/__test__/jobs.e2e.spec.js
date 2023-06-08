import request from "supertest";
import { connectDatabase, closeDatabase } from "./db-handler";
import app from "../app";

let jwtToken = "";
let jobCreated = "";

const newJob = {
  title: "Node Developer",
  description:
    "Must be a full-stack developer, able to implement everything in a MEAN or MERN stack paradigm (MongoDB, Express, Angular and/or React, and Node.js).",
  email: "employeer1@gmail.com",
  address: "651 Rr 2 Oquawka, IL, 61469",
  company: " Knack Ltd",
  industry: [],
  positions: 2,
  salary: 15500,
};

beforeAll(async () => {
  await connectDatabase();

  const res = await request(app).post("/api/v1/register").send({
    name: "Test User",
    email: "test@gmail.com",
    password: "12345678",
  });

  jwtToken = res.body.token;
});

afterAll(async () => await closeDatabase());

describe("Jobs (e2e)", () => {
  describe("(Get) - Get all Jobs", () => {
    it("Should get all jobs", async () => {
      const res = await request(app).get("/api/v1/jobs");

      expect(res.statusCode).toBe(200);
      expect(res.body.jobs).toBeInstanceOf(Array);
    });
  });

  describe("(Post) - Create new Job", () => {
    it("Should throw validation error", async () => {
      const res = await request(app)
        .post("/api/v1/job/new")
        .set("Authorization", "Bearer " + jwtToken)
        .send({
          title: "PHP Developer",
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.err).toBe("Please enter all values");
    });

    it("Should create a new job", async () => {
      const res = await request(app)
        .post("/api/v1/job/new")
        .set("Authorization", "Bearer " + jwtToken)
        .send(newJob);

      expect(res.statusCode).toBe(201);
      expect(res.body.job).toMatchObject(newJob);
      expect(res.body.job._id).toBeDefined();

      jobCreated = res.body.job;
    });
  });

  describe("(Get) - Get a job by id", () => {
    it("Should get job by id", async () => {
      const res = await request(app).get(`/api/v1/job/${jobCreated._id}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.job).toMatchObject(jobCreated);
    });

    it("Should throw not found error", async () => {
      const res = await request(app).get(`/api/v1/job/63791e5c8a3aw2ab2b6f321`);

      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe("Job not found");
    });

    it("Should throw not found error", async () => {
      const res = await request(app).get(`/api/v1/job/invalid_id`);

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Please enter correct id");
    });
  });

  describe("(Put) - Update a job", () => {
    it("Should throw not found error", async () => {
      const res = await request(app)
        .set("Authorization", "Bearer " + jwtToken)
        .put(`/api/v1/job/63791e5c8a3aw2ab2b6f321`);

      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe("Job not found");
    });

    it("Should update the job by id", async () => {
      const res = await request(app)
        .set("Authorization", "Bearer " + jwtToken)
        .put(`/api/v1/job/${jobCreated._id}`)
        .send({
          title: "Updated name",
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.job.title).toBe("Updated name");
    });
  });

  describe("(Delete) - Delete a job", () => {
    it("Should throw not found error", async () => {
      const res = await request(app)
        .set("Authorization", "Bearer " + jwtToken)
        .delete(`/api/v1/job/63791e5c8a3aw2ab2b6f321`);

      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe("Job not found");
    });

    it("Should delete the job by id", async () => {
      const res = await request(app)
        .set("Authorization", "Bearer " + jwtToken)
        .delete(`/api/v1/job/${jobCreated._id}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.job._id).toBe(jobCreated._id);
    });
  });
});
