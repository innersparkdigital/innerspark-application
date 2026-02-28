/**
 * Responsive Scaling Utility
 * 
 * Provides scaling functions that adapt UI elements proportionally
 * based on the device screen width. Uses iPhone 8/SE2 (375px) 
 * as the design baseline.
 * 
 * Usage:
 *   import { scale, moderateScale, verticalScale } from '../global/Scaling';
 * 
 *   // For widths, margins, paddings:
 *   { width: scale(200) }        // scales linearly with screen width
 * 
 *   // For font sizes (scales less aggressively):
 *   { fontSize: moderateScale(24) }
 * 
 *   // For heights:
 *   { height: verticalScale(200) }
 */
import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Design baseline dimensions (iPhone 8 / SE 2nd gen)
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

/**
 * Scale a value linearly based on screen width.
 * Best for: widths, horizontal paddings, margins, icon sizes.
 * 
 * On 375px phone: scale(20) = 20
 * On 320px phone: scale(20) = 17.07
 * On 430px phone: scale(20) = 22.93
 */
export const scale = (size: number): number => (SCREEN_WIDTH / BASE_WIDTH) * size;

/**
 * Scale a value linearly based on screen height.
 * Best for: vertical spacings, image heights.
 */
export const verticalScale = (size: number): number => (SCREEN_HEIGHT / BASE_HEIGHT) * size;

/**
 * Scale a value with a dampening factor (default 0.5).
 * Scales less aggressively than `scale()` — perfect for font sizes
 * where you want proportional but not extreme changes.
 * 
 * factor = 0: no scaling at all (returns original size)
 * factor = 0.5: half the scaling of `scale()` (default, best for fonts)
 * factor = 1: same as `scale()`
 * 
 * On 375px phone: moderateScale(24) = 24
 * On 320px phone: moderateScale(24) = 22.24 (instead of 20.48 with full scale)
 * On 430px phone: moderateScale(24) = 25.76 (instead of 27.52 with full scale)
 */
export const moderateScale = (size: number, factor: number = 0.5): number =>
    size + (scale(size) - size) * factor;

// Export screen dimensions for direct use
export { SCREEN_WIDTH, SCREEN_HEIGHT };
