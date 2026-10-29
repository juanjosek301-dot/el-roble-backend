import "dotenv/config";
import { createApp } from "./interface/http/app.js";

const port = Number(process.env.PORT ?? 3001);
const app = createApp();

app.listen(port, "0.0.0.0", () => {
  console.info(`API de El Roble escuchando en http://localhost:${port}`);
});
