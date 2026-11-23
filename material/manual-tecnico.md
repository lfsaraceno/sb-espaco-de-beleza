# SB Espaço de Beleza · Manual técnico da marca

Versão técnica para design, site e vídeo · novembro de 2026

Versão em texto do manual técnico. Desenhos do logo, amostras de cor e vídeos estão na página: https://lfsaraceno.github.io/sb-espaco-de-beleza/material/tecnico.html

## 01. Como usar

*Especificações para designers, devs e editores de vídeo. A fonte de verdade é o código do site (styles.css e index.html)*

Medidas do logo em `S`, a altura do “SB” no logo completo, para valer em qualquer escala. Cores com contraste WCAG calculado. Escala tipográfica com os valores do site.

- [Fato] Está nas falas públicas da casa: Instagram, linkbio, letreiro
- [Em uso no site] Definido no site novo. Vale até os donos confirmarem ou trocarem
- [Proposta] Sugestão escrita a partir das palavras da própria casa. Precisa da aprovação dos donos

## 02. Logo: construção e regras

- **Área de proteção [Proposta]** Margem livre de 0,5 S em volta do logo (linha tracejada). Nada entra nesse espaço

| Elemento | Medida | No site (desktop) |
| --- | --- | --- |
| “SB” | S (altura de referência). Bodoni Moda 400, entreletra 0,01em | 84px |
| Lírio, largura | 3,57 S. Traço 5 un. do viewBox, pontas e junções redondas | 300px |
| Lírio → nome | 0,38 S | 32px |
| Espaço SB ↔ filete ↔ nome | 0,26 S | 22px |
| Filete | 1px × 0,79 S, cor do texto a 70% | 1 × 66px |
| “Espaço de Beleza” | 0,238 S, caixa alta, entreletra 0,32em, entrelinha 1,3, 2 linhas | 20px |
| Proporção do lírio | viewBox `70 60 420 380` (≈ 1,105 : 1) | 300 × 271px |

### Tamanho mínimo [Proposta]

| Versão | Digital | Impresso |
| --- | --- | --- |
| Logo principal (lírio + nome) | “SB” com 44px (menor tamanho usado no site) | 30mm de largura |
| Só o nome | “Espaço de Beleza” com 13px ou mais | 25mm de largura |
| Assinatura curta (lírio + SB) | Lírio com 24px, “SB” com 16px | 12mm de largura |
| Símbolo no círculo | 32px (favicon usa traço 12 un.) | 10mm de diâmetro |

Em tamanhos pequenos, engrosse o traço do lírio (até 9 a 12 un. do viewBox) para ele não sumir. O site faz isso na assinatura do topo e no favicon.

### Versões e fundos

| Versão | Cor do logo | Fundos aceitos | Status |
| --- | --- | --- | --- |
| Logo principal | Creme | Noite, vinho, degradê noite → vinho-vivo | [Em uso no site] |
| Logo positivo | Vinho | Creme, branco | [Proposta] |
| Só o nome | Vinho | Branco (feed do Instagram) | [Fato] |
| Símbolo no círculo | Lírio creme/branco, círculo vinho, aro cinza escuro | Perfil de rede, favicon, ícone | [Fato] |
| Assinatura curta | Creme | Noite (topo do site, rodapé) | [Em uso no site] |

### Não faça

- Distorcer a proporção
- Sombra, brilho, chanfro (exceto o render 3D aprovado)
- Cor fora da paleta
- Rotação ou perspectiva
- Contorno no lugar do preenchimento
- Fundo com textura ou foto sem área lisa

## 03. Cores: códigos e contraste

[Em uso no site] Hex do `styles.css`. O CMYK é uma conversão matemática, ponto de partida para a gráfica, e não substitui a prova de cor. O Pantone fica para definir na prova.

| Cor | Variável | Hex | RGB | CMYK aprox. | Pantone | Função |
| --- | --- | --- | --- | --- | --- | --- |
| Noite | `--noite` | #140406 | 20, 4, 6 | 0 / 80 / 70 / 92 | Definir na prova | Fundo principal do digital. Dá o clima de noite e destaca o lírio e as fotos |
| Vinho | `--vinho` | #4A0A12 | 74, 10, 18 | 0 / 86 / 76 / 71 | Definir na prova | Cor-assinatura: círculo do símbolo, fundos de destaque, texto sobre creme |
| Vinho vivo | `--vinho-vivo` | #7A1424 | 122, 20, 36 | 0 / 84 / 70 / 52 | Definir na prova | Só no centro do brilho (degradê radial) atrás do logo |
| Creme | `--creme` | #F3E9E1 | 243, 233, 225 | 0 / 4 / 7 / 5 | Definir na prova | Logo sobre fundo escuro, títulos, texto, botão principal |
| Creme 2 | `--creme-2` | #CDBDB3 | 205, 189, 179 | 0 / 8 / 13 / 20 | Definir na prova | Texto secundário, legendas, informações de apoio |
| Rosa | `--rosa` | #E7B7B0 | 231, 183, 176 | 0 / 21 / 24 / 9 | Definir na prova | Detalhe: chamadas curtas acima de títulos, molduras de foto, sublinhados |
| Linha | `--linha` | creme a 16% | 243, 233, 225 /.16 | — | — | Divisórias e bordas finas |

### Contraste (WCAG 2.2)

| Texto sobre fundo | Razão | Nível |
| --- | --- | --- |
| Creme sobre Noite | 16.72 : 1 | AAA |
| Creme sobre Vinho | 13.07 : 1 | AAA |
| Vinho sobre Creme | 13.07 : 1 | AAA |
| Creme 2 sobre Noite | 10.98 : 1 | AAA |
| Creme 2 sobre Vinho | 8.58 : 1 | AAA |
| Rosa sobre Noite | 11.24 : 1 | AAA |
| Rosa sobre Vinho | 8.78 : 1 | AAA |
| Vinho vivo sobre Creme | 8.99 : 1 | AAA |
| Vinho sobre Noite | 1.28 : 1 | Não usar em texto |

AA pede 4,5 : 1 para texto normal e 3 : 1 para texto grande (24px ou 18,7px em negrito).

### Degradê de fundo

```
radial-gradient(circle at 50% 42%, #7a1424 0%, #4a0a12 38%, #140406 76%)
```

## 04. Tipografia: escala

### Bodoni Moda

Pesos 400 e 500. Eixo óptico `opsz` de 6 a 96: o navegador ajusta sozinho pelo tamanho. No logo, fixe `opsz 84` no “SB” e `opsz 20` no nome. Substitutas: Didot, Georgia, serif.

### Manrope

Pesos 400, 500 e 600. Substitutas: system-ui, -apple-system, Segoe UI, sans-serif.

```
<link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@6..96,400;6..96,500&family=Manrope:wght@400;500;600&display=swap" rel="stylesheet">
```

| Nível | Fonte | Peso | Tamanho (celular → desktop) | Entrelinha | Uso |
| --- | --- | --- | --- | --- | --- |
| Display | Bodoni Moda | 400 | 80 → 230px `clamp(80px,17vw,230px)` | 0,9 | Números grandes (20 anos) |
| H1 / título de seção | Bodoni Moda | 400 | 42 → 80px `clamp(42px,6vw,80px)` | 1 | Unidades, Trabalhos |
| Frase de destaque | Bodoni Moda | 400 | 28 → 52px `clamp(28px,3.4vw,52px)` | 1,12 | Frase da marca na abertura |
| Citação | Bodoni Moda | 400 | 24 → 42px | 1,22 | Falas da casa |
| H3 | Bodoni Moda | 400 | 28 → 36px | 1,1 | Nome da unidade |
| Corpo | Manrope | 400 | 16px (15–17px no texto de abertura) | 1,55 | Parágrafos |
| Chamada (kicker) | Manrope | 400 | 15px, entreletra 0,02em, cor rosa | 1,55 | Acima de títulos |
| Botão | Manrope | 600 | 15px, entreletra 0,01em | — | Ações |
| Legenda | Manrope | 400 | 13px, cor creme 2 | 1,5 | Fonte de citação, unidade da foto |

Regras: títulos sem ponto final, caixa normal (nada de caixa alta em frase), números com `tabular-nums` em contadores e tabelas. Hierarquia por tamanho e cor, não por negrito.

## 05. Componentes

### Botão principal

Exemplo: “Escolha sua unidade”

Altura mín. 52px, padding 0 28px, raio 2px, fundo creme, texto vinho 600 15px. Ao passar o mouse, o fundo fica transparente e o texto creme.

### Link de texto

Exemplo: “Ver trabalhos”

500 15px, sublinhado de 1px a 7px do texto, rosa a 55%. Área de toque com 44px ou mais.

### Moldura de foto

Exemplo de legenda: “Mechas douradas com nuances champanhe” · Unidade Passaré

Padding 12px, borda 1px rosa a 38%, filete interno a 5px (rosa a 14%), foto 4:5, fundo de #260609 a #1a0507.

### Medidas gerais

- Margem lateral: `clamp(16px, 6vw, 96px)`
- Raio dos cantos: 2px
- Divisórias: 1px creme a 16%
- Ícones: traço 1,4–1,5, pontas redondas, cor do texto
- Foco: contorno 2px creme, afastado 3px
- Áreas de toque: 44px ou mais

## 06. Movimento

*Como a marca se move na abertura do site. Use os mesmos tempos em vídeos e reels*

| Momento | O que acontece | Duração e curva |
| --- | --- | --- |
| 0 s | O lírio se forma: partículas em 3D (WebGL) ou traço desenhado (SVG, se não houver 3D) | 3,4 s linear (3D) · pétalas 1,5 s power2.inOut, 0,14 s entre elas |
| ~2,7 s | O brilho vinho se abre do centro | 1,8 s expo.inOut, círculo até 85% |
| ~3,6 s | “SB” sobe 40px e aparece | 1,1 s power3.out |
| ~3,9 s | O filete cresce e “Espaço de Beleza” fecha a entreletra de 0,7em para 0,32em | 0,8 s expo.out · 1,3 s power3.out |
| +2 s | Pausa com a marca completa; depois o logo sobe e o texto entra | 1,6 s expo.inOut |

Com “reduzir movimento” ligado no aparelho, nada anima: o lírio e a marca aparecem prontos. Arquivos prontos: `entregas/sb-lirio-marca-reels.mp4` (1080×1920, 9 s) e `entregas/logo-3d-4k.png` (2160×3840).

## 07. Vídeos

*Animações do lírio e da marca para reels e stories, em 1080 × 1920 (9:16)*

- **Abertura do site [Em uso no site]** O lírio se desenha em partículas e a marca entra embaixo. 7 s, 1080 × 1920 · [Baixar](https://lfsaraceno.github.io/sb-espaco-de-beleza/assets/video/sb-hero-reels_40d3514c_1080p.mp4)
- **Rastro dourado [Proposta]** Um rastro de luz dourada gira em volta do lírio. 4 s, 1080 × 1920 · [Baixar](https://lfsaraceno.github.io/sb-espaco-de-beleza/assets/video/Beauty_salon_logo_animation_ab9d7f12_1080p.mp4)
- **Brilho no lírio [Proposta]** Pontos de luz passam pelo lírio e pela marca. 4 s, 1080 × 1920 · [Baixar](https://lfsaraceno.github.io/sb-espaco-de-beleza/assets/video/Elegant_lily_beauty_salon_animation_73440dbc_1080p.mp4)
- **Pétalas prateadas [Proposta]** Pétalas prateadas giram e o lírio fica cheio. 4 s, 1080 × 1920 · [Baixar](https://lfsaraceno.github.io/sb-espaco-de-beleza/assets/video/Silver_particles_forming_logo_c499e7ac_1080p.mp4)

O brilho dourado e o prateado não fazem parte da paleta. Os donos aprovam antes de usar esses dois vídeos em campanha.

## 08. Tokens e arquivos

```
:root {
  --noite: #140406;
  --vinho: #4a0a12;
  --vinho-vivo: #7a1424;
  --creme: #f3e9e1;
  --creme-2: #cdbdb3;
  --rosa: #e7b7b0;
  --linha: rgba(243, 233, 225, .16);
  --serif: "Bodoni Moda", "Didot", Georgia, serif;
  --sans: "Manrope", system-ui, -apple-system, "Segoe UI", sans-serif;
  --gutter: clamp(16px, 6vw, 96px);
}
```

| Arquivo | O que é | Status |
| --- | --- | --- |
| `assets/img/lirio.svg` | Lírio em vetor, traço 5, cor `currentColor` | [Em uso no site] redesenho, não é o arquivo oficial |
| `assets/img/favicon.svg` | Símbolo no círculo vinho, traço 12 | [Em uso no site] |
| `refs/marca/logo-print.png` | Símbolo original (foto de perfil), 193×183px | [Fato] só referência, baixa resolução |
| `entregas/logo-3d-4k.png` | Logo com relevo 3D, 2160×3840, fundo vinho | [Proposta] |
| `entregas/sb-lirio-marca-reels.mp4` | Abertura do site, só lírio e marca, 1080×1920, 30 fps, 9 s | [Em uso no site] |
| `assets/video/sb-hero-reels_40d3514c_1080p.mp4` | Abertura do site, 1080×1920, 24 fps, 7 s | [Em uso no site] |
| `assets/video/Beauty_salon_logo_animation_ab9d7f12_1080p.mp4` | Rastro dourado, 1080×1920, 24 fps, 4 s | [Proposta] |
| `assets/video/Elegant_lily_beauty_salon_animation_73440dbc_1080p.mp4` | Brilho no lírio, 1080×1920, 24 fps, 4 s | [Proposta] |
| `assets/video/Silver_particles_forming_logo_c499e7ac_1080p.mp4` | Pétalas prateadas, 1080×1920, 24 fps, 4 s | [Proposta] |

### Formatos de rede

| Peça | Tamanho | Observação |
| --- | --- | --- |
| Reels e stories | 1080 × 1920 (9:16) | Deixe o logo fora dos 250px de cima e de baixo, onde fica a interface |
| Post do feed | 1080 × 1350 (4:5) | Mesmo formato das fotos com moldura |
| Foto de perfil | 320 × 320 ou mais | Símbolo no círculo vinho, lírio a 72% do diâmetro |

## 09. Checklist técnico

- [ ] Logo de arquivo, nunca redesenhado à mão
- [ ] Área de proteção de 0,5 S livre
- [ ] Tamanho acima do mínimo da tabela
- [ ] Cores só por hex/variável da paleta
- [ ] Contraste AA em todo texto
- [ ] Bodoni Moda nos títulos e Manrope nos textos, com substitutas definidas
- [ ] Fotos reais, autorizadas, em 4:5 com moldura
- [ ] Animações com versão parada para “reduzir movimento”
- [ ] Nenhuma imagem gerada por IA
- [ ] Nome da marca: SB Espaço de Beleza

## 10. Para aprovar

*Itens que dependem dos donos do SB antes de o manual virar oficial*

- **Logo em vetor oficial** (lírio e nome). O lírio deste manual foi redesenhado para o site a partir da foto de perfil
- **Códigos oficiais de cor** e Pantone para impressão
- **Fonte oficial do nome** e confirmação da Bodoni Moda e da Manrope
- **Missão, visão, valores, personalidade e posicionamento** (todos com selo Proposta)
- **Uso das fotos de clientes** nas peças e no site
- **Uso das citações** do Instagram em materiais da marca
- **Responsável pela marca** quem aprova peças e responde dúvidas
- **Pantone e prova de cor** com a gráfica para fixar o CMYK

---

Itens com selo [Proposta] ou [Em uso no site] ainda dependem da aprovação dos donos.
