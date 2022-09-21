// @flow

import Type from './types/Type'
import MergedObjectType from './types/MergedObjectType'
export default function merge<T1 extends Record<string, any>>(
  t1: Type<T1>
): Type<T1>
export default function merge<
  T1 extends Record<string, any>,
  T2 extends Record<string, any>
>(t1: Type<T1>, t2: Type<T2>): Type<T1 & T2>
export default function merge<
  T1 extends Record<string, any>,
  T2 extends Record<string, any>,
  T3 extends Record<string, any>
>(t1: Type<T1>, t2: Type<T2>, t3: Type<T3>): Type<T1 & T2 & T3>
export default function merge<
  T1 extends Record<string, any>,
  T2 extends Record<string, any>,
  T3 extends Record<string, any>,
  T4 extends Record<string, any>
>(
  t1: Type<T1>,
  t2: Type<T2>,
  t3: Type<T3>,
  t4: Type<T4>
): Type<T1 & T2 & T3 & T4>
export default function merge<
  T1 extends Record<string, any>,
  T2 extends Record<string, any>,
  T3 extends Record<string, any>,
  T4 extends Record<string, any>,
  T5 extends Record<string, any>
>(
  t1: Type<T1>,
  t2: Type<T2>,
  t3: Type<T3>,
  t4: Type<T4>,
  t5: Type<T5>
): Type<T1 & T2 & T3 & T4 & T5>
export default function merge<
  T1 extends Record<string, any>,
  T2 extends Record<string, any>,
  T3 extends Record<string, any>,
  T4 extends Record<string, any>,
  T5 extends Record<string, any>,
  T6 extends Record<string, any>
>(
  t1: Type<T1>,
  t2: Type<T2>,
  t3: Type<T3>,
  t4: Type<T4>,
  t5: Type<T5>,
  t6: Type<T6>
): Type<T1 & T2 & T3 & T4 & T5 & T6>
export default function merge<
  T1 extends Record<string, any>,
  T2 extends Record<string, any>,
  T3 extends Record<string, any>,
  T4 extends Record<string, any>,
  T5 extends Record<string, any>,
  T6 extends Record<string, any>,
  T7 extends Record<string, any>
>(
  t1: Type<T1>,
  t2: Type<T2>,
  t3: Type<T3>,
  t4: Type<T4>,
  t5: Type<T5>,
  t6: Type<T6>,
  t7: Type<T7>
): Type<T1 & T2 & T3 & T4 & T5 & T6 & T7>
export default function merge<
  T1 extends Record<string, any>,
  T2 extends Record<string, any>,
  T3 extends Record<string, any>,
  T4 extends Record<string, any>,
  T5 extends Record<string, any>,
  T6 extends Record<string, any>,
  T7 extends Record<string, any>,
  T8 extends Record<string, any>
>(
  t1: Type<T1>,
  t2: Type<T2>,
  t3: Type<T3>,
  t4: Type<T4>,
  t5: Type<T5>,
  t6: Type<T6>,
  t7: Type<T7>,
  t8: Type<T8>
): Type<T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8>
export default function merge(
  ...types: Type<Record<string, any>>[]
): Type<Record<string, any>> {
  return new MergedObjectType(types)
}
