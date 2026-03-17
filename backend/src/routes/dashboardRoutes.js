import express from "express"
import * as dashboardController from "../controllers/dashboardController.js"

const router = express.Router()

router.get("/:idusuario/estatisticas", dashboardController.getEstatisticas);
router.get("/:idusuario/perguntas-por-dia", dashboardController.getPerguntasPorDia);
router.get("/:idusuario/arquivos-mais-usados", dashboardController.getArquivosMaisUsados);
router.get("/:idusuario/perguntas-recentes", dashboardController.getPerguntasRecentes);



export default router