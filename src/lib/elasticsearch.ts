import { Client, ClientOptions } from '@elastic/elasticsearch';

import { Core, ICoreOptions } from './core';
import { Indices } from './indices';

export interface IConfigOptions extends ClientOptions {
  indexPrefix?: string;
  client?: Client;
}

export class Elasticsearch extends Core {
  /**
   * Split IConfigOptions into ConfigOptions and ICoreOptions
   * @param options
   */
  private static splitOptions(options: IConfigOptions): { clientOptions: ClientOptions; coreOptions: ICoreOptions } {
    const coreOptions: ICoreOptions = {};
    const clientOptions = { ...options };

    delete clientOptions.indexPrefix;
    delete clientOptions.client;

    coreOptions.indexPrefix = options.indexPrefix;

    return { clientOptions, coreOptions };
  }
  public indices: Indices;

  constructor(clientOrOptions: Client | IConfigOptions) {
    let client: Client;
    let coreOptions: ICoreOptions = {};
    let clientOptions: ClientOptions = {};

    if (clientOrOptions.constructor && clientOrOptions instanceof Client) {
      client = clientOrOptions as Client;
    } else {
      const options: IConfigOptions = clientOrOptions as IConfigOptions;
      ({ coreOptions, clientOptions } = Elasticsearch.splitOptions(options));
      client = options.client || new Client(clientOptions);
    }

    super(client, coreOptions);
    this.indices = new Indices(client, coreOptions);
  }
}
