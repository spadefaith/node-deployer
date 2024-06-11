import 'dotenv/config';
import { handler } from './build/handler.js';

import express from 'express';
import compression from 'compression';
const PORT = process.env.PORT;

console.log(9, PORT);

const app = express();
app.use(compression());
app.use(handler);

app.listen(PORT);
console.log(`started on ${PORT}`);
