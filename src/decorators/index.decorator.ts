import { DECORATORS } from '../constants';
import { IndexStore } from '../lib/index-store';
import { AnyClass } from '../types';

export interface IIndexOptions {
  index?: string;
  type?: string;
  settings?: any;
}

/**
 * Index decorator factory
 */
export function Index(pathOrOptions?: IIndexOptions): <T extends AnyClass>(target: T) => T;
export function Index(pathOrOptions: string, indexOptions?: IIndexOptions): <T extends AnyClass>(target: T) => T;
export function Index(pathOrOptions?: string | IIndexOptions, indexOptions?: IIndexOptions): <T extends AnyClass>(target: T) => T {
  /**
   * Index decorator
   * Store class description into class metadata using DECORATORS.INDEX key
   */
  return <T extends AnyClass>(target: T): T => {
    const options: IIndexOptions = (pathOrOptions && typeof pathOrOptions === 'object' ? pathOrOptions : indexOptions) || {};
    const index: string = (typeof pathOrOptions === 'string' ? pathOrOptions : options.index) || target.name;
    const meta = Reflect.getMetadata(DECORATORS.INDEX, target) || {};

    Reflect.defineMetadata(DECORATORS.INDEX, { ...meta, index: index.toLowerCase(), settings: options.settings }, target);
    IndexStore.add(target);
    return target;
  };
}
