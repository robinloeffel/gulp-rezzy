import { Transform } from 'stream';
import sharp from 'sharp';

interface RezzyVersion {
  /**
   * Desired width of the image in pixels. Either `width` or `height` has to be set.
   */
  width?: number,

  /**
   * Desired height of the image in pixels. Either `height` or `width` has to be set.
   */
  height?: number,

  /**
   * How the image should fit inside the specified dimensions.
   */
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside',

  /**
   * What or where to focus on when cropping is necessary.
   */
  position?:
    'top' | 'right top' | 'right' | 'right bottom' | 'bottom' | 'left bottom' | 'left' | 'left top' |
    'north' | 'northeast' | 'east' | 'southeast' | 'south' | 'southwest' | 'west' | 'northwest' | 'center' | 'centre' |
    'entropy' | 'attention',

  /**
   * String to prepend the file extension.
   */
  suffix: string
}

declare function rezzy(versions: RezzyVersion[]): Transform;

export = rezzy;
