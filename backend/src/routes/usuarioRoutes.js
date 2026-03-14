import express from "express";
import * as usuarioController from "../controllers/usuarioController.js";

const router = express.Router();

router.post("/login", usuarioController.login);
router.post("/cadastro", usuarioController.cadastrar);
router.put("/redefinir-senha", usuarioController.redefinirSenha);

export default router;
