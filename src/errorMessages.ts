const errorMessages = {
  ERR_CONSTRAINT_VIOLATION: 'violated a constraint',
  ERR_EXPECT_ARRAY: 'must be an Array',
  ERR_EXPECT_BOOLEAN: 'must be true or false',
  ERR_EXPECT_EMPTY: 'must be empty',
  ERR_EXPECT_EXACT_VALUE: 'must be $0',
  ERR_EXPECT_INSTANCEOF: 'must be an instance of $0',
  ERR_EXPECT_KEY_TYPE: 'keys must be: $0',
  ERR_EXPECT_NUMBER: 'must be a number',
  ERR_EXPECT_OBJECT: 'must be an object',
  ERR_EXPECT_STRING: 'must be a string',
  ERR_EXPECT_SYMBOL: 'must be a symbol',
  ERR_EXPECT_VOID: 'must be undefined',
  ERR_EXPECT_LENGTH: 'must have length of $0',
  ERR_MISSING_PROPERTY:
    '$parentPath is missing required property: $lastPathElement',
  ERR_NO_INDEXER: 'is not one of the permitted indexer types',
  ERR_NO_UNION: 'must be one of: $0',
  ERR_UNKNOWN_PROPERTY: '$parentPath has unknown property: $lastPathElement',
}

export type ErrorKey = keyof typeof errorMessages

export default errorMessages
