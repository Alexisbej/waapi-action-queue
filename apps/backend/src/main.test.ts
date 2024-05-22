import express from 'express';
import request from 'supertest';
import server from './main';
import { Action, Credit } from './models';
import {
  getActions,
  getCredits,
  saveActions,
  saveCredits,
} from './storage/storage';

jest.mock('./storage/storage');

const mockedGetActions = getActions as jest.Mock;
const mockedSaveActions = saveActions as jest.Mock;
const mockedGetCredits = getCredits as jest.Mock;
const mockedSaveCredits = saveCredits as jest.Mock;

const app = express();
app.use(express.json());
app.use('/', server);

describe('API Endpoints', () => {
  describe('GET /queue', () => {
    it('should return the list of actions', async () => {
      const actions: Action[] = [
        { title: 'foo', type: 'A', timestamp: new Date() },
      ];
      mockedGetActions.mockReturnValue(actions);

      const response = await request(app).get('/queue');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        actions.map((action) => ({
          ...action,
          timestamp: action.timestamp.toISOString(),
        }))
      );
    });
  });

  describe('POST /queue', () => {
    it('should add a new action to the queue', async () => {
      const actions: Action[] = [];
      mockedGetActions.mockReturnValue(actions);
      mockedSaveActions.mockImplementation(jest.fn());

      const newAction = { type: 'A' };
      const response = await request(app).post('/queue').send(newAction);
      expect(response.status).toBe(201);
      expect(response.body.type).toBe('A');
      expect(new Date(response.body.timestamp)).toBeInstanceOf(Date);
      expect(mockedSaveActions).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            type: 'A',
            timestamp: expect.any(Date),
          }),
        ])
      );
    });
  });

  describe('GET /credits', () => {
    it('should return the available credits', async () => {
      const credits: Credit[] = [
        { type: 'A', value: 9, max: 10, lastUpdated: new Date() },
      ];
      mockedGetCredits.mockReturnValue(credits);

      const response = await request(app).get('/credits');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        credits.map((credit) => ({
          ...credit,
          lastUpdated: credit.lastUpdated.toISOString(),
        }))
      );
    });
  });
});
