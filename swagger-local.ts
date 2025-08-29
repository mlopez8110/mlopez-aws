import express from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";

// Cargar el archivo swagger.yml desde la raíz del proyecto
const swaggerDocument = YAML.load(path.join(__dirname, "swagger.yml"));

const app = express();

// Ruta de la documentación Swagger
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Levantar servidor en un puerto distinto al offline
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`📚 Swagger UI disponible en: http://localhost:${PORT}/docs`);
});
