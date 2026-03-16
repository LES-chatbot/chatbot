import { Router } from "express";
import * as mensagemController from "../controllers/mensagemController.js";

const router = Router();

router.post("/", mensagemController.enviar);

router.get("/:idconversa", mensagemController.listar);

router.delete("/:id", mensagemController.deletar);

export default router;