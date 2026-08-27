# Especificação — Calculadora Básica (Web)

## 1. Contexto

Calculadora de uso pessoal, para operações do dia a dia, acessada via navegador (desktop e mobile).

---

## 2. Requisitos Funcionais

O usuário deve conseguir:

- **RF01** — Somar, subtrair, multiplicar e dividir dois ou mais números em sequência (ex.: `2 + 3 - 1 × 4`).
- **RF02** — Limpar a operação atual por meio de um botão "C" (limpa a entrada atual) e/ou "AC" (limpa tudo, zerando a calculadora).
- **RF03** — Ver o resultado/valor sendo digitado atualizado na tela em tempo real, conforme os números são pressionados.
- **RF04** — Operar a calculadora tanto pelo mouse (clicando nos botões na tela) quanto pelo teclado físico:
  - Números `0-9` → dígitos correspondentes.
  - `+`, `-`, `*` ou `x`, `/` → operadores.
  - `Enter` ou `=` → calcular resultado.
  - `Backspace` → apagar último dígito digitado.
  - `Esc` → equivalente ao "AC".
  - `.` → ponto decimal.

---

## 3. Requisitos Não Funcionais

- **RNF01 — Responsividade:** a interface deve se adaptar corretamente a telas de celular e desktop, mantendo todos os botões visíveis, clicáveis e legíveis (sem cortes, sobreposições ou necessidade de zoom/scroll horizontal).
- **RNF02 — Estabilidade:** a aplicação não pode travar, congelar ou lançar erros não tratados no console para nenhuma sequência de cliques/teclas, incluindo entradas inválidas ou repetidas.
- **RNF03 — Funcionamento offline:** após o primeiro carregamento, a calculadora deve continuar funcionando sem depender de conexão com a internet (nenhuma chamada de rede necessária para operar).
- **RNF04 — Desempenho:** cada operação (clique ou tecla) deve refletir na tela de forma imediata (perceptivelmente instantânea, sem delay perceptível).

---

## 4. Casos de Borda / Tratamento de Erros

| # | Situação | Comportamento esperado |
|---|----------|--------------------------|
| CB01 | Divisão por zero (ex.: `8 ÷ 0 =`) | Exibir mensagem de erro clara (ex.: "Erro: divisão por zero"), nunca `Infinity`, `NaN` ou tela travada. |
| CB02 | Clicar em "=" sem ter digitado nenhum número/operação | Nenhuma ação ocorre, ou a tela permanece mostrando "0" (não deve gerar erro nem travar). |
| CB03 | Digitar múltiplos pontos decimais seguidos (ex.: `1..2`) | O segundo ponto decimal é ignorado; apenas um ponto decimal é permitido por número. |
| CB04 | Clicar em um operador logo após outro operador (ex.: `5 + - 3`) | O último operador digitado substitui o anterior (não empilha operadores nem quebra a expressão). |
| CB05 | Clicar em "=" repetidamente após um cálculo já concluído | Repete a última operação com o resultado atual, ou não faz nada — comportamento deve ser consistente e documentado no código. |
| CB06 | Iniciar um número com o ponto decimal (ex.: `.5`) | Interpretado como `0.5`. |
| CB07 | Resultado com muitas casas decimais (ex.: `10 ÷ 3`) | Exibir valor arredondado/truncado de forma legível (ex.: até 8-10 casas decimais), sem estourar o layout da tela. |
| CB08 | Números muito grandes, além do espaço da tela | Exibir em notação científica ou truncar com indicação visual (ex.: "..."), sem quebrar o layout. |
| CB09 | Pressionar tecla não mapeada (ex.: letras) | Nenhuma ação; não deve gerar erro nem travar. |
| CB10 | Clicar em "C" durante a digitação de um número | Limpa apenas a entrada atual, mantendo o operador e o número anterior já confirmado (comportamento de "C" vs "AC" deve ser distinto e consistente). |

---

## 5. Critérios de Aceite

- **CA01** — Dado que o usuário digitou `8`, clicou em `÷`, digitou `0` e clicou em `=`, então a tela exibe uma mensagem de erro (ex.: "Erro: divisão por zero"), e não `Infinity` nem uma tela travada.
- **CA02** — Dado que o usuário digitou `12`, clicou em `+`, digitou `8` e clicou em `=`, então a tela exibe `20`.
- **CA03** — Dado que o usuário digitou `5`, clicou em `+`, digitou `3`, clicou em `×`, digitou `2` e clicou em `=`, então a tela exibe o resultado da sequência calculada na ordem em que foi digitada (`(5+3)×2 = 16`), respeitando o comportamento sequencial simples (sem prioridade de operadores tipo PEMDAS), salvo indicação em contrário.
- **CA04** — Dado que a tela está zerada (`0`) e o usuário clica em `=`, então a tela permanece em `0` (nenhum erro é lançado).
- **CA05** — Dado que o usuário digitou `1`, `.`, `.`, `5`, então a tela exibe `1.5` (o segundo ponto é ignorado).
- **CA06** — Dado que o usuário digitou qualquer sequência de números e clicou em `AC`, então a tela volta ao estado inicial (`0`), sem nenhum operador ou número pendente.
- **CA07** — Dado que o usuário está no meio da digitação de um número (ex.: `123`) e clica em `C`, então apenas o número atual é apagado (tela volta a `0`), mantendo a operação anterior já confirmada.
- **CA08** — Dado que o usuário realiza qualquer sequência de cliques ou teclas válidas ou inválidas, então a aplicação nunca trava, nunca exibe `undefined`/`NaN` na tela, e nunca lança erros não tratados no console.
- **CA09** — Dado que a aplicação foi carregada uma vez com internet e o dispositivo perde a conexão, então a calculadora continua funcionando normalmente offline.
- **CA10** — Dado que a calculadora é acessada em uma tela de celular (ex.: 360px de largura) e em uma tela de desktop (ex.: 1920px de largura), então todos os botões permanecem visíveis, proporcionalmente dispostos e clicáveis em ambos os casos.
- **CA11** — Dado que o usuário usa exclusivamente o teclado físico (números, operadores, Enter, Backspace, Esc), então consegue realizar as mesmas operações que faria com o mouse, com o mesmo resultado na tela.

---

## 6. Fora de Escopo

Não fazem parte desta versão da calculadora:

- Funções de memória (M+, M-, MR, MC).
- Funções científicas (seno, cosseno, logaritmo, potência, raiz quadrada, porcentagem, etc.).
- Histórico de operações salvo entre sessões (persistência em banco de dados ou armazenamento local).
- Suporte a múltiplos temas/skins ou personalização visual.
- Suporte a múltiplos idiomas (internacionalização).
- Conversão de unidades ou moedas.
- Modo científico ou modo programador.
- Sincronização entre dispositivos ou contas de usuário.
- Atalhos de teclado além dos listados no RF04.

---

## 7. Observações

- Este documento define o comportamento esperado; qualquer decisão de implementação não coberta aqui (ex.: paleta de cores, framework utilizado) fica a critério de quem implementar, desde que os requisitos e critérios de aceite acima sejam satisfeitos.
