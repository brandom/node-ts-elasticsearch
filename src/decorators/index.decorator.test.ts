import { DECORATORS } from '../constants';
import { IndexStore } from '../lib/index-store';
import { Index } from './index.decorator';

describe('pathOrOptions as string', () => {
  it('uses class name as index', () => {
    @Index()
    class Tweet {}

    const index = Reflect.getMetadata(DECORATORS.INDEX, Tweet);
    expect(index).toEqual({ index: 'tweet' });
  });

  it('uses explicit index in lower case', () => {
    @Index('TweeTer')
    class Tweet {}

    const index = Reflect.getMetadata(DECORATORS.INDEX, Tweet);
    expect(index).toEqual({ index: 'tweeter' });
  });

  it('uses explicit index and options settings', () => {
    const settings = {
      number_of_shards: 3,
    };

    @Index('tweeter', { settings })
    class Tweet {}

    const index = Reflect.getMetadata(DECORATORS.INDEX, Tweet);
    expect(index).toEqual({
      index: 'tweeter',
      settings: {
        number_of_shards: 3,
      },
    });
  });
});

describe('only options object', () => {
  it('uses implicit index', () => {
    const settings = {
      number_of_shards: 3,
    };

    @Index({ settings })
    class Tweet {}

    const index = Reflect.getMetadata(DECORATORS.INDEX, Tweet);
    expect(index).toEqual({
      index: 'tweet',
      settings: {
        number_of_shards: 3,
      },
    });
  });

  it('uses explicit index', () => {
    const settings = {
      number_of_shards: 3,
    };

    @Index({ index: 'twitter', settings })
    class Tweet {}

    const index = Reflect.getMetadata(DECORATORS.INDEX, Tweet);
    expect(index).toEqual({
      index: 'twitter',
      settings: {
        number_of_shards: 3,
      },
    });
  });
});

describe('@index', () => {
  it('store the class in the IndexStore', () => {
    const spy = jest.spyOn(IndexStore, 'add');

    const define = () => {
      @Index()
      class Tweet {}
      return Tweet;
    };

    const cls = define();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(cls);

    spy.mockRestore();
  });
});
