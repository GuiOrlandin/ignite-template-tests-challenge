import { Router } from "express";

import { CreateStatementController } from "../modules/statements/useCases/createStatement/CreateStatementController";
import { GetBalanceController } from "../modules/statements/useCases/getBalance/GetBalanceController";
import { GetStatementOperationController } from "../modules/statements/useCases/getStatementOperation/GetStatementOperationController";
import { ensureAuthenticated } from "../shared/infra/http/middlwares/ensureAuthenticated";
import { CreateTransferStatementController } from "../modules/statements/useCases/createTransferStatement/CreateTransferStatementController";

const statementRouter = Router();
const getBalanceController = new GetBalanceController();
const createStatementController = new CreateStatementController();
const createTransferStatementController =
  new CreateTransferStatementController();
const getStatementOperationController = new GetStatementOperationController();

statementRouter.use(ensureAuthenticated);

statementRouter.get("/balance", getBalanceController.execute);
statementRouter.post("/deposit", createStatementController.execute);
statementRouter.post("/withdraw", createStatementController.execute);
statementRouter.post(
  "/transfer/:receiver_id",
  createTransferStatementController.execute
);
statementRouter.get("/:statement_id", getStatementOperationController.execute);

export { statementRouter };
