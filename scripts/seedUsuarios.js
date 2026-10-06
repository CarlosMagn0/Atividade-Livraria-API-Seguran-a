const bcrypt = require('bcrypt');
const repository = require('../repositories/LivrariaRepository');

const SALT_ROUNDS = 10;

async function seedUsuarios() {
  const db = repository.carregar();
  const credenciais = [
    { nome: 'Admin', email: 'admin@livraria.com', senha: 'admin123', role: 'ADMIN' },
    { nome: 'Leitor', email: 'leitor@gmail.com', senha: 'leitor123', role: 'USER' }
  ];

  for (const credencial of credenciais) {
    let usuario = db.usuarios.find(u => u.email.toLowerCase() === credencial.email);
    const hashAtualValido = usuario && await bcrypt.compare(credencial.senha, usuario.senha_hash).catch(() => false);

    if (!usuario) {
      usuario = { id: Date.now() + db.usuarios.length, nome: credencial.nome, email: credencial.email };
      db.usuarios.push(usuario);
    }

    usuario.nome = credencial.nome;
    usuario.role = credencial.role;
    if (!hashAtualValido) {
      usuario.senha_hash = await bcrypt.hash(credencial.senha, SALT_ROUNDS);
    }
  }

  repository.salvar(db);
}

if (require.main === module) {
  seedUsuarios()
    .then(() => console.log('Usuários de laboratório configurados com BCrypt.'))
    .catch(err => { console.error(err); process.exit(1); });
}

module.exports = seedUsuarios;
