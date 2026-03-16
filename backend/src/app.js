import express from "express"
import cors from "cors"
import usuarioRoutes from "./routes/usuarioRoutes.js"
import documentoRouter from "./routes/documentoRoutes.js"
import mensagemRoutes from "./routes/mensagemRoutes.js"
import conversaRoutes from "./routes/conversaRoutes.js"
import dashboardRoutes from "./routes/dashboardRoutes.js" 
import respostaRoutes from "./routes/respostaRoute.js" 

const app = express()

app.use(cors())
app.use(express.json())

// Rotas
app.use("/conversas", conversaRoutes)
app.use("/mensagens", mensagemRoutes)
app.use("/usuarios", usuarioRoutes)
app.use("/documentos", documentoRouter)
app.use("/dashboard", dashboardRoutes) 
app.use("/respostas", respostaRoutes) 

export default app