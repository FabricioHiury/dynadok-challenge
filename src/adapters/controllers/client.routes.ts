import { Router } from "express";
import { ClientController } from "./ClientController";
import { validateCreateClient, validateId, validateUpdateClient } from "../middlewares/validation";

const ClientRoutes = Router();
const clientController = new ClientController();

ClientRoutes.post("/", validateCreateClient, (req, res) =>
  clientController.create(req, res)
);

ClientRoutes.put("/:id", validateId, validateUpdateClient, (req, res) =>
  clientController.update(req, res)
);

ClientRoutes.get("/:id", validateId, (req, res) =>
  clientController.findById(req, res)
);

ClientRoutes.get("/", (req, res) =>
  clientController.findAll(req, res)
);

export default ClientRoutes;
