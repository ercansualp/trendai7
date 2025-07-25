/**
 * Generated by orval v7.10.0 🍺
 * Do not edit manually.
 * BackendForAdmin
 * OpenAPI spec version: v1
 */
import type { Type } from './type';
import type { ConstructorInfo } from './constructorInfo';
import type { CustomAttributeTypedArgument } from './customAttributeTypedArgument';
import type { CustomAttributeNamedArgument } from './customAttributeNamedArgument';

export interface CustomAttributeData {
  attributeType?: Type;
  constructor?: ConstructorInfo;
  /** @nullable */
  readonly constructorArguments?: readonly CustomAttributeTypedArgument[] | null;
  /** @nullable */
  readonly namedArguments?: readonly CustomAttributeNamedArgument[] | null;
}
