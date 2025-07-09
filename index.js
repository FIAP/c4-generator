#!/usr/bin/env node

const { program } = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
require('dotenv').config();

const C4Generator = require('./src/c4-generator');

// Configurar CLI
program
  .name('c4-generator')
  .description('Gerador de diagramas C4 usando OpenAI GPT')
  .version('1.0.0');

// Comando principal
program
  .command('generate')
  .alias('g')
  .description('Gerar diagramas C4 interativamente')
  .option('-p, --project <name>', 'Nome do projeto')
  .option('-o, --output <dir>', 'Diretório de saída', './output')
  .action(async (options) => {
    try {
      console.log(chalk.blue.bold('\n🏗️  C4 Architecture Generator\n'));
      
      // Verificar API Key
      if (!process.env.OPENAI_API_KEY) {
        console.log(chalk.red('❌ OPENAI_API_KEY não encontrada!'));
        console.log(chalk.yellow('💡 Crie um arquivo .env com: OPENAI_API_KEY=sua_chave_aqui'));
        process.exit(1);
      }

      // Inicializar gerador
      const generator = new C4Generator(process.env.OPENAI_API_KEY);

      // Coletar informações do projeto
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'projectName',
          message: 'Nome do projeto:',
          default: options.project || 'MeuSistema',
          validate: (input) => input.length > 0 || 'Nome é obrigatório'
        },
        {
          type: 'input',
          name: 'description',
          message: 'Descrição do sistema:',
          validate: (input) => input.length > 10 || 'Descrição deve ter pelo menos 10 caracteres'
        },
        {
          type: 'input',
          name: 'domain',
          message: 'Domínio/setor (ex: e-commerce, fintech, saúde):',
          default: 'web application'
        },
        {
          type: 'input',
          name: 'technologies',
          message: 'Tecnologias principais (ex: React, Node.js, PostgreSQL):',
          default: 'React, Node.js, PostgreSQL'
        },
        {
          type: 'checkbox',
          name: 'levels',
          message: 'Quais níveis C4 gerar?',
          choices: [
            { name: '1. Context (Contexto)', value: 'context', checked: true },
            { name: '2. Container (Contêineres)', value: 'container', checked: true },
            { name: '3. Component (Componentes)', value: 'component', checked: true },
            { name: '4. Code (Código)', value: 'code', checked: false }
          ],
          validate: (choices) => choices.length > 0 || 'Selecione pelo menos um nível'
        },
        {
          type: 'list',
          name: 'format',
          message: 'Formato de saída:',
          choices: [
            { name: 'Mermaid (recomendado)', value: 'mermaid' },
            { name: 'PlantUML', value: 'plantuml' },
            { name: 'Structurizr DSL', value: 'structurizr' }
          ],
          default: 'mermaid'
        }
      ]);

      // Criar diretório de saída
      const outputDir = path.resolve(options.output);
      await fs.ensureDir(outputDir);

      console.log(chalk.green('\n🚀 Gerando diagramas C4...\n'));

      // Gerar cada nível selecionado
      const results = {};
      
      for (const level of answers.levels) {
        console.log(chalk.blue(`📋 Gerando nível: ${level.toUpperCase()}`));
        
        try {
          const result = await generator.generateLevel(level, {
            projectName: answers.projectName,
            description: answers.description,
            domain: answers.domain,
            technologies: answers.technologies,
            format: answers.format,
            previousResults: results
          });

          results[level] = result;
          
          // Salvar arquivo
          const filename = `${answers.projectName.toLowerCase().replace(/\s+/g, '-')}-${level}.${answers.format === 'mermaid' ? 'mmd' : answers.format === 'plantuml' ? 'puml' : 'dsl'}`;
          const filepath = path.join(outputDir, filename);
          
          await fs.writeFile(filepath, result.code);
          
          console.log(chalk.green(`✅ ${level} salvo em: ${filepath}`));
          
        } catch (error) {
          console.log(chalk.red(`❌ Erro ao gerar ${level}: ${error.message}`));
        }
      }

      // Gerar README
      const readmePath = path.join(outputDir, 'README.md');
      const readme = generator.generateReadme(answers, results);
      await fs.writeFile(readmePath, readme);

      console.log(chalk.green.bold('\n✅ Geração concluída com sucesso!'));
      console.log(chalk.blue(`📁 Arquivos salvos em: ${outputDir}`));
      console.log(chalk.yellow('💡 Para visualizar diagramas Mermaid: https://mermaid.live/'));

    } catch (error) {
      console.error(chalk.red('\n❌ Erro:', error.message));
      process.exit(1);
    }
  });

// Comando de exemplo
program
  .command('example')
  .description('Gerar exemplo de sistema e-commerce')
  .action(async () => {
    try {
      console.log(chalk.blue.bold('\n📚 Gerando exemplo: Sistema E-commerce\n'));
      
      const generator = new C4Generator(process.env.OPENAI_API_KEY);
      
      const exampleConfig = {
        projectName: 'E-commerce Platform',
        description: 'Sistema de e-commerce moderno com catálogo de produtos, carrinho de compras, processamento de pagamentos e gestão de pedidos',
        domain: 'e-commerce',
        technologies: 'React.js, Node.js, Express, PostgreSQL, Redis, AWS S3',
        format: 'mermaid'
      };

      const outputDir = './example-output';
      await fs.ensureDir(outputDir);

      const levels = ['context', 'container', 'component'];
      const results = {};

      for (const level of levels) {
        console.log(chalk.blue(`📋 Gerando exemplo: ${level}`));
        
        const result = await generator.generateLevel(level, {
          ...exampleConfig,
          previousResults: results
        });

        results[level] = result;

        const filename = `ecommerce-${level}.mmd`;
        const filepath = path.join(outputDir, filename);
        await fs.writeFile(filepath, result.code);
        
        console.log(chalk.green(`✅ ${filename} criado`));
      }

      console.log(chalk.green.bold('\n✅ Exemplo gerado com sucesso!'));
      console.log(chalk.blue(`📁 Arquivos em: ${outputDir}`));

    } catch (error) {
      console.error(chalk.red('❌ Erro:', error.message));
    }
  });

// Executar CLI
if (require.main === module) {
  program.parse();
}

module.exports = { program }; 