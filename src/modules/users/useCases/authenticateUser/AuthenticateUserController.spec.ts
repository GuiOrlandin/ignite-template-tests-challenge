import request from "supertest";
import createConnections from "../../../../database";

import { v4 as uuid } from "uuid";
import { hash } from "bcryptjs";

import { Connection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;

describe("Authenticate User Controller", () => {
  beforeAll(async () => {
    connection = await createConnections();
    await connection.runMigrations();
  });

  it("should be able to authenticate user", async () => {
    await request(app).post("/api/v1/users").send({
      name: "User name",
      email: "admin@email.com.br",
      password: "admin",
    });

    const response = await request(app).post("/api/v1/sessions").send({
      email: "admin@email.com.br",
      password: "admin",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  it("should not be able to authenticate user with wrong email", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "email.com.br",
      password: "admin",
    });

    expect(response.status).toBe(401);
  });

  it("should not be able to authenticate user with wrong password", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "admin@email.com.br",
      password: "wrongpassword",
    });

    expect(response.status).toBe(401);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });
});
