const OpenAI = require('openai');

class C4Generator {
  constructor(apiKey) {
    this.openai = new OpenAI({
      apiKey: apiKey
    });
  }

  // Prompts específicos para cada nível C4
  getPrompts() {
    return {
      context: {
        system: `Você é um especialista em arquitetura de software e modelo C4. 
        Crie um diagrama C4 Context (Nível 1) que mostra o sistema principal e seus relacionamentos com usuários e sistemas externos.
        
        Regras:
        - Use apenas atores principais (pessoas) e sistemas externos
        - Não inclua detalhes técnicos internos
        - Foque na visão de negócio
        - Seja claro e conciso`,
        
        user: (config) => `
        Crie um diagrama C4 Context em formato ${config.format} para:
        
        **Sistema:** ${config.projectName}
        **Descrição:** ${config.description}
        **Domínio:** ${config.domain}
        **Tecnologias:** ${config.technologies}
        
        Inclua:
        - Principais usuários/atores
        - Sistema principal
        - Sistemas externos relevantes
        - Relacionamentos básicos
        
                 ${config.format === 'mermaid' ? 
           'Use sintaxe Mermaid (graph TB). IMPORTANTE: Use aspas duplas em todos os nós: ["Texto"]. Subgrafos devem ter aspas: subgraph "Nome". Não use estilos CSS.' : 
           config.format === 'plantuml' ? 
           'Use sintaxe PlantUML com @startuml/@enduml.' :
           'Use sintaxe Structurizr DSL com workspace.'
         }
        
        Responda APENAS com o código do diagrama, sem explicações.`
      },

      container: {
        system: `Você é um especialista em arquitetura de software e modelo C4.
        Crie um diagrama C4 Container (Nível 2) que mostra os principais contêineres tecnológicos do sistema.
        
        Regras:
        - Mostre aplicações, APIs, bancos de dados, etc.
        - Inclua tecnologias específicas
        - Mostre comunicação entre contêineres
        - Mantenha foco na arquitetura técnica`,
        
        user: (config) => `
        Crie um diagrama C4 Container em formato ${config.format} para:
        
        **Sistema:** ${config.projectName}
        **Descrição:** ${config.description}
        **Tecnologias:** ${config.technologies}
        
        ${config.previousResults?.context ? 
          `\n**Contexto anterior:**\n${config.previousResults.context.description}` : ''
        }
        
        Inclua:
        - Aplicações web/mobile
        - APIs e serviços
        - Bancos de dados
        - Sistemas de cache
        - File storage
        - Comunicação entre contêineres
        
        Use as tecnologias mencionadas: ${config.technologies}
        
        Responda APENAS com o código do diagrama, sem explicações.`
      },

      component: {
        system: `Você é um especialista em arquitetura de software e modelo C4.
        Crie um diagrama C4 Component (Nível 3) que mostra os principais componentes internos de um contêiner.
        
        Regras:
        - Foque no contêiner principal (API/Backend)
        - Mostre controllers, services, repositories
        - Inclua padrões arquiteturais (MVC, DDD)
        - Mostre dependências entre componentes`,
        
        user: (config) => `
        Crie um diagrama C4 Component em formato ${config.format} para o backend/API principal de:
        
        **Sistema:** ${config.projectName}
        **Descrição:** ${config.description}
        **Tecnologias:** ${config.technologies}
        
        ${config.previousResults?.container ? 
          `\n**Contêineres existentes:**\n${config.previousResults.container.description}` : ''
        }
        
        Inclua componentes típicos:
        - Controllers (REST endpoints)
        - Services (lógica de negócio)
        - Repositories (acesso a dados)
        - Middleware (auth, validation)
        - External integrations
        
        Mostre o fluxo típico: Controller → Service → Repository
        
        Responda APENAS com o código do diagrama, sem explicações.`
      },

      code: {
        system: `Você é um especialista em desenvolvimento de software.
        Crie código detalhado para um componente específico do sistema.
        
        Regras:
        - Foque em um service/component principal
        - Inclua métodos essenciais
        - Use boas práticas de código
        - Inclua tratamento de erros`,
        
        user: (config) => `
        Crie código ${this.getTechnologyFromConfig(config.technologies)} para um service principal de:
        
        **Sistema:** ${config.projectName}
        **Descrição:** ${config.description}
        **Tecnologias:** ${config.technologies}
        
        ${config.previousResults?.component ? 
          `\n**Componentes existentes:**\n${config.previousResults.component.description}` : ''
        }
        
        Crie um service completo com:
        - Métodos CRUD principais
        - Validações de negócio
        - Tratamento de erros
        - Integração com repository
        - Documentação básica
        
        Use a tecnologia: ${this.getTechnologyFromConfig(config.technologies)}
        
        Responda APENAS com o código, sem explicações adicionais.`
      }
    };
  }

  // Extrair tecnologia principal para geração de código
  getTechnologyFromConfig(technologies) {
    const techs = technologies.toLowerCase();
    if (techs.includes('node.js') || techs.includes('javascript')) return 'Node.js/JavaScript';
    if (techs.includes('java') || techs.includes('spring')) return 'Java/Spring Boot';
    if (techs.includes('python') || techs.includes('django')) return 'Python/Django';
    if (techs.includes('c#') || techs.includes('.net')) return 'C#/.NET';
    if (techs.includes('go') || techs.includes('golang')) return 'Go';
    return 'JavaScript'; // fallback
  }

  // Gerar um nível específico do C4
  async generateLevel(level, config) {
    try {
      const prompts = this.getPrompts();
      const prompt = prompts[level];
      
      if (!prompt) {
        throw new Error(`Nível C4 '${level}' não suportado`);
      }

      console.log(`🤖 Enviando prompt para OpenAI (${level})...`);

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: prompt.system
          },
          {
            role: "user", 
            content: prompt.user(config)
          }
        ],
        max_tokens: 2000,
        temperature: 0.7
      });

      const generatedCode = completion.choices[0].message.content.trim();
      
      // Extrair apenas o código (remover possíveis explicações)
      const cleanCode = this.extractCode(generatedCode, config.format);
      
      return {
        level,
        code: cleanCode,
        description: this.generateDescription(level, config),
        tokens: completion.usage.total_tokens,
        model: completion.model
      };

    } catch (error) {
      console.error(`Erro ao gerar ${level}:`, error.message);
      throw new Error(`Falha na geração do nível ${level}: ${error.message}`);
    }
  }

  // Limpar código gerado (remover explicações extras)
  extractCode(content, format) {
    // Para Mermaid
    if (format === 'mermaid') {
      const mermaidMatch = content.match(/```mermaid\n([\s\S]*?)\n```/) || 
                          content.match(/graph\s+(TB|TD|LR|RL)[\s\S]*/) ||
                          content.match(/flowchart\s+(TB|TD|LR|RL)[\s\S]*/);
      if (mermaidMatch) {
        const code = mermaidMatch[1] || mermaidMatch[0];
        return this.validateMermaidSyntax(code);
      }
    }
    
    // Para PlantUML
    if (format === 'plantuml') {
      const pumlMatch = content.match(/```plantuml\n([\s\S]*?)\n```/) ||
                       content.match(/@startuml[\s\S]*?@enduml/);
      if (pumlMatch) {
        return pumlMatch[1] || pumlMatch[0];
      }
    }
    
    // Para Structurizr
    if (format === 'structurizr') {
      const structMatch = content.match(/```dsl\n([\s\S]*?)\n```/) ||
                         content.match(/workspace[\s\S]*?}/);
      if (structMatch) {
        return structMatch[1] || structMatch[0];
      }
    }
    
    // Fallback: retornar conteúdo limpo
    return content.replace(/```[\w]*\n?/g, '').trim();
  }

  // Gerar descrição do nível
  generateDescription(level, config) {
    const descriptions = {
      context: `Diagrama de contexto do sistema ${config.projectName} mostrando atores principais e sistemas externos.`,
      container: `Diagrama de contêineres mostrando a arquitetura técnica do ${config.projectName} com tecnologias: ${config.technologies}.`,
      component: `Diagrama de componentes detalhando a estrutura interna do backend/API do ${config.projectName}.`,
      code: `Implementação de código para componente principal do ${config.projectName} usando ${this.getTechnologyFromConfig(config.technologies)}.`
    };
    
    return descriptions[level] || `Diagrama C4 nível ${level}`;
  }

  // Gerar README do projeto
  generateReadme(config, results) {
    const levels = Object.keys(results);
    
    return `# ${config.projectName} - Documentação C4

## Visão Geral

**Descrição:** ${config.description}
**Domínio:** ${config.domain}
**Tecnologias:** ${config.technologies}

## Diagramas C4 Gerados

${levels.map(level => `
### ${level.charAt(0).toUpperCase() + level.slice(1)} Level

${results[level].description}

**Arquivo:** \`${config.projectName.toLowerCase().replace(/\s+/g, '-')}-${level}.${config.format === 'mermaid' ? 'mmd' : config.format === 'plantuml' ? 'puml' : 'dsl'}\`

**Tokens utilizados:** ${results[level].tokens}
`).join('\n')}

## Como Visualizar

### Mermaid
- Acesse: https://mermaid.live/
- Cole o conteúdo dos arquivos .mmd

### PlantUML  
- Acesse: http://www.plantuml.com/plantuml/
- Cole o conteúdo dos arquivos .puml

### Structurizr
- Use Structurizr Lite: https://structurizr.com/
- Importe os arquivos .dsl

## Estrutura do Projeto

\`\`\`
${config.projectName}/
├── README.md
${levels.map(level => `├── ${config.projectName.toLowerCase().replace(/\s+/g, '-')}-${level}.${config.format === 'mermaid' ? 'mmd' : config.format === 'plantuml' ? 'puml' : 'dsl'}`).join('\n')}
\`\`\`

---

*Gerado automaticamente com C4 Generator + OpenAI GPT*
`;
  }

  // Validar e corrigir sintaxe Mermaid
  validateMermaidSyntax(code) {
    let cleanCode = code;
    
    // Corrigir problemas comuns de sintaxe
    cleanCode = cleanCode
      // Garantir aspas duplas em nós com caracteres especiais
      .replace(/\[([^\]"]*\([^)]*\)[^\]"]*)\]/g, '["$1"]')
      // Remover estilos inválidos de subgrafo
      .replace(/style\s+[^a-zA-Z0-9_]+.*$/gm, '')
      // Garantir aspas em subgrafos com espaços
      .replace(/subgraph\s+([^"\n\r]+)\s*$/gm, 'subgraph "$1"')
      // Limpar múltiplas quebras de linha
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      // Remover espaços desnecessários
      .trim();
    
    return cleanCode;
  }

  // Método para testar conexão
  async testConnection() {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: "Hello" }],
        max_tokens: 10
      });
      return true;
    } catch (error) {
      throw new Error(`Falha na conexão com OpenAI: ${error.message}`);
    }
  }
}

module.exports = C4Generator; 