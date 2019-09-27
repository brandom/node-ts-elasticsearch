import { Client, RequestParams } from '@elastic/elasticsearch';

import { IndexedClass } from '../types';
import { ICoreOptions } from './core';
import { getIndexMetadata, getPropertiesMetadata } from './metadata-handler';
import { getPureMapping } from './tools';

export type IndexedIndicesFlushParams = RequestParams.IndicesFlush;

export class Indices {
  constructor(private readonly client: Client, private readonly options: ICoreOptions) {}

  /**
   * Creates an index
   */
  async create<T>(cls: IndexedClass<T>): Promise<any> {
    const metadata = getIndexMetadata(this.options, cls);
    return await this.client.indices.create({ index: metadata.index, body: { settings: { index: metadata.settings } } });
  }

  /**
   * Delete an index
   */
  async delete<T>(cls: IndexedClass<T>): Promise<any> {
    const metadata = getIndexMetadata(this.options, cls);
    return await this.client.indices.delete({ index: metadata.index });
  }

  /**
   * Returns true if index exists
   */
  async exists<T>(cls: IndexedClass<T>): Promise<boolean> {
    const metadata = getIndexMetadata(this.options, cls);
    return ((await this.client.indices.exists({ index: metadata.index })) as unknown) as boolean;
  }

  /**
   * Explicitly flush one index
   */
  flush<T>(cls: IndexedClass<T>, params?: IndexedIndicesFlushParams): Promise<any> {
    const metadata = getIndexMetadata(this.options, cls);
    const flushParams: RequestParams.IndicesFlush = { index: metadata.index, ...params };
    return this.client.indices.flush(flushParams);
  }

  /**
   * Put class mapping to an index
   */
  async putMapping<T>(cls: IndexedClass<T>): Promise<any> {
    const metadata = getIndexMetadata(this.options, cls);
    const fieldsMetadata = getPropertiesMetadata(cls);
    return await this.client.indices.putMapping({
      index: metadata.index,
      body: {
        dynamic: metadata.dynamic,
        properties: getPureMapping(fieldsMetadata),
      },
    });
  }

  /**
   * Refresh an index
   */
  async refresh<T>(cls: IndexedClass<T>): Promise<any> {
    const metadata = getIndexMetadata(this.options, cls);
    return this.client.indices.refresh({ index: metadata.index });
  }
}
