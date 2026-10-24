# Site — Construtora Rodrigues Santos

One page estático (HTML + CSS + JS, sem build e sem dependências externas).
Feito a partir do portfólio 2026 e inspirado na estrutura do site
singapura.eng.br: menu fixo, hero com foto, especialidades, áreas de atuação,
obras, clientes, empresa e contato.

## Ver localmente

```bash
cd site
python -m http.server 8099
```

Abrir `http://127.0.0.1:8099/`.

## Publicar

O site é 100% estático: basta subir o conteúdo de `site/` para a raiz do
domínio (`construtorarodriguessantos.com.br`), via FTP/hospedagem ou em
serviços como Netlify, Vercel ou Cloudflare Pages.

Publicado (preview) em **https://willahc.github.io/construtora-rodrigues-santos/**
(repositório: `Willahc/construtora-rodrigues-santos`, branch `main`, raiz).

Antes de publicar no domínio próprio, ajuste em `index.html`:

- `canonical`, `og:url`, `og:image` e o `url`/`image` do JSON-LD — hoje apontam
  para o endereço do GitHub Pages.
- JSON-LD (`GeneralContractor`) — telefone, e-mail e cidades atendidas.

## Estrutura

```
site/
├── index.html
├── assets/
│   ├── css/style.css
│   ├── js/main.js
│   └── img/            (fotos, logos, favicon, og.jpg)
└── README.md
```

## O que editar

- **Textos e seções:** `index.html`. Cada bloco está comentado
  (`<!-- SERVIÇOS -->`, `<!-- OBRAS -->` etc.).
- **Cores e tipografia:** variáveis no topo de `assets/css/style.css`
  (`--moss`, `--yellow`, `--cream`…), herdadas do portfólio.
- **Obras do lightbox:** o JSON dentro de `<script id="galerias">` no fim do
  `index.html`. Para adicionar uma obra, copie um `<article class="obra">` e
  registre as fotos no JSON com a mesma chave usada em `data-gallery`.
- **Filtros:** cada obra tem `data-cat` (`industria`, `publica`, `residencial`).
- **Formulário:** não há backend. O envio monta uma mensagem e abre o WhatsApp
  do comercial. Para receber por e-mail, troque o handler em
  `assets/js/main.js` por um endpoint (Formspree, Web3Forms etc.).
- **Logos de clientes:** `assets/img/cliente-*.png`. O bloco inteiro pode ser
  removido sem afetar o resto.

## Observações

- Fotos vieram do portfólio (resolução modesta). Se houver originais em alta,
  substitua mantendo os nomes dos arquivos.
- Sem cookies, sem analytics e sem requisições a terceiros: nada de fontes ou
  scripts externos.
- Acessibilidade: link “pular para o conteúdo”, foco visível, menu e lightbox
  navegáveis por teclado, contraste verificado e fallback para navegadores sem
  JavaScript.
