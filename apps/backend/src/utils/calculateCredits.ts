import { Credit } from '../models';
import { CREDIT_RECALCULATION_TIMEOUT } from './consts';

export const calculateCredits = (credit: Credit): Credit => {
  const elapsed = new Date().getTime() - new Date(credit.lastUpdated).getTime();
  if (elapsed > CREDIT_RECALCULATION_TIMEOUT) {
    credit.value = Math.floor(credit.max * (0.8 + 0.2 * Math.random()));
    credit.lastUpdated = new Date();
  }
  return credit;
};
