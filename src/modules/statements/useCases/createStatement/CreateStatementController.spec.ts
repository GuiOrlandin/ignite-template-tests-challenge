import request from "supertest";
import createConnections from "../../../../database";

import { Connection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;

describe("Create Statement Controller", () => {
  beforeAll(async () => {
    connection = await createConnections();
    await connection.runMigrations();

    await request(app).post("/api/v1/users").send({
      name: "Guilherme",
      email: "guilherme@email.com.br",
      password: "admin",
    });
  });

  it("should be able to create deposit", async () => {
    const userAuthenticate = await request(app).post("/api/v1/sessions").send({
      email: "guilherme@email.com.br",
      password: "admin",
    });

    const { token } = userAuthenticate.body;

    const response = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 200,
        description: "Deposit",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("user_id");
    expect(response.body).toHaveProperty("amount");
    expect(response.body.type).toBe("deposit");
  });

  it("should be able to create withdraw", async () => {
    const userAuthenticate = await request(app).post("/api/v1/sessions").send({
      email: "guilherme@email.com.br",
      password: "admin",
    });

    const { token } = userAuthenticate.body;

    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 200,
        description: "Withdraw",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("user_id");
    expect(response.body).toHaveProperty("amount");
    expect(response.body.type).toBe("withdraw");
  });

  it("should not be able to create statement with account without credit", async () => {
    const userAuthenticate = await request(app).post("/api/v1/sessions").send({
      email: "guilherme@email.com.br",
      password: "admin",
    });

    const { token } = userAuthenticate.body;

    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 200,
        description: "Withdraw",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.statusCode).toBe(400);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });
});
