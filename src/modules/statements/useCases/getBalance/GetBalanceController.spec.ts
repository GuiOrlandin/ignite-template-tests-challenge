import request from "supertest";
import createConnections from "../../../../database";

import { Connection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;

describe("Get Balance Controller", () => {
  beforeAll(async () => {
    connection = await createConnections();
    await connection.runMigrations();

    await request(app).post("/api/v1/users").send({
      name: "Guilherme",
      email: "guilherme@email.com.br",
      password: "admin",
    });
  });

  it("should be able to show Balance", async () => {
    const userAuthenticate = await request(app).post("/api/v1/sessions").send({
      email: "guilherme@email.com.br",
      password: "admin",
    });

    const { token } = userAuthenticate.body;

    await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 200,
        description: "Deposit",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 100,
        description: "Withdraw",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const response = await request(app)
      .get("/api/v1/statements/balance")
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("statement");
    expect(response.body).toHaveProperty("balance");
  });

  it("should not be able to show Balance with invalid token", async () => {
    const token = "invalidToken";

    await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 300,
        description: "Deposit",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const response = await request(app)
      .get("/api/v1/statements/balance")
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
