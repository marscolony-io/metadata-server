import express from 'express';
import { generateImage } from './helpers/generate-image';
import { generateMetadata } from './helpers/generate-metadata';
import cors from 'cors';
import { allTokens, getSupply } from './services/TokenService';

const app = express();
app.use(cors());
app.use((req: express.Request, res: express.Response, next: Function) => {
  console.log('ACCESS LOG', req.url);
  next();
});

app.get('/clny-supply', (req: express.Request, res: express.Response) => {
  getSupply().then((supply) => {
    res.send(supply);
  })
});

app.get('/tokens', (req: express.Request, res: express.Response) => {
  res.json(allTokens);
});

// image for a token
app.get('/:token.png', (req: express.Request, res: express.Response) => {
  const { token } = req.params;
  const tokenNumber = parseInt(token);
  if (
    Number.isNaN(tokenNumber)
    || tokenNumber < 1
    || tokenNumber > 21000
  ) {
    res.status(404).end();
    return;
  }
  const image = Buffer.from(generateImage(parseInt(token)), 'base64');
  res.writeHead(200, {
    'Content-Type': 'image/png',
    'Content-Length': image.length,
  });
  res.end(image); 
});

// metadata
app.get('/:token', (req: express.Request, res: express.Response) => {
  const { token } = req.params;
  const tokenNumber = parseInt(token);
  if (
    Number.isNaN(tokenNumber)
    || tokenNumber < 1
    || tokenNumber > 21000
  ) {
    res.status(404).end();
    return;
  }
  const meta = generateMetadata(tokenNumber);
  if (meta === null) {
    res.sendStatus(404);
  } else {
    res.json(meta);
  }
});

app.use((req: express.Request, res: express.Response, next: Function) => {
  res.status(404).end();
});

app.listen(parseInt(process.env.PORT ?? '8000'), '127.0.0.1', () => {
  console.log('server started', process.env.PORT ?? '8000');
});
