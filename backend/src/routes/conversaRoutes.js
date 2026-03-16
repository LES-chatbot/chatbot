import express from "express";
import * as conversaController from "../controllers/conversaController.js";

const router = express.Router();

router.post("/", conversaController.criar);
router.get("/:idusuario", conversaController.listar);
router.get("/conversa/:idconversa", conversaController.buscar);
router.put("/:idconversa", conversaController.atualizar);
router.delete("/:idconversa", conversaController.deletar);
router.post("/iniciar-nova", conversaController.iniciarNova);

export default router;