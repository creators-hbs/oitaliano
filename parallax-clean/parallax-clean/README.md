# O Italiano

Site estatico multipaginas da O Italiano Consultoria Imobiliaria e Financeira.

## Estrutura

- `index.html`: pagina inicial.
- `sobre/`, `consultoria/`, `destaques/`, `blog/`, `contato/`, `politica-de-privacidade/`: rotas publicas do site.
- `assets/css/`: estilos globais.
- `assets/js/`: JavaScript leve da interface.
- `assets/images/`: imagens usadas pelo site.
- `404.html`, `robots.txt`, `sitemap.xml`, `favicon.svg`: arquivos tecnicos de publicacao.
- `tools/`: scripts de build e validacao.
- `dist/`: pasta gerada para deploy.

## Deploy

Execute:

```bash
npm run build
npm run validate:dist
```

Publique a pasta `dist/`.

Netlify e Vercel ja possuem arquivos de configuracao na raiz do projeto.
