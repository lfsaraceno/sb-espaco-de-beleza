# Animação web com GSAP, Scroll Craft e WebGL — roteiro para o agente

Este arquivo tem duas partes:

- **Parte A (para você, humano):** instalar as 3 skills e as dependências, responder às perguntas e chamar o agente.
- **Parte B (para o agente):** as instruções que o agente deve ler e executar.

Coloque este arquivo na **raiz do projeto** em que você quer usar as animações.

**Qual skill faz o quê:**

| Skill | Use para | Repositório |
|---|---|---|
| **GSAP Skills** | Animações no site que já existe: entrada de elementos, timelines, efeitos ligados ao scroll, texto animado, React/Vue/Svelte | https://github.com/greensock/gsap-skills |
| **Scroll Craft** | Uma landing page **inteira** e imersiva, em que o scroll é a linha do tempo, com verificação automática | https://github.com/nateherkai/scroll-craft |
| **WebGL Animation Skills** | 3D no navegador: cenas Three.js / React Three Fiber, shaders GLSL, partículas | https://github.com/iart-ai/webgl-animation-skills |

---

# PARTE A — Para você (antes de chamar o agente)

## A1. Instale as skills (uma vez só)

Abra o Claude Code e rode, um comando por vez:

```text
/plugin marketplace add greensock/gsap-skills
/plugin install gsap-skills@gsap-skills

/plugin marketplace add nateherkai/scroll-craft
/plugin install nateherk-design

/plugin marketplace add iart-ai/webgl-animation-skills
/plugin install webgl-animation-skills
```

Se algum install mostrar `Run /reload-plugins to activate.`, rode `/reload-plugins`.

Os plugins ficam instalados no seu usuário e não adicionam arquivos ao projeto. Depois de instalar, **feche o Claude Code e abra uma sessão nova**: skills instaladas no meio de uma sessão podem não aparecer até a próxima.

**Alternativa sem plugin** (instala as skills dentro do projeto):

```bash
npx skills add https://github.com/greensock/gsap-skills -a claude-code
npx skills add iart-ai/webgl-animation-skills -a claude-code
```

O Scroll Craft não tem instalação pelo `npx skills`. Sem plugin, clone o repositório e copie a pasta `plugins/nateherk-design/skills/scroll-craft/` inteira para `.claude/skills/` do projeto.

## A2. Programas necessários (só para o Scroll Craft)

Se você não vai usar o Scroll Craft, pule esta etapa.

| Programa | Para quê | Como conferir |
|---|---|---|
| **Node 18 ou mais novo** | todos os scripts | `node -v` |
| **ffmpeg completo** | preparar vídeos para avançar quadro a quadro com o scroll | `ffmpeg -version` |
| **Google Chrome** | verificação automática da página | já instalado no navegador padrão |

No Windows, um jeito de instalar o ffmpeg completo é `winget install Gyan.FFmpeg`. Versões "enxutas" do ffmpeg que vêm junto com outros programas causam erros confusos. O agente roda um diagnóstico (`doctor.mjs`) na Fase 0 e avisa se for o caso.

O `playwright-core` é instalado pelo agente na pasta do build. Você não precisa instalá-lo.

## A3. (Opcional) Chave do kie.ai, para gerar imagens e vídeos

O Scroll Craft funciona **sem custo** com suas próprias fotos e vídeos. Só para **gerar** imagens e vídeos por IA ele usa o kie.ai, que é **pago**. Pela tabela do projeto: 28 créditos por imagem, 160 por clipe de 5 s e cerca de 520 créditos numa página de seis seções.

Se quiser usar:

1. Crie a chave em https://kie.ai.
2. Crie o arquivo `.env` na raiz do projeto com a linha `KIE_AI_API_KEY=sua-chave`.
3. Confira se `.env` está no `.gitignore`.

**Nunca cole a chave no chat nem neste arquivo.** O agente não deve ler nem mostrar o conteúdo do `.env`.

## A4. Separe o material (opcional, mas melhora muito o resultado)

O agente cria a pasta abaixo na Fase 0. Se já tiver o material, crie-a antes e coloque os arquivos:

```text
animacao/
├── marca/        ← logo (SVG de preferência), manual de marca, cores e fontes
├── assets/       ← fotos e vídeos do produto que podem aparecer na página
└── modelos-3d/   ← modelos .glb / .gltf, se for usar 3D
```

## A5. Responda às perguntas

Preencha a **Seção 2** (na Parte B). Escreva a resposta depois de cada `→`. O que você não souber, deixe em branco: o agente pergunta antes de decidir.

## A6. Chame o agente

Numa sessão nova do Claude Code, aberta na raiz do projeto, envie:

```text
Leia ANIMACAO-WEB.md e execute a Parte B.
```

O agente para nos pontos marcados com ⏸ e espera você aprovar antes de seguir.

## A7. Depois: uso no dia a dia

Com as skills instaladas, basta pedir em linguagem natural. Exemplos:

```text
# GSAP
"Anime os cards da seção de preços entrando com stagger quando aparecerem na tela"
"Fixe a seção de recursos e faça os painéis deslizarem na horizontal com o scroll"
"Converta esta animação para React com useGSAP e limpeza correta"

# Scroll Craft
/nateherk-design:scroll-craft
"Crie uma landing page imersiva para o lançamento do [produto] usando os vídeos de animacao/assets"

# WebGL
"Crie um fundo com shader GLSL em gradiente animado para o hero e ligue no Three.js"
"Faça um fundo de constelação de pontos conectados que continue leve com 2000 partículas"
"Anime este modelo GLTF no React Three Fiber com transição entre as animações idle e walk"
```

---

# PARTE B — Para o agente

## Seção 1. Regras (valem para todas as fases)

1. **Escopo:** altere só os arquivos necessários para as animações pedidas na Seção 2. Não refatore, não renomeie e não mude estilos ou lógica fora disso.
2. **Git:** antes de qualquer alteração, confira se o `git status` está limpo. Trabalhe no branch indicado em 2.9. **Não faça commit, push, merge ou deploy** sem autorização explícita em 2.9.
3. **Dependências:** instale pacotes só depois da aprovação do plano (Fase 2) e só os listados nele. Use o gerenciador de pacotes que o projeto já usa (npm, pnpm, yarn ou bun).
4. **Biblioteca existente:** se o projeto já usa outra biblioteca de animação (Framer Motion, Motion One, AOS, Lottie etc.), não troque nem misture sem aprovação. As GSAP Skills recomendam GSAP por padrão; a escolha do usuário em 2.6 vale mais.
5. **Um controlador de scroll por elemento:** não deixe dois sistemas (por exemplo, o motor do Scroll Craft e o ScrollTrigger, ou um smooth scroll já existente) controlando o mesmo elemento ou o scroll da página. Leia o `SKILL.md` e o `engine/` do Scroll Craft antes de combinar.
6. **Motor do Scroll Craft:** o `engine/` (`scrollcraft.js` e `.css`) **nunca é editado**. Personalize só com os tokens de cor, as fontes, o HTML e a variável `--sc-p`, como manda a skill.
7. **Segredos:** não leia, não mostre e não grave o conteúdo do `.env`. Para saber se `KIE_AI_API_KEY` existe, confira só se a variável está definida, sem imprimir o valor.
8. **Custo:** não gere imagem ou vídeo pelo kie.ai sem autorização em 2.4. Antes de gerar, mostre a estimativa de créditos e espere aprovação (⏸).
9. **Conteúdo:** não invente números, depoimentos, logos de clientes nem dados de produto. Use só o que está no projeto, em `animacao/` ou nas respostas da Seção 2.
10. **Acessibilidade e desempenho:** toda animação respeita `prefers-reduced-motion`. Anime `transform` e `opacity`, não propriedades de layout. 3D e shaders precisam de alternativa estática quando o WebGL não estiver disponível. Libere os recursos da GPU ao desmontar.
11. **Celular:** teste e ajuste para telas de celular. Efeitos pesados podem ser simplificados ou desligados no celular.
12. **Idioma:** escreva relatórios e mensagens em português do Brasil. Mantenha código, comandos e nomes de arquivo no original.
13. **Checkpoints ⏸:** pare, mostre o resumo pedido e espere a resposta do usuário antes de continuar.
14. **Saídas:** os documentos que você criar ficam em `animacao/`. O código vai nos lugares normais do projeto.

## Seção 2. Perguntas para o usuário

Usuário: responda depois de cada `→`. Agente: o que estiver em branco, pergunte na Fase 0 ou deduza do código e peça confirmação.

**2.1 Stack.** Framework e linguagem do front-end (Next.js, React + Vite, Vue, Svelte, Astro, HTML puro etc.). Se não souber, deixe em branco: o agente detecta.
→

**2.2 Objetivo.** O que você quer? (a) animar páginas que já existem; (b) criar uma landing page nova e imersiva; (c) adicionar 3D, shader ou partículas; (d) mais de um. Descreva em uma ou duas frases.
→

**2.3 Onde.** Quais páginas, rotas ou seções devem ser animadas? (ex.: `/`, hero, seção de preços, página de lançamento nova em `/lancamento`)
→

**2.4 Assets e kie.ai.** Você tem fotos ou vídeos próprios (caminho)? Autoriza gerar imagens/vídeos pelo kie.ai? Se sim, qual o limite de créditos?
→

**2.5 Marca.** Caminho do manual de marca, logo, cores e fontes. Se não houver, o agente usa o que já está no CSS do projeto.
→

**2.6 Biblioteca atual.** O projeto já usa alguma biblioteca de animação? Pode substituir, ou deve conviver com ela?
→

**2.7 3D.** Vai usar 3D? Se sim: modelo próprio (caminho do .glb/.gltf), fundo com shader, partículas ou outro efeito?
→

**2.8 Restrições.** Limites de desempenho, navegadores que precisam funcionar, prioridade do celular, SEO da página, prazos.
→

**2.9 Git.** Nome do branch para o trabalho (sugestão: `feat/animacoes`). O agente pode fazer commits locais? Pode fazer push? (padrão se em branco: cria o branch, não faz commit nem push)
→

**2.10 Referências.** Sites cujo efeito ou clima você gosta (links), e o que não quer de jeito nenhum.
→

## Seção 3. Fases

### Fase 0 — Preparação

1. Confira se as skills estão disponíveis na sessão: `gsap-skills`, `nateherk-design` (Scroll Craft) e `webgl-animation-skills`. Se faltar alguma necessária ao objetivo 2.2, pare e peça ao usuário para refazer a A1.
2. Confira `git status`. Se não estiver limpo, pare e avise. Se estiver, crie o branch de 2.9.
3. Detecte a stack (`package.json`, arquivos de configuração, estrutura de pastas) e o gerenciador de pacotes. Compare com 2.1.
4. Crie `animacao/` (com `marca/`, `assets/`, `modelos-3d/`) se não existir.
5. Se o objetivo inclui o Scroll Craft:
   - Localize a pasta da skill instalada (no cache de plugins do Claude Code ou em `.claude/skills/scroll-craft/`).
   - Rode `node <pasta-da-skill>/scripts/doctor.mjs` e registre o resultado.
   - Confira se `.env` está no `.gitignore` e se `KIE_AI_API_KEY` está definida, sem mostrar o valor.
6. Liste as perguntas da Seção 2 sem resposta e que não deu para deduzir.

⏸ **Checkpoint 0:** mostre a stack detectada, as skills encontradas, o resultado do `doctor` (se houver) e as perguntas pendentes. Espere as respostas.

### Fase 1 — Diagnóstico

1. Mapeie as animações que já existem: bibliotecas, CSS `@keyframes`/`transition`, smooth scroll, Lottie, canvas.
2. Para cada página ou seção de 2.3, anote estrutura, componentes, assets disponíveis e pontos de risco (layout que muda depois de carregar, imagens sem dimensão, conteúdo vindo de API).
3. Grave em `animacao/01-diagnostico.md`.

### Fase 2 — Plano

Decida qual skill atende cada parte:

| Pedido | Skill |
|---|---|
| Animar elementos de páginas existentes, timelines, efeitos de scroll, texto | GSAP Skills |
| Página nova e imersiva, guiada pelo scroll, com vídeo quadro a quadro | Scroll Craft |
| Cena 3D, modelo GLTF, shader, partículas | WebGL Animation Skills |

Grave em `animacao/02-plano.md`:

- cada animação ou página, com a skill usada e os arquivos que serão criados ou alterados;
- pacotes a instalar e por quê (por exemplo `gsap`, `@gsap/react` em React, `three`, os pacotes que a skill `threejs-animation` indicar para React Three Fiber, `playwright-core` na pasta do build do Scroll Craft);
- como as partes convivem: quem controla o scroll em cada página (regra 5);
- comportamento com `prefers-reduced-motion`, no celular e sem WebGL;
- se houver Scroll Craft: onde fica o workspace (`SCROLLCRAFT_HOME`, `.scrollcraft.json` ou `<raiz>/scrollcraft`) e como a página entra no projeto;
- se houver kie.ai: estimativa de créditos.

⏸ **Checkpoint 2:** mostre o plano e espere aprovação. Só depois instale qualquer pacote.

### Fase 3 — Dependências

Instale só os pacotes aprovados, com o gerenciador do projeto. Confira se o projeto ainda compila (rode o comando de build ou de type-check que o projeto já tem).

### Fase 4 — Animações com GSAP (se estiver no plano)

1. Siga as skills `gsap-core`, `gsap-timeline`, `gsap-scrolltrigger` e, conforme a stack, `gsap-react` ou `gsap-frameworks`. Para efeitos específicos, use `gsap-plugins`. Revise tudo com `gsap-performance`.
2. Registre os plugins uma vez só no app.
3. Em React, use `useGSAP` com `scope` e limpeza. Em Vue e Svelte, limpe ao desmontar.
4. Chame `ScrollTrigger.refresh()` depois de mudanças de layout (imagens carregadas, conteúdo assíncrono).
5. Implemente uma seção por vez e confira no navegador antes de passar à próxima.

### Fase 5 — Página imersiva com Scroll Craft (se estiver no plano)

1. Leia o `SKILL.md` do Scroll Craft e as referências que ele indicar. Siga o procedimento dele na ordem: brief, gramática, roteiro, build e verificação.
2. Rode `node <pasta-da-skill>/scripts/workspace.mjs --ensure` para preparar o workspace e o registro (`FINGERPRINTS.md`).
3. Use as regras de marca de 2.5 como regras rígidas, acima das preferências da skill.
4. Prefira os assets de `animacao/assets/`. Só gere pelo kie.ai se autorizado em 2.4.

⏸ **Checkpoint 5a:** antes de construir, mostre o brief, a gramática escolhida, a curva de sensação, o pico e a "jogada" exclusiva. Espere aprovação.

⏸ **Checkpoint 5b (só se for gerar no kie.ai):** mostre a lista de imagens e clipes e o total estimado de créditos. Espere aprovação.

5. Construa e rode a verificação da skill (navegador headless e folha de contato). Corrija scroll morto, texto que não fica totalmente visível, contraste baixo e vídeos que não decodificam.
6. Integre a página ao projeto conforme o plano (rota nova, pasta estática ou outro caminho aprovado).

### Fase 6 — 3D, shaders e partículas (se estiver no plano)

1. Use `shader-glsl`, `threejs-animation` ou `particle-system`, conforme o efeito.
2. Carregue o 3D sem bloquear o conteúdo principal (lazy load quando fizer sentido).
3. Garanta a liberação de geometrias, materiais, texturas e renderer ao desmontar.
4. Implemente a alternativa sem WebGL e com `prefers-reduced-motion`.
5. Ajuste a quantidade de partículas e a resolução no celular.

### Fase 7 — Verificação geral

1. Rode o build do projeto e os testes que já existirem. Não altere testes para que passem.
2. Abra cada página alterada no navegador, em desktop e em largura de celular. Confira:
   - nenhum erro no console;
   - animações rodando e terminando no estado certo;
   - nenhum salto de layout causado pelas animações;
   - scroll suave, sem travar;
   - com `prefers-reduced-motion`, nada se move de forma desnecessária;
   - o conteúdo continua legível e acessível sem as animações.
3. Se o projeto tiver Lighthouse ou ferramenta de desempenho, compare antes e depois.
4. Anote o que não deu para verificar e por quê.

### Fase 8 — Relatório

Grave `animacao/RELATORIO-ANIMACAO.md` com:

- o que foi feito, por página ou seção, e qual skill foi usada;
- pacotes instalados;
- arquivos criados e alterados;
- resultado da verificação (Fase 7) e o que ficou sem verificar;
- créditos do kie.ai gastos, se houver;
- pendências e sugestões;
- como pedir novas animações usando as 3 skills (copie os exemplos da A7, ajustados ao projeto).

⏸ **Checkpoint final:** mostre o resumo do relatório e lembre o usuário de revisar as mudanças. Faça commit ou push só se 2.9 autorizar.
