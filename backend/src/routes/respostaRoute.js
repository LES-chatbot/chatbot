import express from "express";
import * as respostaController from "../controllers/respostaController.js";

const router = express.Router();

router.get("/:idconversa", respostaController.listarRespostas);

export default router;