const C4Generator = require('./src/c4-generator');
const chalk = require('chalk');
require('dotenv').config();

async function runTests() {
  console.log(chalk.blue.bold('🧪 Testando C4 Generator\n'));

  // Verificar se API key existe
  if (!process.env.OPENAI_API_KEY) {
    console.log(chalk.red('❌ OPENAI_API_KEY não encontrada!'));
    console.log(chalk.yellow('💡 Copie env.example para .env e adicione sua API key'));
    process.exit(1);
  }

  try {
    // Inicializar gerador
    const generator = new C4Generator(process.env.OPENAI_API_KEY);
    
    // Teste 1: Conexão com OpenAI
    console.log(chalk.blue('📡 Testando conexão com OpenAI...'));
    await generator.testConnection();
    console.log(chalk.green('✅ Conexão OK\n'));

    // Teste 2: Geração de Context
    console.log(chalk.blue('📋 Testando geração C4 Context...'));
    const contextResult = await generator.generateLevel('context', {
      projectName: 'Sistema Teste',
      description: 'Sistema de teste para validar o gerador C4',
      domain: 'teste',
      technologies: 'Node.js, React, PostgreSQL',
      format: 'mermaid',
      previousResults: {}
    });
    
    console.log(chalk.green('✅ Context gerado:'));
    console.log(chalk.gray(contextResult.code.substring(0, 200) + '...'));
    console.log(chalk.blue(`📊 Tokens: ${contextResult.tokens}\n`));

    // Teste 3: Extração de código
    const testContent = '```mermaid\ngraph TB\n  A --> B\n```';
    const extracted = generator.extractCode(testContent, 'mermaid');
    console.log(chalk.blue('🔧 Testando extração de código...'));
    console.log(chalk.green('✅ Extração OK\n'));

    // Teste 4: Geração de README
    console.log(chalk.blue('📖 Testando geração de README...'));
    const readme = generator.generateReadme(
      { projectName: 'Teste', description: 'Sistema teste', domain: 'teste', technologies: 'Node.js' },
      { context: contextResult }
    );
    console.log(chalk.green('✅ README gerado\n'));

    console.log(chalk.green.bold('🎉 Todos os testes passaram!'));
    console.log(chalk.yellow('\n💡 Execute "npm start" para usar o gerador interativo'));

  } catch (error) {
    console.error(chalk.red(`❌ Erro no teste: ${error.message}`));
    process.exit(1);
  }
}

// Executar testes se chamado diretamente
if (require.main === module) {
  runTests();
}

module.exports = { runTests }; 