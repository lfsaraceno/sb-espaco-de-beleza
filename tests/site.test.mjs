// Confere o conteúdo factual do index.html: unidades, WhatsApp, mapas, dados estruturados e marca.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const decode = (s) => s.replace(/&amp;/g, '&');

// fonte: spec §9 e refs/FATOS.md
const UNIDADES = [
  { nome: 'Cocó', wa: '558530512494', rua: 'Av. Engenheiro Santana Júnior, 2790' },
  { nome: 'Maraponga', wa: '558521355544', rua: 'Av. Godofredo Maciel, 4035' },
  { nome: 'Passaré', wa: '5585989611000', rua: 'Rua XII, 200' },
  { nome: 'Guararapes', wa: '558530772004', rua: 'Rua Atilano de Moura, 320' },
  { nome: 'Sul', wa: '558532710843', rua: 'Rua Joãozito Arruda, 2200' },
];

const rows = [...html.matchAll(/<li class="unidade" data-unidade="([^"]+)">([\s\S]*?)<\/li>/g)];
const href = (row, cls) => decode(row.match(new RegExp(`<a class="${cls}"[^>]*href="([^"]+)"`))?.[1] ?? '');

test('unidades: 5 linhas na ordem Cocó, Maraponga, Passaré, Guararapes, Sul', () => {
  assert.deepEqual(rows.map((r) => r[1]), UNIDADES.map((u) => u.nome));
});

test('whatsapp: cada unidade aponta para o próprio número com "Vim pelo site."', () => {
  UNIDADES.forEach((u, i) => {
    const url = new URL(href(rows[i][2], 'wa'));
    assert.equal(url.origin + url.pathname, `https://wa.me/${u.wa}`, u.nome);
    assert.equal(url.searchParams.get('text'), 'Olá! Vim pelo site.', u.nome);
  });
});

test('mapa: cada "Como chegar" busca o endereço em Fortaleza', () => {
  UNIDADES.forEach((u, i) => {
    const q = new URL(href(rows[i][2], 'mapa')).searchParams.get('query');
    assert.ok(q.includes(u.rua), `${u.nome}: ${q}`);
    assert.ok(q.includes('Fortaleza'), `${u.nome}: ${q}`);
  });
});

test('jsonld: 5 BeautySalon com telefone, horário e cidade', () => {
  const json = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  const salons = (json['@graph'] ?? json).filter((n) => n['@type'] === 'BeautySalon');
  assert.equal(salons.length, 5);
  UNIDADES.forEach((u) => {
    const s = salons.find((n) => n.telephone === `+${u.wa}`);
    assert.ok(s, `sem BeautySalon para ${u.nome}`);
    assert.equal(s.openingHours, 'Mo-Sa 08:00-19:00');
    assert.equal(s.address.streetAddress.startsWith(u.rua), true, u.nome);
    assert.equal(s.address.addressLocality, 'Fortaleza');
    assert.equal(s.address.addressRegion, 'CE');
  });
});

test('marca: title com "SB Espaço de Beleza" e "Belíssima" só como antigo nome', () => {
  assert.match(html.match(/<title>([^<]*)<\/title>/)[1], /SB Espaço de Beleza/);
  const usos = [...html.matchAll(/.{0,20}Belíssima/g)].map((m) => m[0]);
  usos.forEach((u) => assert.match(u, /antigo Espaço Belíssima/, u));
});

test('links externos: todo target=_blank tem rel="noopener"', () => {
  const blanks = [...html.matchAll(/<a [^>]*target="_blank"[^>]*>/g)].map((m) => m[0]);
  assert.ok(blanks.length >= 11);
  blanks.forEach((a) => assert.match(a, /rel="[^"]*noopener/, a));
});
