# 🏗️ C4 Generator

Gerador automático de diagramas C4 usando OpenAI GPT. Crie documentação de arquitetura de software de forma rápida e consistente!

## ✨ Características

- **🤖 IA Integrada**: Usa GPT-4 para gerar diagramas inteligentes
- **📊 4 Níveis C4**: Context, Container, Component e Code
- **🎨 Múltiplos Formatos**: Mermaid, PlantUML, Structurizr DSL
- **🔄 Progressivo**: Cada nível usa contexto do anterior
- **📱 CLI Interativo**: Interface amigável no terminal
- **📁 Auto-organização**: Gera arquivos organizados + README

## 🚀 Instalação Rápida

```bash
# 1. Instalar dependências
npm install

# 2. Configurar API Key
cp env.example .env
# Edite .env e adicione sua OPENAI_API_KEY

# 3. Testar instalação
npm test

# 4. Gerar primeiro diagrama
npm start
```

## 📋 Pré-requisitos

- **Node.js** >= 18.0.0
- **OpenAI API Key** (obtenha em: https://platform.openai.com/api-keys)
- **npm** ou **yarn**

## 🎯 Uso

### Modo Interativo (Recomendado)

```bash
npm start
# ou
node index.js generate
```

O CLI vai perguntar:
- Nome do projeto
- Descrição do sistema
- Domínio/setor
- Tecnologias principais
- Níveis C4 para gerar
- Formato de saída

### Modo Exemplo (Teste Rápido)

```bash
node index.js example
```

Gera um exemplo completo de sistema e-commerce.

### Comandos Disponíveis

```bash
# Gerar diagramas interativamente
node index.js generate

# Gerar com opções
node index.js generate --project "MeuSistema" --output "./docs"

# Gerar exemplo
node index.js example

# Ver ajuda
node index.js --help

# Executar testes
npm test
```

## 📊 Níveis C4 Suportados

### 1. **Context** (Contexto)
- **Para:** Executivos, Product Managers
- **Mostra:** Sistema principal + atores + sistemas externos
- **Formato:** Visão de negócio

### 2. **Container** (Contêineres)
- **Para:** Arquitetos, Tech Leads
- **Mostra:** Aplicações, APIs, bancos, tecnologias
- **Formato:** Arquitetura técnica

### 3. **Component** (Componentes)
- **Para:** Desenvolvedores
- **Mostra:** Controllers, Services, Repositories
- **Formato:** Estrutura interna

### 4. **Code** (Código)
- **Para:** Implementação
- **Mostra:** Classes, métodos, implementação
- **Formato:** Código funcional

## 🎨 Formatos Suportados

| Formato | Extensão | Visualizar Em |
|---------|----------|---------------|
| **Mermaid** | `.mmd` | https://mermaid.live/ |
| **PlantUML** | `.puml` | http://www.plantuml.com/plantuml/ |
| **Structurizr DSL** | `.dsl` | https://structurizr.com/ |

## 📁 Estrutura de Saída

```
output/
├── README.md
├── meu-sistema-context.mmd
├── meu-sistema-container.mmd
├── meu-sistema-component.mmd
└── meu-sistema-code.js
```

## 🔧 Configuração

### Arquivo .env

```bash
# Obrigatório
OPENAI_API_KEY=sk-your-key-here

# Opcional
MODEL=gpt-4o-mini
MAX_TOKENS=2000
TEMPERATURE=0.7
```

### Tecnologias Detectadas

O gerador detecta automaticamente:
- **Node.js/JavaScript** → Gera código ES6+
- **Java/Spring Boot** → Gera código Java
- **Python/Django** → Gera código Python
- **C#/.NET** → Gera código C#
- **Go** → Gera código Go

## 💡 Exemplos de Uso

### E-commerce Platform
```bash
npm start
# Nome: E-commerce Platform
# Descrição: Sistema de vendas online com catálogo e pagamentos
# Tecnologias: React, Node.js, PostgreSQL, Redis
# Níveis: Context, Container, Component
```

### Fintech API
```bash
npm start
# Nome: Banking API
# Descrição: API para operações bancárias e transferências
# Tecnologias: Java, Spring Boot, Oracle, Apache Kafka
# Níveis: Context, Container, Component, Code
```

### Healthcare System
```bash
npm start
# Nome: Hospital Management
# Descrição: Sistema de gestão hospitalar com prontuários
# Tecnologias: Python, Django, PostgreSQL, Redis
# Níveis: Context, Container
```

## 🛠️ Desenvolvimento

### Estrutura do Projeto

```
c4-generator/
├── src/
│   └── c4-generator.js     # Classe principal
├── index.js                # CLI interface
├── test.js                 # Testes
├── package.json
├── README.md
└── env.example            # Configuração exemplo
```

### Executar em Desenvolvimento

```bash
# Watch mode
npm run dev

# Executar testes
npm test

# Debug
DEBUG=* npm start
```

### Contribuir

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit: `git commit -m 'Adiciona nova funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

## 📈 Performance

### Custos OpenAI (Estimados)

| Nível | Tokens Médios | Custo (GPT-4o-mini) |
|-------|---------------|---------------------|
| Context | 500 | ~$0.0003 |
| Container | 800 | ~$0.0005 |
| Component | 1200 | ~$0.0007 |
| Code | 1500 | ~$0.0009 |
| **Total** | **4000** | **~$0.0024** |

### Tempo de Geração

- **Context**: ~5-10 segundos
- **Container**: ~8-15 segundos
- **Component**: ~10-20 segundos
- **Code**: ~15-30 segundos

## 🐛 Troubleshooting

### Erro: "OPENAI_API_KEY não encontrada"
```bash
cp env.example .env
# Edite .env e adicione sua chave
```

### Erro: "Falha na conexão com OpenAI"
- Verifique se a API key está correta
- Verifique sua conexão com internet
- Verifique se tem créditos na conta OpenAI

### Diagramas não aparecem corretamente
- Copie o código gerado para os visualizadores online
- Verifique se a sintaxe está correta
- Tente regenerar com prompt mais específico

### Saída muito genérica
- Seja mais específico na descrição
- Mencione tecnologias específicas
- Inclua detalhes do domínio de negócio

## 📄 Licença

MIT License - veja [LICENSE](LICENSE) para detalhes.

## 🤝 Suporte

- **Issues**: Reporte bugs em [GitHub Issues](https://github.com/seu-usuario/c4-generator/issues)
- **Discussões**: Participe das [GitHub Discussions](https://github.com/seu-usuario/c4-generator/discussions)
- **Email**: seuemail@exemplo.com

## 🌟 Roadmap

- [ ] **Templates por setor** (fintech, healthcare, e-commerce)
- [ ] **Integração com Git** (auto-commit diagramas)
- [ ] **API REST** para integração
- [ ] **Plugin VSCode**
- [ ] **Suporte a mais formatos** (Draw.io, Lucidchart)
- [ ] **Modo batch** (múltiplos projetos)

---

**⭐ Se este projeto te ajudou, deixe uma estrela no GitHub!**

*Gerado com ❤️ e IA* 