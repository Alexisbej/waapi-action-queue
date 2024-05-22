import {
  getActions,
  getCredits,
  saveActions,
  saveCredits,
} from './storage/storage';
import { calculateCredits } from './utils/calculateCredits';
import {
  ACTION_QUEUE_EXECUTION_TIMEOUT,
  CREDIT_RECALCULATION_TIMEOUT,
} from './utils/consts';

export function actionExecutor() {
  setInterval(() => {
    const actions = getActions();
    if (actions.length > 0) {
      const action = actions.shift();
      const credits = getCredits();
      const credit = credits.find((c) => c.type === action?.type);
      if (credit && credit.value > 0) {
        credit.value -= 1;
        saveCredits(credits);
        saveActions(actions);
        console.log(`Executed action: ${action?.type}`);
      } else {
        console.log(`Insufficient credits for action: ${action?.type}`);
      }
    }
  }, ACTION_QUEUE_EXECUTION_TIMEOUT);
}

export function recalculateCreditsInterval() {
  setInterval(() => {
    const credits = getCredits();
    const updatedCredits = credits.map((credit) => calculateCredits(credit));
    console.log('credits', updatedCredits);
    saveCredits(updatedCredits);
  }, CREDIT_RECALCULATION_TIMEOUT);
}
