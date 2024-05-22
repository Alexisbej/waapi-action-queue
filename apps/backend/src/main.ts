import express from 'express';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

import { actionExecutor, recalculateCreditsInterval } from './executor';
import { Action } from './models';

import { getActions, getCredits, saveActions } from './storage/storage';

const app = express();
app.use(express.json());

recalculateCreditsInterval();
actionExecutor();

app.get('/queue', (req, res) => {
  res.json(getActions());
});

app.post('/queue', (req, res) => {
  const actions = getActions();
  const newAction: Action = {
    type: req.body.type,
    title: req.body.title,
    timestamp: new Date(),
  };
  actions.push(newAction);
  saveActions(actions);
  res.status(201).json(newAction);
});

app.get('/credits', (req, res) => {
  res.json(getCredits());
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});

export default app;
