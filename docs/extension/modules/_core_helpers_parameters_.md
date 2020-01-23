[cds-for-code](../README.md) › [Globals](../globals.md) › ["core/helpers/Parameters"](_core_helpers_parameters_.md)

# External module: "core/helpers/Parameters"

## Index

### Functions

* [arrayParameterCheck](_core_helpers_parameters_.md#arrayparametercheck)
* [batchIncompatible](_core_helpers_parameters_.md#batchincompatible)
* [batchNotStarted](_core_helpers_parameters_.md#batchnotstarted)
* [boolParameterCheck](_core_helpers_parameters_.md#boolparametercheck)
* [callbackParameterCheck](_core_helpers_parameters_.md#callbackparametercheck)
* [guidParameterCheck](_core_helpers_parameters_.md#guidparametercheck)
* [handleErrorResponse](_core_helpers_parameters_.md#handleerrorresponse)
* [handleHttpError](_core_helpers_parameters_.md#handlehttperror)
* [keyParameterCheck](_core_helpers_parameters_.md#keyparametercheck)
* [numberParameterCheck](_core_helpers_parameters_.md#numberparametercheck)
* [parameterCheck](_core_helpers_parameters_.md#parametercheck)
* [stringOrArrayParameterCheck](_core_helpers_parameters_.md#stringorarrayparametercheck)
* [stringParameterCheck](_core_helpers_parameters_.md#stringparametercheck)
* [throwParameterError](_core_helpers_parameters_.md#throwparametererror)

## Functions

###  arrayParameterCheck

▸ **arrayParameterCheck**(`parameter`: any[] | undefined, `functionName`: string, `parameterName`: string): *any[]*

Defined in src/core/helpers/Parameters.ts:52

**Parameters:**

Name | Type |
------ | ------ |
`parameter` | any[] &#124; undefined |
`functionName` | string |
`parameterName` | string |

**Returns:** *any[]*

___

###  batchIncompatible

▸ **batchIncompatible**(`functionName`: string, `isBatch`: boolean): *boolean*

Defined in src/core/helpers/Parameters.ts:190

**Parameters:**

Name | Type |
------ | ------ |
`functionName` | string |
`isBatch` | boolean |

**Returns:** *boolean*

___

###  batchNotStarted

▸ **batchNotStarted**(`isBatch`: boolean): *void*

Defined in src/core/helpers/Parameters.ts:199

**Parameters:**

Name | Type |
------ | ------ |
`isBatch` | boolean |

**Returns:** *void*

___

###  boolParameterCheck

▸ **boolParameterCheck**(`parameter`: boolean | undefined, `functionName`: string, `parameterName`: string): *boolean*

Defined in src/core/helpers/Parameters.ts:102

**Parameters:**

Name | Type |
------ | ------ |
`parameter` | boolean &#124; undefined |
`functionName` | string |
`parameterName` | string |

**Returns:** *boolean*

___

###  callbackParameterCheck

▸ **callbackParameterCheck**(`callbackParameter`: any | undefined, `functionName`: string, `parameterName`: string): *any*

Defined in src/core/helpers/Parameters.ts:175

**Parameters:**

Name | Type |
------ | ------ |
`callbackParameter` | any &#124; undefined |
`functionName` | string |
`parameterName` | string |

**Returns:** *any*

___

###  guidParameterCheck

▸ **guidParameterCheck**(`parameter`: string | undefined, `functionName`: string, `parameterName`: string): *string | undefined*

Defined in src/core/helpers/Parameters.ts:119

**Parameters:**

Name | Type |
------ | ------ |
`parameter` | string &#124; undefined |
`functionName` | string |
`parameterName` | string |

**Returns:** *string | undefined*

___

###  handleErrorResponse

▸ **handleErrorResponse**(`req`: any): *void*

Defined in src/core/helpers/Parameters.ts:7

**Parameters:**

Name | Type |
------ | ------ |
`req` | any |

**Returns:** *void*

___

###  handleHttpError

▸ **handleHttpError**(`parsedError`: any, `parameters?`: any): *[Error](../classes/_core_security_authentication_.authenticationerror.md#static-error)*

Defined in src/core/helpers/Parameters.ts:205

**Parameters:**

Name | Type |
------ | ------ |
`parsedError` | any |
`parameters?` | any |

**Returns:** *[Error](../classes/_core_security_authentication_.authenticationerror.md#static-error)*

___

###  keyParameterCheck

▸ **keyParameterCheck**(`parameter`: any | undefined, `functionName`: string, `parameterName`: string): *any*

Defined in src/core/helpers/Parameters.ts:144

**Parameters:**

Name | Type |
------ | ------ |
`parameter` | any &#124; undefined |
`functionName` | string |
`parameterName` | string |

**Returns:** *any*

___

###  numberParameterCheck

▸ **numberParameterCheck**(`parameter`: number | string | undefined, `functionName`: string, `parameterName`: string): *number | undefined*

Defined in src/core/helpers/Parameters.ts:81

**Parameters:**

Name | Type |
------ | ------ |
`parameter` | number &#124; string &#124; undefined |
`functionName` | string |
`parameterName` | string |

**Returns:** *number | undefined*

___

###  parameterCheck

▸ **parameterCheck**(`parameter`: any | undefined, `functionName`: string, `parameterName`: string, `type?`: string): *any*

Defined in src/core/helpers/Parameters.ts:18

**Parameters:**

Name | Type |
------ | ------ |
`parameter` | any &#124; undefined |
`functionName` | string |
`parameterName` | string |
`type?` | string |

**Returns:** *any*

___

###  stringOrArrayParameterCheck

▸ **stringOrArrayParameterCheck**(`parameter`: any[] | string | undefined, `functionName`: string, `parameterName`: string): *any[] | string*

Defined in src/core/helpers/Parameters.ts:69

**Parameters:**

Name | Type |
------ | ------ |
`parameter` | any[] &#124; string &#124; undefined |
`functionName` | string |
`parameterName` | string |

**Returns:** *any[] | string*

___

###  stringParameterCheck

▸ **stringParameterCheck**(`parameter`: string | undefined, `functionName`: string, `parameterName`: string): *string*

Defined in src/core/helpers/Parameters.ts:35

**Parameters:**

Name | Type |
------ | ------ |
`parameter` | string &#124; undefined |
`functionName` | string |
`parameterName` | string |

**Returns:** *string*

___

###  throwParameterError

▸ **throwParameterError**(`functionName`: string, `parameterName`: string, `type?`: string): *void*

Defined in src/core/helpers/Parameters.ts:1

**Parameters:**

Name | Type |
------ | ------ |
`functionName` | string |
`parameterName` | string |
`type?` | string |

**Returns:** *void*
