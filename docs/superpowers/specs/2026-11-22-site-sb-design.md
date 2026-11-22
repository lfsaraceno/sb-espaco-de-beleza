# Site SB Espaço de Beleza — design

Data: 2026-11-22 · Status: aprovado pelo usuário ("vamos construir tudo agora"), com as respostas da §9

Fontes: `PRODUCT.md` (decisões), `refs/FATOS.md` (fatos coletados do Instagram e do linkbio da cliente), demo aprovada em `spikes/` (descartável).

## 1. Intenção e porquê

A SB Espaço de Beleza (até 06/10/2026 "Espaço Belíssima", 20 anos, 5 unidades em Fortaleza, quase 200 profissionais) não tem site. O site existe para:

1. fazer quem chega (do Instagram, do Google, de indicação) **sentir a sofisticação** da marca nova nos primeiros segundos;
2. levar a pessoa ao **contato de uma das unidades**.

Por isso precisa ser impactante. É também a primeira apresentação da marca nova SB fora do Instagram.

Fase 2 (fora deste escopo, a confirmar com os proprietários): um WhatsApp geral que direciona para a loja desejada.

## 2. Objetivos, não-objetivos, anti-objetivos

**Objetivos**
- Abertura cinematográfica com o lírio da marca em partículas 3D (aprovada na demo B).
- De qualquer ponto da página, contato a um toque (botão fixo "Agendar numa unidade" que leva à lista de unidades).
- As 5 unidades com endereço, observação (estacionamento/manobrista), "Como chegar" e o contato de cada uma.
- Contar a história de 20 anos e a mudança de marca com as palavras da própria cliente.
- Bom no celular primeiro; rápido.

**Não-objetivos (agora)**
- Agendamento online, preços, área de cliente, blog.
- WhatsApp geral com roteamento (fase 2).
- Página de vagas/"trabalhe conosco" (existe destaque "Vagas" no Instagram, mas ninguém pediu).
- Imagens geradas por IA.

**Anti-objetivos (falha mesmo que funcione)**
- Site lento ou que esconde o contato atrás de muito scroll — contradiz a promessa da marca ("agilidade", "serviços expressos").
- Cara de template de salão: fotos de banco, cards idênticos, rosa-e-dourado, contadores sem fonte.
- Parecer site de tecnologia: o 3D serve à marca (o lírio), não é efeito pelo efeito.
- Qualquer fato inventado (serviço, preço, horário, número, depoimento).

## 3. Restrições

- Só fatos confirmados (`refs/FATOS.md`) ou passados pela cliente. Texto novo escrito por nós é marcado para revisão do usuário antes de publicar.
- Marca: nova, SB Espaço de Beleza. Ainda não temos o arquivo oficial (logo, cores, fontes).
- WCAG 2.2 AA. `prefers-reduced-motion` desliga 3D, scrub e smooth scroll. Todo conteúdo legível sem JavaScript.
- Hospedagem: GitHub Pages (estático), como o site irmão `../Site Dra Socorro`. Domínio a definir.
- Não fazer commit, push ou deploy sem autorização explícita do usuário.

## 4. Abordagens consideradas

| Abordagem | Troca | Decisão |
|---|---|---|
| **A · GSAP + lírio desenhado em SVG** | Leve, rápido, total controle; o "uau" depende de ritmo, não de tecnologia | Vira o **fallback** (sem WebGL / economia) |
| **B · Lírio 3D em partículas (Three.js) + GSAP no resto** | Primeira tela mais impressionante; mais peso, precisa de fallback e de cuidado no celular | **Escolhida pelo usuário** depois de ver as duas demos |
| C · Scroll Craft (vídeo quadro a quadro) | Brilha com vídeo; não temos vídeo; motor fechado | Descartada agora; pode voltar se chegarem vídeos das unidades |

## 5. Decisões do usuário

- Marca nova SB (não "Espaço Belíssima").
- Objetivo: apresentar sofisticação e levar ao contato de uma unidade.
- Visual começa pelo lírio redesenhado + tipografia + vinho; fotos reais entram conforme chegarem; nada de IA.
- Abertura B · Lírio 3D, como na demo.

## 6. Proposta (minhas escolhas, corrigíveis)

### 6.1 Estrutura da página (uma página só)

```
┌──────────────────────────────────────────┐
│ [lírio SB]                [Agendar ▸]    │ ← topo fixo; logo aparece após a abertura
│                                          │
│        ✦ partículas formam o lírio ✦     │ 1. ABERTURA (100svh)
│            SB │ ESPAÇO DE BELEZA         │    vinho se espalha, wordmark se revela
│  Beleza com agilidade, técnica e sofist. │
├──────────────────────────────────────────┤
│  NOSSO PRÓXIMO CAPÍTULO                  │ 2. HISTÓRIA
│  20 anos                                 │    20 anos + mudança de marca,
│  "…quantas vidas e sorrisos…"            │    com trechos da própria cliente
├──────────────────────────────────────────┤
│  O QUE FAZEMOS                           │ 3. SERVIÇOS — só entra com a lista
│  (lista da cliente)                      │    da cliente (ver §8)
├──────────────────────────────────────────┤
│  [fotos reais do espaço/trabalhos]       │ 4. AMBIENTE — só entra quando houver
│                                          │    fotos com qualidade
├──────────────────────────────────────────┤
│  SEG A SÁB · 8H ÀS 19H                   │ 5. UNIDADES (âncora do botão fixo)
│  Escolha sua unidade                     │    5 linhas: nome · endereço · obs ·
│  Cocó        Av. Eng. Santana Jr…  [▸]   │    [Como chegar] [WhatsApp]
│  Maraponga   …                     [▸]   │
├──────────────────────────────────────────┤
│  Instagram · horário · © SB              │ 6. RODAPÉ
└──────────────────────────────────────────┘
```

Seções 3 e 4 ficam fora do ar até termos o material; o site publica sem elas.

### 6.2 Movimento

- **Abertura (≈4 s, não bloqueia):** partículas vindas de longe convergem no lírio (como a demo B); em seguida o vinho se abre do centro, o "SB │ Espaço de Beleza" e a frase da bio entram. O botão "Agendar" aparece já no fim da abertura. O usuário pode rolar a qualquer momento; não há tela de carregamento.
- **Vida contínua:** lírio respira e cintila; segue o mouse no desktop (giro leve); no celular, giro leve automático, sem giroscópio.
- **Saída por scroll:** partículas se dispersam enquanto a abertura sobe; o lírio pequeno aparece no topo.
- **Resto da página:** revelações discretas por scroll com GSAP/ScrollTrigger (texto por linha, lista de unidades em sequência). Uma ideia de movimento por seção, sem fade genérico em tudo.
- **Scroll suave:** Lenis, sincronizado com ScrollTrigger (um único controlador de scroll).

### 6.3 Fallbacks e desempenho

| Situação | Comportamento |
|---|---|
| `prefers-reduced-motion` | Lírio em SVG estático, sem Lenis, sem scrub; conteúdo todo visível |
| Sem WebGL / erro no 3D | Abertura A (lírio desenhado em SVG com GSAP) |
| Celular | Menos partículas (~metade), pixel ratio ≤ 2 |
| Sem JavaScript | Lírio SVG + todo o texto e links visíveis |
| Abertura fora da tela | Render do 3D pausa |

- 3D carregado depois do conteúdo (não atrasa o primeiro texto).
- Meta: LCP < 2,5 s em 4G; nenhum salto de layout causado por animação.

### 6.4 Marca

- **Lírio:** refazer o vetor com cuidado (o da demo foi traçado a olho de um print 193×183). O mesmo SVG alimenta o 3D, o fallback, o logo do topo e o favicon. Se a cliente mandar o arquivo original, ele substitui o nosso.
- **Wordmark "SB │ ESPAÇO DE BELEZA":** composto em fonte serifada parecida com a do feed até chegar o arquivo oficial.
- **Cores (provisórias, tiradas do logo e da fachada):** vinho-noite `#140406`, vinho `#4a0a12`, vinho vivo `#7a1424`, creme `#f3e9e1`.
- **Fontes (provisórias):** Bodoni Moda (títulos/wordmark) + Manrope (texto).

### 6.5 Contato

- Uma única lista de unidades no código (nome, endereço, observação, link do mapa, WhatsApp). Trocar pelo WhatsApp geral na fase 2 = mudar essa lista/um link, sem refazer layout.
- Enquanto não houver WhatsApp por unidade, a linha mostra só "Como chegar" (Google Maps pelo endereço).
- Link do Instagram no rodapé.
- **Minha escolha:** "Como chegar" usa o endereço completo com "Fortaleza - CE". Antes de publicar, confiro manualmente se cada link cai no ponto certo do mapa. Se a unidade tiver ficha no Google (o Instagram tem destaque "Google"), o link aponta para a ficha.

### 6.6 SEO

- `title`/`description` com "SB Espaço de Beleza", "salão de beleza", "Fortaleza" e os bairros.
- Dados estruturados `BeautySalon` para cada uma das 5 unidades (endereço, horário seg–sáb 8h–19h), só com dados confirmados. **Minha escolha:** o horário é o mesmo para as 5 porque a fonte o dá assim; o telefone só entra quando a cliente passar.
- Imagem de compartilhamento (Open Graph) com o lírio e o wordmark.
- Menção à marca antiga ("antigo Espaço Belíssima") no texto da história, para quem ainda busca pelo nome antigo.

### 6.7 Stack

- HTML/CSS estático + JS, como o site irmão.
- GSAP + ScrollTrigger + DrawSVG (fallback) + Lenis copiados para `assets/vendor/`.
- Three.js empacotado com esbuild num arquivo só (`assets/lirio3d.js`), carregado sob demanda.
- Publicação no GitHub Pages (`.nojekyll` já existe). **Minha escolha:** até haver domínio, endereço temporário `github.io`, na mesma conta do site irmão. Caminhos relativos no HTML, para que a troca pelo domínio próprio mude só a URL canônica, a do Open Graph e a dos dados estruturados.
- `spikes/` é descartável e não é base do código final.

## 7. Fica a critério do construtor

- Organização de arquivos, nomes, detalhes do shader e do easing.
- Quantidade exata de partículas por faixa de dispositivo, desde que o celular fique fluido.
- Microinterações (hover, foco), desde que discretas.
- Texto de apoio curto (rótulos, botões) — sempre marcado para revisão.

## 8. Pendências da cliente

- Logo oficial da marca nova (vetor), cores e fontes.
- Lista de serviços (e se mostra preço) — libera a seção 3.
- Fotos e vídeos em boa resolução — libera a seção 4.
- Domínio.
- Autorização para usar trechos das legendas do Instagram no site.

## 9. Respostas do usuário (2026-11-22)

**Contato:** WhatsApp por unidade, passado pelo usuário:

| Unidade | WhatsApp |
|---|---|
| Maraponga | 55 85 2135-5544 (`558521355544`) |
| Passaré | 55 85 98961-1000 (`5585989611000`) |
| Guararapes | 55 85 3077-2004 (`558530772004`) |
| Sul | 55 85 3271-0843 (`558532710843`) |
| Cocó | 55 85 3051-2494 (`558530512494`) |

- Cada linha de unidade ganha o botão "WhatsApp" (`https://wa.me/<número>?text=...`). O botão fixo do topo leva à lista de unidades.
- **Minha escolha:** a mensagem pronta vira "Olá! Vim pelo site." (nos links originais é "Vim pelo Instagram"), para a cliente saber que o contato veio do site.
- `telephone` entra nos dados estruturados de cada unidade.

**Publicação:** construir tudo agora e publicar no GitHub do usuário (GitHub Pages) como prévia para apresentar aos clientes. A aprovação dos proprietários acontece em cima dessa prévia; lírio, fontes, cores e trechos de legenda continuam provisórios até lá.
