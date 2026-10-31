# AudioGuide Web

Guia turístico de Campina Grande, recuperado a partir do front Next.js e das funcionalidades do aplicativo React Native. Experiência centrada no mapa, com painel lateral no desktop e painel inferior expansível/arrastável no celular. Busca e filtros flutuam sobre o mapa; a seleção de um marcador abre uma prévia com player no próprio painel. Navegação inferior oferece Mapa, Lugares e Audioguias. Interface em português, com seleção do idioma **do conteúdo** quando a API oferecer traduções.

## Rodar localmente

Node.js 22 LTS ou superior e npm.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Abra http://localhost:3000. Sem `NEXT_PUBLIC_API_URL`, o aplicativo usa o **catálogo recuperado de 2024**: 42 lugares reais, 42 áudios e 67 imagens copiados dos repositórios locais, com os créditos disponíveis na planilha. Todos são servidos pelo próprio front; o catálogo não depende do Fly.io ou da Vercel. O mapa ainda precisa de internet. Preços, horários, contatos e acessibilidade são históricos e devem ser confirmados antes da visita.

A fonte é a [planilha original](https://docs.google.com/spreadsheets/d/1rHtn1spLy5AupAzswlfIGmBV3eJq3pxrBDYPgZplKFA/edit), preservada em `../audio-guide/recovery/points-audio_guide-original.xlsx`. O arquivo `src/data/recovered-catalog.json` contém a procedência e os registros normalizados. `scripts/import-recovered-catalog.py` refaz a importação a partir de `../audio-guide/recovery/catalog-source-records.json`, `../audio-store` e `../image-store`.

Os IDs recuperados são negativos, estáveis a partir do UUID do áudio e exclusivos do front. Não correspondem aos IDs do PostgreSQL. Links usam `?source=recovered`; também são resolvidos pelos IDs negativos. Avaliações e acesso à API de detalhes são bloqueados para esses IDs, mesmo com uma API configurada. As colunas de inglês/espanhol estavam vazias, portanto o catálogo recuperado está disponível somente em português. Os exemplos antigos continuam acessíveis exclusivamente por links legados `?demo=1`.

## Conectar o backend depois

Configure `.env.local` e reinicie o servidor (ou refaça o build):

```dotenv
NEXT_PUBLIC_API_URL=https://audio-guide-api.fly.dev
NEXT_PUBLIC_IMAGE_URL=https://image-store-five.vercel.app
NEXT_PUBLIC_AUDIO_URL=https://audio-store-roan.vercel.app
```

A URL da API é a origem, sem `/api`. Estas variáveis são públicas; não coloque senhas nelas. O front usa:

- `GET /api/points?language=pt|en` para o catálogo;
- `GET /api/points/:id?language=pt|en` para detalhes, incluindo acesso direto/reload;
- `POST /api/points/rate` com `{ point_id, rating }` para avaliações.

A API deve permitir CORS para a origem do front e retornar o formato Go existente. Campos opcionais nulos são aceitos. Uma API configurada que falhar exibe erro com retry; não substituímos silenciosamente os dados da API. O catálogo recuperado pode ser aberto explicitamente nessa situação. O backend principal antigo pode ignorar `language`; traduções dependem da implementação e dos dados do servidor.

## Funcionalidades recuperadas

- Catálogo, busca sem distinção de acentos e filtros por categoria, acessibilidade e aberto agora.
- Mapa Leaflet/OpenStreetMap com marcadores e links para detalhes; não exige chave Mapbox. Tiles requerem internet. A lista continua disponível se o mapa falhar.
- Localização solicitada por ação do usuário, ordenação por distância real, tratamento de recusa/timeout.
- Página `/points/:id`, informações, horários (fuso America/Fortaleza, intervalos e virada de dia), transcrição, contatos e link de rota.
- Fotos com créditos, miniaturas e ampliação em diálogo acessível pelo teclado.
- Player HTML5 com seek, volume, velocidade 1×/1.5×/2×, avanço e retrocesso de 15 segundos e tratamento de falha.
- Avaliação de 1–5 com confirmação de envio, bloqueio durante a requisição e lembrança local apenas após sucesso. A prevenção de duplicidade no navegador não substitui autenticação/validação no servidor.
- Estados de carregamento, erro, catálogo vazio, mídia ausente e catálogo histórico.

A branch antiga `refactory/structure` foi examinada; sua separação de apresentação foi reaplicada na nova estrutura, sem incorporar os componentes antigos que dependiam de estado em memória. Cores e identidade do projeto original foram mantidas. Código substituído segue disponível no histórico Git.

## Verificação

```sh
npm run typecheck
npm test
npm run build
python3 -m http.server 4173 --directory out
```

O site é exportado como arquivos estáticos e publicado em https://audio-guide-ufcg.github.io/ pelo GitHub Pages. Cada push em `main` executa testes, build e publicação pelo workflow `.github/workflows/pages.yml`. Não exige servidor próprio nem banco. Não há autenticação, sincronização offline ou avaliações persistentes no catálogo recuperado. Localização precisa de HTTPS em produção.

A exportação gera as rotas dos pontos recuperados durante o build. Integrar novos IDs de uma API exige adaptar a geração das rotas ou a navegação estática antes de habilitar essa integração.

## Estado da validação

TypeScript, build de produção e sete testes automatizados passaram. As rotas inicial e de detalhes responderam HTTP 200. Validação no navegador integrado em 320×740, 390×844 e 1280×800: busca sem acentos, acessibilidade, estado vazio/limpar filtros, seleção por lista e marcador, expansão por botão e arraste, navegação e reload dos detalhes, transcrição e ausência de overflow horizontal no detalhe estreito. O áudio carregou (151 segundos), respondeu à velocidade de 1,5× e ao avanço de 15 segundos. Nenhum erro/aviso foi registrado no console durante essa sessão. Não testados: dispositivo físico, permissão real de geolocalização e envio à API de produção (indisponível).
