import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import getRoutes from "./routes/get_routes.js";
import postRoutes from "./routes/post_routes.js";
import putRoutes from "./routes/put_routes.js";
import deleteRoutes from "./routes/delete_routes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", getRoutes);
app.use("/api", postRoutes);
app.use("/api", putRoutes);
app.use("/api", deleteRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
