import fs from 'fs';
import path from 'path';
import { Action, Credit } from '../models';
import { getActions, getCredits, saveActions, saveCredits } from './storage';

jest.mock('fs');

const actionsFilePath = path.join(__dirname, 'actions.json');

const creditsFilePath = path.join(__dirname, 'credits.json');

describe('File Operations', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getActions', () => {
    it('should read actions from the file', () => {
      const mockActions: Action[] = [
        { title: 'Test Action', type: 'A', timestamp: new Date() },
      ];
      (fs.readFileSync as jest.Mock).mockReturnValue(
        JSON.stringify(mockActions)
      );

      const actions = getActions();

      expect(fs.readFileSync).toHaveBeenCalledWith(actionsFilePath, 'utf8');
      expect(actions).toEqual(
        mockActions.map((action) => ({
          ...action,
          timestamp: action.timestamp.toISOString(),
        }))
      );
    });
  });

  describe('saveActions', () => {
    it('should write actions to the file', () => {
      const mockActions: Action[] = [
        { title: 'Test Action', type: 'A', timestamp: new Date() },
      ];
      saveActions(mockActions);

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        actionsFilePath,
        JSON.stringify(mockActions, null, 2)
      );
    });
  });

  describe('getCredits', () => {
    it('should read credits from the file', () => {
      const mockCredits: Credit[] = [
        { type: 'A', value: 15, max: 20, lastUpdated: new Date() },
        { type: 'B', value: 9, max: 10, lastUpdated: new Date() },
        { type: 'C', value: 5, max: 30, lastUpdated: new Date() },
      ];
      (fs.readFileSync as jest.Mock).mockReturnValue(
        JSON.stringify(mockCredits)
      );

      const credits = getCredits();

      expect(fs.readFileSync).toHaveBeenCalledWith(creditsFilePath, 'utf8');
      expect(credits).toEqual(
        mockCredits.map((action) => ({
          ...action,
          lastUpdated: action.lastUpdated.toISOString(),
        }))
      );
    });
  });

  describe('saveCredits', () => {
    it('should write credits to the file', () => {
      const mockCredits: Credit[] = [
        { type: 'A', value: 15, max: 20, lastUpdated: new Date() },
        { type: 'B', value: 9, max: 10, lastUpdated: new Date() },
        { type: 'C', value: 5, max: 30, lastUpdated: new Date() },
      ];
      saveCredits(mockCredits);

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        creditsFilePath,
        JSON.stringify(mockCredits, null, 2)
      );
    });
  });
});
