# Instruções para Claude Code

## Stack do Projeto
- Frontend: TypeScript, Next.js (App Router), Tailwind CSS v4
- Backend: []
- Banco: [Neon DB]

## Regras Obrigatórias

### Antes de Codar
1. Leia a issue completamente antes de começar
2. Verifique se já existe solução pronta (biblioteca, componente existente)
3. Entenda o contexto: olhe arquivos relacionados antes de modificar

### Princípios de Código
- **DRY**: Não duplique código. Reutilize componentes/funções existentes
- **YAGNI**: Implemente APENAS o que a issue pede. Nada mais
- **KISS**: Escolha a solução mais simples que resolve o problema
- **Separation of Concerns**: Um arquivo = uma responsabilidade

### Padrões Técnicos
- TypeScript strict mode, sem `any`
- ESLint e Prettier já configurados - siga as regras
- Next.js: prefira Server Components quando possível
- Tailwind v4: use sintaxe CSS-first (@theme, @apply dentro de CSS)
- Commits em português, mensagens descritivas

### O que NÃO fazer
- Criar componentes/funções que já existem no projeto
- Adicionar dependências sem necessidade clara
- Implementar features extras não solicitadas
- Ignorar tipagem ou usar `as any`
- Criar arquivos com múltiplas responsabilidades

### Estrutura de Pastas
```
src/
  components/   # Componentes reutilizáveis
  app/          # Rotas Next.js
  lib/          # Utilitários e helpers
  hooks/        # Custom hooks
  types/        # Tipos TypeScript
```

### Checklist antes do PR
- [ ] Código segue os padrões do projeto
- [ ] Sem duplicação de código
- [ ] Tipagem correta (sem any)
- [ ] Testei localmente (se aplicável)
- [ ] PR descreve o que foi feito e por quê

## Problema
[Descreva o bug ou necessidade]

## Comportamento esperado
[O que deveria acontecer]

## Arquivos relevantes
- `src/components/Button.tsx`
- `src/lib/api.ts`

## Critérios de aceite
- [ ] Funciona em mobile
- [ ] Não quebra testes existentes
