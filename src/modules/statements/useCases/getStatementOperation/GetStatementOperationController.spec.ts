import request from "supertest";
import createConnections from "../../../../database";

import { Connection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;

describe("Get statement operation Controller", () => {
  beforeAll(async () => {
    connection = await createConnections();
    await connection.runMigrations();

    await request(app).post("/api/v1/users").send({
      name: "Guilherme",
      email: "guilherme@email.com.br",
      password: "admin",
    });
  });

  it("should be able to get  deposit operation", async () => {
    const userAuthenticate = await request(app).post("/api/v1/sessions").send({
      email: "guilherme@email.com.br",
      password: "admin",
    });

    const { token } = userAuthenticate.body;

    const deposit = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 200,
        description: "Deposit",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const response = await request(app)
      .get(`/api/v1/statements/${deposit.body.id}`)
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("user_id");
    expect(response.body).toHaveProperty("amount");
    expect(response.body).toHaveProperty("type");
    expect(response.body.type).toBe("deposit");
  });

  it("should be able to get withdraw operation", async () => {
    const userAuthenticate = await request(app).post("/api/v1/sessions").send({
      email: "guilherme@email.com.br",
      password: "admin",
    });

    const { token } = userAuthenticate.body;

    const deposit = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 200,
        description: "Withdraw",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const response = await request(app)
      .get(`/api/v1/statements/${deposit.body.id}`)
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("user_id");
    expect(response.body).toHaveProperty("amount");
    expect(response.body).toHaveProperty("type");
    expect(response.body.type).toBe("withdraw");
  });

  it("should not be able to get statement operation with invalid token", async () => {
    const token = "invalidToken";

    const deposit = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 200,
        description: "Withdraw",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const response = await request(app)
      .get(`/api/v1/statements/${deposit.body.id}`)
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
