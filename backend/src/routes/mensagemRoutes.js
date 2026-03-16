import express from "express";
import * as mensagemController from "../controllers/mensagemController.js";

const router = express.Router();

router.post("/", mensagemController.enviar);
router.get("/:idconversa", mensagemController.listar);

export default router;