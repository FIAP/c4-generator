#!/usr/bin/env node

const C4Generator = require('./src/c4-generator');
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
require('dotenv').config();

async function runDemo() {
  console.log(chalk.blue.bold('🎭 Demo do C4 Generator\n'));

  // Verificar API key
  if (!process.env.OPENAI_API_KEY) {
    console.log(chalk.red('❌ Configure a OPENAI_API_KEY primeiro!'));
    console.log(chalk.yellow('💡 cp env.example .env && edite o arquivo .env'));
    return;
  }

  const generator = new C4Generator(process.env.OPENAI_API_KEY);

  // Exemplos de diferentes tipos de sistemas
  const examples = [
    {
      name: 'E-commerce Platform',
      config: {
        projectName: 'E-commerce Platform',
        description: 'Plataforma moderna de e-commerce com catálogo de produtos, carrinho de compras, processamento de pagamentos, gestão de pedidos e sistema de recomendações',
        domain: 'e-commerce',
        technologies: 'React.js, Node.js, Express, PostgreSQL, Redis, AWS S3, Stripe',
        format: 'mermaid'
      },
      levels: ['context', 'container', 'component']
    },
    {
      name: 'Banking API',
      config: {
        projectName: 'Banking API',
        description: 'API robusta para operações bancárias incluindo transferências, pagamentos, gestão de contas, histórico de transações e compliance',
        domain: 'fintech',
        technologies: 'Java, Spring Boot, PostgreSQL, Apache Kafka, Redis, Docker',
        format: 'mermaid'
      },
      levels: ['context', 'container']
    },
    {
      name: 'Healthcare Management',
      config: {
        projectName: 'Healthcare Management System',
        description: 'Sistema completo de gestão hospitalar com prontuários eletrônicos, agendamento de consultas, gestão de leitos e integração com laboratórios',
        domain: 'healthcare',
        technologies: 'Python, Django, PostgreSQL, Redis, FHIR, HL7',
        format: 'mermaid'
      },
      levels: ['context', 'container']
    }
  ];

  console.log(chalk.green('📚 Exemplos disponíveis:'));
  examples.forEach((ex, i) => {
    console.log(chalk.blue(`${i + 1}. ${ex.name} (${ex.config.domain})`));
  });

  console.log(chalk.yellow('\n🚀 Gerando todos os exemplos...\n'));

  for (const [index, example] of examples.entries()) {
    console.log(chalk.cyan(`\n🏗️  Processando: ${example.name}`));
    
    try {
      const outputDir = path.join('./demo-output', example.config.projectName.toLowerCase().replace(/\s+/g, '-'));
      await fs.ensureDir(outputDir);

      const results = {};

      for (const level of example.levels) {
        console.log(chalk.blue(`  📋 Gerando ${level}...`));
        
        const result = await generator.generateLevel(level, {
          ...example.config,
          previousResults: results
        });

        results[level] = result;

        // Salvar arquivo
        const filename = `${example.config.projectName.toLowerCase().replace(/\s+/g, '-')}-${level}.mmd`;
        const filepath = path.join(outputDir, filename);
        await fs.writeFile(filepath, result.code);

        console.log(chalk.green(`  ✅ ${filename} salvo (${result.tokens} tokens)`));
      }

      // Gerar README do exemplo
      const readme = generator.generateReadme(example.config, results);
      await fs.writeFile(path.join(outputDir, 'README.md'), readme);

      console.log(chalk.green(`  📖 README.md criado`));
      console.log(chalk.gray(`  📁 Localização: ${outputDir}`));

    } catch (error) {
      console.log(chalk.red(`  ❌ Erro: ${error.message}`));
    }
  }

  console.log(chalk.green.bold('\n🎉 Demo concluída!'));
  console.log(chalk.blue('\n📁 Arquivos gerados em ./demo-output/'));
  console.log(chalk.yellow('💡 Visualize os diagramas em: https://mermaid.live/'));
  
  // Mostrar resumo
  console.log(chalk.cyan('\n📊 Resumo dos exemplos gerados:'));
  console.log(chalk.gray('├── e-commerce-platform/'));
  console.log(chalk.gray('│   ├── README.md'));
  console.log(chalk.gray('│   ├── e-commerce-platform-context.mmd'));
  console.log(chalk.gray('│   ├── e-commerce-platform-container.mmd'));
  console.log(chalk.gray('│   └── e-commerce-platform-component.mmd'));
  console.log(chalk.gray('├── banking-api/'));
  console.log(chalk.gray('│   ├── README.md'));
  console.log(chalk.gray('│   ├── banking-api-context.mmd'));
  console.log(chalk.gray('│   └── banking-api-container.mmd'));
  console.log(chalk.gray('└── healthcare-management-system/'));
  console.log(chalk.gray('    ├── README.md'));
  console.log(chalk.gray('    ├── healthcare-management-system-context.mmd'));
  console.log(chalk.gray('    └── healthcare-management-system-container.mmd'));
}

// Executar demo se chamado diretamente
if (require.main === module) {
  runDemo().catch(error => {
    console.error(chalk.red('\n❌ Erro na demo:', error.message));
    process.exit(1);
  });
}

module.exports = { runDemo }; 