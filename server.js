const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const livroRoutes = require('./routes/livroRoutes');
const autorRoutes = require('./routes/autorRoutes');
const errorHandler = require('./middlewares/errorMiddleware');
const seedUsuarios = require('./scripts/seedUsuarios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/livros', livroRoutes);
app.use('/api/v1/autores', autorRoutes);

app.use(errorHandler);

async function iniciar() {
  await seedUsuarios();
  app.listen(PORT, () => {
    console.log(`Livraria API rodando em http://localhost:${PORT}`);
  });
}

iniciar().catch(error => {
  console.error('Falha ao iniciar a API:', error);
  process.exit(1);
});
