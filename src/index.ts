import express from 'express';
import { generateImage } from './helpers/generate-image';

const app = express();
app.use(express.static('public'));

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

app.listen(8000, () => {
  console.log('server started');
});
