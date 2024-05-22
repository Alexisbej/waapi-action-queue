import { actionExecutor, recalculateCreditsInterval } from './executor';
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

jest.mock('./storage/storage', () => ({
  getActions: jest.fn(),
  getCredits: jest.fn(),
  saveActions: jest.fn(),
  saveCredits: jest.fn(),
}));

jest.mock('./utils/calculateCredits', () => ({
  calculateCredits: jest.fn(),
}));

jest.useFakeTimers();

beforeEach(() => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('actionExecutor', () => {
  it('should execute an action if there are sufficient credits', () => {
    const mockActions = [{ type: 'A' }];
    const mockCredits = [{ type: 'A', value: 1 }];

    (getActions as jest.Mock).mockReturnValue(mockActions);
    (getCredits as jest.Mock).mockReturnValue(mockCredits);

    actionExecutor();

    jest.advanceTimersByTime(ACTION_QUEUE_EXECUTION_TIMEOUT);

    expect(getActions).toHaveBeenCalled();
    expect(getCredits).toHaveBeenCalled();
    expect(saveCredits).toHaveBeenCalledWith([{ type: 'A', value: 0 }]);
    expect(saveActions).toHaveBeenCalledWith([]);
    expect(console.log).toHaveBeenCalledWith('Executed action: A');
  });

  it('should log insufficient credits if credits are not enough', () => {
    const mockActions = [{ type: 'A' }];
    const mockCredits = [{ type: 'A', value: 0 }];

    (getActions as jest.Mock).mockReturnValue(mockActions);
    (getCredits as jest.Mock).mockReturnValue(mockCredits);

    actionExecutor();

    jest.advanceTimersByTime(ACTION_QUEUE_EXECUTION_TIMEOUT);

    expect(getActions).toHaveBeenCalled();
    expect(getCredits).toHaveBeenCalled();
    expect(saveCredits).not.toHaveBeenCalled();
    expect(saveActions).not.toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith(
      'Insufficient credits for action: A'
    );
  });

  it('should not execute any action if the queue is empty', () => {
    const mockActions: any[] = [];
    const mockCredits = [{ type: 'A', value: 1 }];

    (getActions as jest.Mock).mockReturnValue(mockActions);
    (getCredits as jest.Mock).mockReturnValue(mockCredits);

    actionExecutor();

    jest.advanceTimersByTime(ACTION_QUEUE_EXECUTION_TIMEOUT);

    expect(getActions).toHaveBeenCalled();
    expect(getCredits).not.toHaveBeenCalled();
    expect(saveCredits).not.toHaveBeenCalled();
    expect(saveActions).not.toHaveBeenCalled();
    expect(console.log).not.toHaveBeenCalledWith('Executed action: A');
  });
});

describe('recalculateCreditsInterval', () => {
  it('should recalculate credits if the elapsed time exceeds the timeout', () => {
    const mockCredits = [
      {
        type: 'A',
        value: 5,
        max: 10,
        lastUpdated: new Date(Date.now() - CREDIT_RECALCULATION_TIMEOUT - 1000),
      },
    ];
    const updatedCredits = [
      { type: 'A', value: 8, max: 10, lastUpdated: new Date() },
    ];

    (getCredits as jest.Mock).mockReturnValue(mockCredits);
    (calculateCredits as jest.Mock).mockImplementation(
      (credit) => updatedCredits.find((c) => c.type === credit.type) || credit
    );

    recalculateCreditsInterval();

    jest.advanceTimersByTime(CREDIT_RECALCULATION_TIMEOUT);

    expect(getCredits).toHaveBeenCalled();
    expect(calculateCredits).toHaveBeenCalledWith(mockCredits[0]);
    expect(saveCredits).toHaveBeenCalledWith(updatedCredits);
    expect(console.log).toHaveBeenCalledWith('credits', updatedCredits);
  });

  it('should not recalculate credits if the elapsed time does not exceed the timeout', () => {
    const mockCredits = [
      { type: 'A', value: 5, max: 10, lastUpdated: new Date() },
    ];

    (getCredits as jest.Mock).mockReturnValue(mockCredits);

    recalculateCreditsInterval();

    jest.advanceTimersByTime(CREDIT_RECALCULATION_TIMEOUT - 1000);

    expect(getCredits).not.toHaveBeenCalled();
    expect(calculateCredits).not.toHaveBeenCalled();
    expect(saveCredits).not.toHaveBeenCalled();
    expect(console.log).not.toHaveBeenCalledWith('credits', expect.anything());
  });
});
