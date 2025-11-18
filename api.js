import express from 'express';
import { sequelize, Medicos, Especialidades, Cidades } from './models/index.js';

const app = express();
const PORT = 3000;

app.use(express.json());

// -----------------------------
// 📌 HEALTH CHECK
// -----------------------------
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});


// =============================
// 📌 ROTAS DE CIDADES
// =============================

// CREATE
app.post('/cidades', async (req, res) => {
  try {
    const cidade = await Cidades.create(req.body);
    res.status(201).json(cidade);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// LIST ALL
app.get('/cidades', async (req, res) => {
  try {
    const cidades = await Cidades.findAll();
    res.status(200).json(cidades);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET BY ID
app.get('/cidades/:id', async (req, res) => {
  try {
    const cidade = await Cidades.findByPk(req.params.id);
    if (!cidade) return res.status(404).json({ error: "Cidade não encontrada" });
    res.status(200).json(cidade);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE
app.put('/cidades/:id', async (req, res) => {
  try {
    const cidade = await Cidades.findByPk(req.params.id);
    if (!cidade) return res.status(404).json({ error: "Cidade não encontrada" });

    await cidade.update(req.body);
    res.status(200).json(cidade);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE
app.delete('/cidades/:id', async (req, res) => {
  try {
    const cidade = await Cidades.findByPk(req.params.id);
    if (!cidade) return res.status(404).json({ error: "Cidade não encontrada" });

    await cidade.destroy();
    res.status(200).json({ message: "Cidade deletada com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// =============================
// 📌 ROTAS DE ESPECIALIDADES
// =============================

// CREATE
app.post('/especialidades', async (req, res) => {
  try {
    const especialidade = await Especialidades.create(req.body);
    res.status(201).json(especialidade);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// LIST ALL
app.get('/especialidades', async (req, res) => {
  try {
    const especialidades = await Especialidades.findAll();
    res.status(200).json(especialidades);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET BY ID
app.get('/especialidades/:id', async (req, res) => {
  try {
    const especialidade = await Especialidades.findByPk(req.params.id);

    if (!especialidade)
      return res.status(404).json({ error: 'Especialidade não encontrada' });

    res.status(200).json(especialidade);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE
app.delete('/especialidades/:id', async (req, res) => {
  try {
    const especialidade = await Especialidades.findByPk(req.params.id);

    if (!especialidade)
      return res.status(404).json({ error: 'Especialidade não encontrada' });

    await especialidade.destroy();
    res.status(200).json({ message: 'Especialidade deletada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// =============================
// 📌 ROTAS DE MÉDICOS
// =============================

// CREATE
app.post('/medicos', async (req, res) => {
  try {
    const medico = await Medicos.create(req.body);
    res.status(201).json(medico);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// LIST ALL + INCLUDES
app.get('/medicos', async (req, res) => {
  try {
    const medicos = await Medicos.findAll({
      include: [
        { model: Especialidades, as: 'especialidade' },
        { model: Cidades, as: 'cidade' }
      ]
    });
    res.status(200).json(medicos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET BY ID
app.get('/medicos/:id', async (req, res) => {
  try {
    const medico = await Medicos.findByPk(req.params.id, {
      include: [
        { model: Especialidades, as: 'especialidade' },
        { model: Cidades, as: 'cidade' }
      ]
    });

    if (!medico)
      return res.status(404).json({ error: 'Médico não encontrado' });

    res.status(200).json(medico);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE
app.delete('/medicos/:id', async (req, res) => {
  try {
    const medico = await Medicos.findByPk(req.params.id);
    if (!medico)
      return res.status(404).json({ error: 'Médico não encontrado' });

    await medico.destroy();
    res.status(200).json({ message: 'Médico deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/buscar-medicos', async (req, res) => {
  try {
    const { cidadeId, especialidadeId } = req.query;

    // Montagem dos filtros
    const filtros = {};
    if (cidadeId) filtros.cidadeId = cidadeId;
    if (especialidadeId) filtros.especialidadeId = especialidadeId;

    const medicos = await Medicos.findAll({
      where: filtros,
      include: [
        { model: Especialidades, as: 'especialidade' },
        { model: Cidades, as: 'cidade' }
      ]
    });

    res.status(200).json(medicos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar médicos" });
  }
});

// =============================
// 📌 INICIAR SERVIDOR
// =============================

sequelize.sync()
  .then(() => {
    console.log("Banco de dados sincronizado");
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Erro ao sincronizar banco de dados:", error);
  });
