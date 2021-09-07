import express from 'express';
import { generateImage } from './helpers/generate-image';
import { generateMetadata } from './helpers/generate-metadata';

const app = express();
app.use((req: express.Request, res: express.Response, next: Function) => {
  console.log('ACCESS LOG', req.url);
  next();
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
  res.json(generateMetadata(tokenNumber));
});

app.use((req: express.Request, res: express.Response, next: Function) => {
  res.status(404).end();
});

app.listen(parseInt(process.env.PORT ?? '8000'), '127.0.0.1', () => {
  console.log('server started', process.env.PORT ?? '8000');
});
