import express from 'express';
import ClientRoutes from './adapters/controllers/client.routes';

const app = express();
app.use(express.json());
app.use('/api/clients', ClientRoutes);

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));