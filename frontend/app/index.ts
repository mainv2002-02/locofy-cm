import express, { type Request, type Response } from 'express';

const app = express();
const port = 3006;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});