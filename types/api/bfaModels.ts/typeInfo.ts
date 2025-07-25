/**
 * Generated by orval v7.10.0 🍺
 * Do not edit manually.
 * BackendForAdmin
 * OpenAPI spec version: v1
 */
import type { CustomAttributeData } from './customAttributeData';
import type { MemberTypes } from './memberTypes';
import type { Assembly } from './assembly';
import type { Module } from './module';
import type { Type } from './type';
import type { MethodBase } from './methodBase';
import type { GenericParameterAttributes } from './genericParameterAttributes';
import type { TypeAttributes } from './typeAttributes';
import type { StructLayoutAttribute } from './structLayoutAttribute';
import type { ConstructorInfo } from './constructorInfo';
import type { RuntimeTypeHandle } from './runtimeTypeHandle';
import type { EventInfo } from './eventInfo';
import type { FieldInfo } from './fieldInfo';
import type { MemberInfo } from './memberInfo';
import type { MethodInfo } from './methodInfo';
import type { PropertyInfo } from './propertyInfo';

export interface TypeInfo {
  /** @nullable */
  readonly name?: string | null;
  /** @nullable */
  readonly customAttributes?: readonly CustomAttributeData[] | null;
  readonly isCollectible?: boolean;
  readonly metadataToken?: number;
  memberType?: MemberTypes;
  /** @nullable */
  readonly namespace?: string | null;
  /** @nullable */
  readonly assemblyQualifiedName?: string | null;
  /** @nullable */
  readonly fullName?: string | null;
  assembly?: Assembly;
  module?: Module;
  readonly isInterface?: boolean;
  readonly isNested?: boolean;
  declaringType?: Type;
  declaringMethod?: MethodBase;
  reflectedType?: Type;
  underlyingSystemType?: Type;
  readonly isTypeDefinition?: boolean;
  readonly isArray?: boolean;
  readonly isByRef?: boolean;
  readonly isPointer?: boolean;
  readonly isConstructedGenericType?: boolean;
  readonly isGenericParameter?: boolean;
  readonly isGenericTypeParameter?: boolean;
  readonly isGenericMethodParameter?: boolean;
  readonly isGenericType?: boolean;
  readonly isGenericTypeDefinition?: boolean;
  readonly isSZArray?: boolean;
  readonly isVariableBoundArray?: boolean;
  readonly isByRefLike?: boolean;
  readonly isFunctionPointer?: boolean;
  readonly isUnmanagedFunctionPointer?: boolean;
  readonly hasElementType?: boolean;
  /** @nullable */
  readonly genericTypeArguments?: readonly Type[] | null;
  readonly genericParameterPosition?: number;
  genericParameterAttributes?: GenericParameterAttributes;
  attributes?: TypeAttributes;
  readonly isAbstract?: boolean;
  readonly isImport?: boolean;
  readonly isSealed?: boolean;
  readonly isSpecialName?: boolean;
  readonly isClass?: boolean;
  readonly isNestedAssembly?: boolean;
  readonly isNestedFamANDAssem?: boolean;
  readonly isNestedFamily?: boolean;
  readonly isNestedFamORAssem?: boolean;
  readonly isNestedPrivate?: boolean;
  readonly isNestedPublic?: boolean;
  readonly isNotPublic?: boolean;
  readonly isPublic?: boolean;
  readonly isAutoLayout?: boolean;
  readonly isExplicitLayout?: boolean;
  readonly isLayoutSequential?: boolean;
  readonly isAnsiClass?: boolean;
  readonly isAutoClass?: boolean;
  readonly isUnicodeClass?: boolean;
  readonly isCOMObject?: boolean;
  readonly isContextful?: boolean;
  readonly isEnum?: boolean;
  readonly isMarshalByRef?: boolean;
  readonly isPrimitive?: boolean;
  readonly isValueType?: boolean;
  readonly isSignatureType?: boolean;
  readonly isSecurityCritical?: boolean;
  readonly isSecuritySafeCritical?: boolean;
  readonly isSecurityTransparent?: boolean;
  structLayoutAttribute?: StructLayoutAttribute;
  typeInitializer?: ConstructorInfo;
  typeHandle?: RuntimeTypeHandle;
  readonly guid?: string;
  baseType?: Type;
  /** @deprecated */
  readonly isSerializable?: boolean;
  readonly containsGenericParameters?: boolean;
  readonly isVisible?: boolean;
  /** @nullable */
  readonly genericTypeParameters?: readonly Type[] | null;
  /** @nullable */
  readonly declaredConstructors?: readonly ConstructorInfo[] | null;
  /** @nullable */
  readonly declaredEvents?: readonly EventInfo[] | null;
  /** @nullable */
  readonly declaredFields?: readonly FieldInfo[] | null;
  /** @nullable */
  readonly declaredMembers?: readonly MemberInfo[] | null;
  /** @nullable */
  readonly declaredMethods?: readonly MethodInfo[] | null;
  /** @nullable */
  readonly declaredNestedTypes?: readonly TypeInfo[] | null;
  /** @nullable */
  readonly declaredProperties?: readonly PropertyInfo[] | null;
  /** @nullable */
  readonly implementedInterfaces?: readonly Type[] | null;
}
