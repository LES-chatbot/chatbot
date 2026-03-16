import { Router } from "express";
import * as conversaController from "../controllers/conversaController.js";

const router = Router();

router.post("/", conversaController.criar);
router.get("/usuario/:idusuario", conversaController.listar);
router.get("/:id", conversaController.obter);
router.delete("/:id", conversaController.remover);

export default router;