import ObjectType from './types/ObjectType'
import ObjectTypeProperty from './types/ObjectTypeProperty'
import { ExtractType } from './index'

export default function mergeInexact<T1 extends ObjectType<any>>(
  t1: T1
): ObjectType<ExtractType<T1>>
export default function mergeInexact<
  T1 extends ObjectType<any>,
  T2 extends ObjectType<any>
>(t1: T1, t2: T2): ObjectType<ExtractType<T1> & ExtractType<T2>>
export default function mergeInexact<
  T1 extends ObjectType<any>,
  T2 extends ObjectType<any>,
  T3 extends ObjectType<any>
>(
  t1: T1,
  t2: T2,
  t3: T3
): ObjectType<ExtractType<T1> & ExtractType<T2> & ExtractType<T3>>
export default function mergeInexact<
  T1 extends ObjectType<any>,
  T2 extends ObjectType<any>,
  T3 extends ObjectType<any>,
  T4 extends ObjectType<any>
>(
  t1: T1,
  t2: T2,
  t3: T3,
  t4: T4
): ObjectType<
  ExtractType<T1> & ExtractType<T2> & ExtractType<T3> & ExtractType<T4>
>
export default function mergeInexact<
  T1 extends ObjectType<any>,
  T2 extends ObjectType<any>,
  T3 extends ObjectType<any>,
  T4 extends ObjectType<any>,
  T5 extends ObjectType<any>
>(
  t1: T1,
  t2: T2,
  t3: T3,
  t4: T4,
  t5: T5
): ObjectType<
  ExtractType<T1> &
    ExtractType<T2> &
    ExtractType<T3> &
    ExtractType<T4> &
    ExtractType<T5>
>
export default function mergeInexact<
  T1 extends ObjectType<any>,
  T2 extends ObjectType<any>,
  T3 extends ObjectType<any>,
  T4 extends ObjectType<any>,
  T5 extends ObjectType<any>,
  T6 extends ObjectType<any>
>(
  t1: T1,
  t2: T2,
  t3: T3,
  t4: T4,
  t5: T5,
  t6: T6
): ObjectType<
  ExtractType<T1> &
    ExtractType<T2> &
    ExtractType<T3> &
    ExtractType<T4> &
    ExtractType<T5> &
    ExtractType<T6>
>
export default function mergeInexact<
  T1 extends ObjectType<any>,
  T2 extends ObjectType<any>,
  T3 extends ObjectType<any>,
  T4 extends ObjectType<any>,
  T5 extends ObjectType<any>,
  T6 extends ObjectType<any>,
  T7 extends ObjectType<any>
>(
  t1: T1,
  t2: T2,
  t3: T3,
  t4: T4,
  t5: T5,
  t6: T6,
  t7: T7
): ObjectType<
  ExtractType<T1> &
    ExtractType<T2> &
    ExtractType<T3> &
    ExtractType<T4> &
    ExtractType<T5> &
    ExtractType<T6> &
    ExtractType<T7>
>
export default function mergeInexact(
  ...types: ObjectType<any>[]
): ObjectType<any> {
  const properties: ObjectTypeProperty<any, any>[] = []
  for (const type of types) {
    for (const property of type.properties) properties.push(property.clone())
  }
  return new ObjectType(properties, false)
}
