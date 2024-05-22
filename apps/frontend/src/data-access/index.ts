import { Action, Credit } from '../models';

export const fetchActionQueue = async (): Promise<Action[]> => {
  const response = await fetch('api/queue');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const fetchCredits = async (): Promise<Credit[]> => {
  const response = await fetch('api/credits');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const postAction = async (action: Action): Promise<Action> => {
  const response = await fetch('api/queue', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: action.title,
      type: action.type,
      timestamp: new Date(),
    }),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
};
