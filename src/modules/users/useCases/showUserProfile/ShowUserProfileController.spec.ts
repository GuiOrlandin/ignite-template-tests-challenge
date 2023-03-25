import request from "supertest";
import createConnections from "../../../../database";

import { v4 as uuid } from "uuid";
import { hash } from "bcryptjs";

import { Connection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;

describe("Show user profile Controller", () => {
  beforeAll(async () => {
    connection = await createConnections();
    await connection.runMigrations();
  });

  it("should be able to show user profile", async () => {
    await request(app).post("/api/v1/users").send({
      name: "Guilherme",
      email: "guilherme@email.com.br",
      password: "admin",
    });
    const userAuthenticate = await request(app).post("/api/v1/sessions").send({
      email: "guilherme@email.com.br",
      password: "admin",
    });

    const { token } = userAuthenticate.body;

    const response = await request(app)
      .get("/api/v1/profile")
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.statusCode).toBe(200);
  });

  it("should not be able to show user profile with invalid token", async () => {
    const token = "invalidToken";

    const response = await request(app)
      .get("/api/v1/profile")
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.statusCode).toBe(401);
  });

  it("should not be able to show user profile with unauthenticated user", async () => {
    const userAuthenticate = await request(app).post("/api/v1/sessions").send({
      email: "incorrectemail@email.com.br",
      password: "incorrectpassword",
    });

    const { token } = userAuthenticate.body;

    const response = await request(app)
      .get("/api/v1/profile")
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.statusCode).toBe(401);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });
});
