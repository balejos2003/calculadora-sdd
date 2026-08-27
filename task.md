# Tarefas — Calculadora Básica (Web)

Lista de tarefas pequenas e verificáveis, derivadas de `spec.md` (requisitos) e `plan.md` (plano técnico). Cada tarefa deve ser concluída e verificada antes de seguir para a próxima.

---

## 1. Estrutura HTML (visor + botões)

- [ ] Criar `index.html` com estrutura básica (`<!DOCTYPE html>`, `<head>`, `<body>`) e `<meta name="viewport">` para responsividade.
- [ ] Adicionar elemento de visor (`display`) que mostrará o valor atual.
- [ ] Adicionar botões de dígitos (`0-9`) e ponto decimal (`.`).
- [ ] Adicionar botões de operadores (`+`, `-`, `×`, `÷`) e igual (`=`).
- [ ] Adicionar botões de limpar (`C` e `AC`), conforme RF02.
- [ ] Vincular `index.html` a `style.css` (`<link>`) e `script.js` (`<script defer>`), com caminhos relativos.
- [ ] Verificar: abrir `index.html` no navegador e confirmar que todos os botões e o visor aparecem na tela (mesmo sem estilo/funcionalidade ainda).

## 2. Estilização com CSS (grid, responsivo)

- [ ] Criar `style.css` e aplicar `display: grid` no contêiner dos botões (conforme decisão técnica 3.4 do `plan.md`).
- [ ] Estilizar o visor (fonte legível, alinhamento à direita, espaço suficiente para números grandes).
- [ ] Adicionar media queries para telas pequenas (celular) e grandes (desktop).
- [ ] Verificar (CA10): redimensionar a janela do navegador (ou usar o modo responsivo do DevTools) simulando 360px e 1920px de largura e confirmar que todos os botões continuam visíveis, proporcionalmente dispostos e clicáveis, sem scroll horizontal.

## 3. Lógica de entrada de números

- [ ] Implementar função que atualiza o visor conforme o usuário clica nos dígitos (RF03).
- [ ] Implementar tratamento para múltiplos pontos decimais seguidos, ignorando o segundo ponto (CB03).
- [ ] Implementar tratamento para número iniciado com ponto decimal, exibindo como `0.5` (CB06).
- [ ] Verificar (CA05): digitar `1`, `.`, `.`, `5` e confirmar que o visor mostra `1.5`.
- [ ] Verificar (CB06): digitar `.`, `5` e confirmar que o visor mostra `0.5`.

## 4. Quatro operações básicas

- [ ] Implementar estado da calculadora (`displayValue`, `firstOperand`, `operator`, `waitingForSecondOperand`), conforme decisão técnica 3.2 do `plan.md`.
- [ ] Implementar soma, subtração, multiplicação e divisão entre dois números (RF01).
- [ ] Implementar encadeamento de operações sequenciais (dois ou mais números em sequência), seguindo a ordem digitada, sem prioridade matemática (CA03).
- [ ] Implementar substituição do operador quando dois operadores são clicados em sequência, sem empilhar (CB04).
- [ ] Verificar (CA02): digitar `12`, `+`, `8`, `=` e confirmar que o visor mostra `20`.
- [ ] Verificar (CA03): digitar `5`, `+`, `3`, `×`, `2`, `=` e confirmar que o visor mostra `16`.
- [ ] Verificar (CB04): digitar `5`, `+`, `-`, `3`, `=` e confirmar que apenas o último operador (`-`) é considerado.

## 5. Botão de limpar (C/AC)

- [ ] Implementar botão `AC`, zerando todo o estado da calculadora (RF02).
- [ ] Implementar botão `C`, limpando apenas a entrada/número atual, mantendo operação anterior já confirmada (CB10).
- [ ] Verificar (CA06): digitar qualquer sequência de números, clicar em `AC` e confirmar que o visor volta a `0` sem operador pendente.
- [ ] Verificar (CA07): digitar `5`, `+`, `123`, clicar em `C` e confirmar que apenas o `123` é apagado (visor volta a `0`), mantendo o `5 +` já confirmado.

## 6. Tratamento de divisão por zero

- [ ] Implementar validação prévia antes de executar a divisão, verificando se o divisor é zero (decisão técnica 3.5 do `plan.md`).
- [ ] Exibir mensagem de erro no próprio visor (ex.: "Erro: divisão por zero"), sem usar `alert()`.
- [ ] Garantir que, após o erro, a calculadora permanece utilizável (não trava), permitindo iniciar nova operação com `AC` ou `C`.
- [ ] Verificar (CA01): digitar `8`, `÷`, `0`, `=` e confirmar que o visor mostra a mensagem de erro (nunca `Infinity` ou tela travada).

## 7. Tratamento de entrada via teclado

- [ ] Implementar `addEventListener('keydown', ...)` no `document`, mapeando as teclas: `0-9`, `+`, `-`, `*`/`x`, `/`, `Enter`/`=`, `Backspace`, `Esc`, `.` (RF04).
- [ ] Reaproveitar as mesmas funções internas usadas pelos cliques do mouse, sem duplicar lógica (decisão técnica 3.6 do `plan.md`).
- [ ] Implementar comportamento de tecla não mapeada (ex.: letras), garantindo que nenhuma ação ocorre e nenhum erro é lançado (CB09).
- [ ] Verificar (CA11): repetir os cenários das tarefas 4, 5 e 6 usando apenas o teclado físico e confirmar que o resultado na tela é idêntico ao obtido com o mouse.
- [ ] Verificar (CB09): pressionar uma tecla de letra (ex.: `a`) e confirmar que nada acontece na tela e nenhum erro aparece no console.

## 8. Testes em tela de celular (simulada no navegador)

- [ ] Abrir o DevTools do navegador e ativar o modo de simulação de dispositivo móvel.
- [ ] Testar a calculadora em pelo menos duas resoluções simuladas (ex.: 360px e 414px de largura).
- [ ] Verificar (RNF01): todos os botões permanecem visíveis, legíveis e clicáveis, sem cortes ou necessidade de zoom/scroll horizontal.
- [ ] Verificar (RNF04): cliques nos botões respondem de forma perceptivelmente instantânea na simulação mobile.
- [ ] Verificar (RNF03): recarregar a página uma vez com internet, depois simular modo offline (aba "Network" do DevTools) e confirmar que a calculadora continua funcionando normalmente.
- [ ] Verificar (CA08): repetir cliques aleatórios/inválidos na simulação mobile e confirmar que a aplicação nunca trava, nunca mostra `undefined`/`NaN` e nenhum erro aparece no console.

---

## 9. Checklist final de aceite

- [ ] Todos os critérios de aceite (CA01 a CA11) do `spec.md` foram verificados manualmente e passaram.
- [ ] Todos os casos de borda (CB01 a CB10) do `spec.md` foram verificados manualmente e passaram.
- [ ] O projeto contém apenas os três arquivos definidos em `plan.md` (`index.html`, `style.css`, `script.js`), sem dependências externas.
- [ ] Nenhum item listado em "Fora de escopo" (`spec.md`) foi implementado.
