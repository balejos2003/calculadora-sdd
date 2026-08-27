# Plano Técnico — Calculadora Básica (Web)

Este documento descreve **como** o projeto será construído, com base nos requisitos definidos em `spec.md`.

---

## 1. Tecnologias

- **HTML puro** — estrutura da página.
- **CSS puro** — estilização e responsividade (sem pré-processadores como Sass/Less).
- **JavaScript puro (Vanilla JS)** — toda a lógica da calculadora, sem frameworks (React, Vue, Angular etc.) e sem bibliotecas externas (jQuery, Lodash etc.).
- Nenhuma dependência de build (sem bundlers como Webpack/Vite), nenhum gerenciador de pacotes (sem `npm install`), nenhuma chamada de rede em tempo de execução — reforçando o requisito de funcionamento offline (RNF03).

---

## 2. Estrutura de Arquivos

Projeto composto por **exatamente três arquivos**, na raiz do projeto:

```
/
├── index.html   → estrutura (marcação da tela, teclado numérico, botões)
├── style.css    → estilos (layout, cores, responsividade)
└── script.js    → lógica (estado da calculadora, cálculos, eventos)
```

- Um único layout: uma única página (`index.html`), sem rotas, sem múltiplas telas.
- Sem pastas adicionais (`/src`, `/assets`, `/components` etc.) — a simplicidade da estrutura reflete a simplicidade do projeto.
- `index.html` referencia `style.css` via `<link>` e `script.js` via `<script defer>`, ambos com caminho relativo, para garantir que o funcionamento offline não dependa de nenhum recurso externo (sem CDNs, sem fontes do Google Fonts, sem ícones externos).

---

## 3. Decisões Técnicas

### 3.1. Representação dos números
- Os números digitados serão tratados **como string** durante a entrada (display atual), e só serão convertidos para `Number` no momento exato do cálculo.
- Motivo: evita problemas de arredondamento/precisão de ponto flutuante durante a digitação e permite tratar com clareza casos como ponto decimal duplicado (CB03) ou número iniciado por ponto (CB06).

### 3.2. Estado da calculadora
- O estado será mantido em um objeto JavaScript simples (ex.: `{ displayValue, firstOperand, operator, waitingForSecondOperand }`), sem uso de classes ou frameworks de estado.
- A tela (`display`) é sempre a representação em string do estado atual — nunca há duas fontes de verdade.

### 3.3. Ordem das operações
- As operações serão resolvidas **sequencialmente, na ordem em que são digitadas** (comportamento de calculadora simples de bolso), e não pela ordem de precedência matemática (PEMDAS). Isso está alinhado ao critério de aceite CA03 do `spec.md`.

### 3.4. Layout
- O teclado de botões será construído com **CSS Grid**, permitindo alinhar dígitos e operadores em linhas/colunas fixas e reorganizar o tamanho dos botões de forma previsível.
- A responsividade (RNF01) será feita com:
  - Unidades relativas (`%`, `rem`, `vw`/`vh`) em vez de pixels fixos onde fizer sentido.
  - Media queries para ajustar tamanho de fonte e espaçamento entre telas pequenas (celular) e grandes (desktop).
  - `grid-template-columns` fluido (ex.: `repeat(4, 1fr)`) para os botões escalarem proporcionalmente ao contêiner.

### 3.5. Tratamento de erros
- Erros (ex.: divisão por zero) serão tratados de forma defensiva antes do cálculo (validação prévia) e nunca deixados propagar como exceções não tratadas — reforçando RNF02 (estabilidade).
- Mensagens de erro serão exibidas no próprio display, reaproveitando a mesma área de tela usada para números/resultados (sem modais ou alertas do navegador tipo `alert()`).

### 3.6. Eventos: mouse e teclado
- Os botões terão `addEventListener('click', ...)` centralizados, delegando o evento a partir do contêiner do teclado (event delegation), em vez de um listener por botão individualmente.
- O suporte a teclado (RF04) será feito com um único `addEventListener('keydown', ...)` no `document`, mapeando teclas para as mesmas funções internas usadas pelos cliques do mouse — garantindo que mouse e teclado sempre produzam exatamente o mesmo comportamento (sem lógica duplicada).

### 3.7. Sem persistência
- Nenhum dado será salvo em `localStorage`, `sessionStorage`, cookies ou qualquer outro mecanismo de armazenamento — coerente com o item "Fora de escopo" do `spec.md` (sem histórico entre sessões).

---

## 4. Fora de Escopo (técnico)

Reforçando o que já está definido em `spec.md`, tecnicamente isso significa que **não** haverá:

- Build tools, transpiladores (Babel/TypeScript) ou bundlers.
- Testes automatizados (unitários/e2e) — validação será manual, com base nos critérios de aceite do `spec.md`.
- Backend, API ou banco de dados.
- Frameworks CSS (Bootstrap, Tailwind etc.).
