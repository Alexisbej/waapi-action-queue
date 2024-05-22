import fs from 'fs';
import path from 'path';
import { Action, Credit } from '../models';

const actionsFilePath = path.join(__dirname, 'actions.json');
const creditsFilePath = path.join(__dirname, 'credits.json');

function initializeFile(filePath: string, initialData: [] | Credit[]) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2));
  }
}

initializeFile(actionsFilePath, []);
initializeFile(creditsFilePath, [
  {
    type: 'A',
    value: 15,
    max: 20,
    lastUpdated: new Date(),
  },
  {
    type: 'B',
    value: 9,
    max: 10,
    lastUpdated: new Date(),
  },
  {
    type: 'C',
    value: 5,
    max: 30,
    lastUpdated: new Date(),
  },
]);

export function getActions(): Action[] {
  const data = fs.readFileSync(actionsFilePath, 'utf8');
  return JSON.parse(data);
}

export function saveActions(actions: Action[]): void {
  fs.writeFileSync(actionsFilePath, JSON.stringify(actions, null, 2));
}

export function getCredits(): Credit[] {
  const data = fs.readFileSync(creditsFilePath, 'utf8');
  return JSON.parse(data);
}

export function saveCredits(credits: Credit[]): void {
  fs.writeFileSync(creditsFilePath, JSON.stringify(credits, null, 2));
}
