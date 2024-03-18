import { config } from "dotenv";
import { createApp } from "./app";

(async () => {
  config();

  const app = await createApp();

  const PORT = process.env.NODE_PORT;

  app.listen(PORT, () =>
    console.log(`Server running on ${process.env.HOST_URL}:${PORT}`)
  );
})();
