// @flow

import Type from './types/Type'
import MergedObjectType from './types/MergedObjectType'

export default function mergeInexact<T1 extends {}>(t1: Type<T1>): Type<T1>
export default function mergeInexact<T1 extends {}, T2 extends {}>(
  t1: Type<T1>,
  t2: Type<T2>
): Type<T1 & T2>
export default function mergeInexact<
  T1 extends {},
  T2 extends {},
  T3 extends {}
>(t1: Type<T1>, t2: Type<T2>, t3: Type<T3>): Type<T1 & T2 & T3>
export default function mergeInexact<
  T1 extends {},
  T2 extends {},
  T3 extends {},
  T4 extends {}
>(
  t1: Type<T1>,
  t2: Type<T2>,
  t3: Type<T3>,
  t4: Type<T4>
): Type<T1 & T2 & T3 & T4>
export default function mergeInexact<
  T1 extends {},
  T2 extends {},
  T3 extends {},
  T4 extends {},
  T5 extends {}
>(
  t1: Type<T1>,
  t2: Type<T2>,
  t3: Type<T3>,
  t4: Type<T4>,
  t5: Type<T5>
): Type<T1 & T2 & T3 & T4 & T5>
export default function mergeInexact<
  T1 extends {},
  T2 extends {},
  T3 extends {},
  T4 extends {},
  T5 extends {},
  T6 extends {}
>(
  t1: Type<T1>,
  t2: Type<T2>,
  t3: Type<T3>,
  t4: Type<T4>,
  t5: Type<T5>,
  t6: Type<T6>
): Type<T1 & T2 & T3 & T4 & T5 & T6>
export default function mergeInexact<
  T1 extends {},
  T2 extends {},
  T3 extends {},
  T4 extends {},
  T5 extends {},
  T6 extends {},
  T7 extends {}
>(
  t1: Type<T1>,
  t2: Type<T2>,
  t3: Type<T3>,
  t4: Type<T4>,
  t5: Type<T5>,
  t6: Type<T6>,
  t7: Type<T7>
): Type<T1 & T2 & T3 & T4 & T5 & T6 & T7>
export default function mergeInexact<
  T1 extends {},
  T2 extends {},
  T3 extends {},
  T4 extends {},
  T5 extends {},
  T6 extends {},
  T7 extends {},
  T8 extends {}
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

export default function mergeInexact(...types: Type<{}>[]): Type<{}> {
  return new MergedObjectType(types, false)
}
