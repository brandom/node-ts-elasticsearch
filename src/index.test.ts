import { Index } from './decorators/index.decorator';
import { Client, Field, Primary } from './index';
import { Elasticsearch } from './lib/elasticsearch';

describe('Main structure', () => {
  it('exposes official Client', () => {
    expect(Client).toBeDefined();
  });

  it('exposes Elasticsearch class', () => {
    expect(Elasticsearch).toBeDefined();
  });

  it('exposes Index decorator', () => {
    expect(Index).toBeDefined();
  });

  it('exposes Primary decorator', () => {
    expect(Primary).toBeDefined();
  });

  it('exposes Field decorator', () => {
    expect(Field).toBeDefined();
  });
});
