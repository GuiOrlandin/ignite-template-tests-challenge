import request from "supertest";
import createConnections from "../../../../database";

import { Connection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;

describe("Create USer Controller", () => {
  beforeAll(async () => {
    connection = await createConnections();
    await connection.runMigrations();
  });

  it("should be able to create a new user", async () => {
    const response = await request(app).post("/api/v1/users").send({
      name: "User name",
      email: "admin@email.com.br",
      password: "admin",
    });

    expect(response.statusCode).toEqual(201);
  });

  it("should not be able to create a new user with name exists", async () => {
    const response = await request(app).post("/api/v1/users").send({
      name: "User name",
      email: "admin@email.com.br",
      password: "admin",
    });

    expect(response.statusCode).toEqual(400);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });
});
