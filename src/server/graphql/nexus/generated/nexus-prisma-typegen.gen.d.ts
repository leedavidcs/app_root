import * as prisma from '@prisma/client';
import { core } from 'nexus';
import { GraphQLResolveInfo } from 'graphql';

// Types helpers
  type IsModelNameExistsInGraphQLTypes<
  ReturnType extends any
> = ReturnType extends core.GetGen<'objectNames'> ? true : false;

type NexusPrismaScalarOpts = {
  alias?: string;
};

type Pagination = {
  first?: boolean;
  last?: boolean;
  before?: boolean;
  after?: boolean;
  skip?: boolean;
};

type RootObjectTypes = Pick<
  core.GetGen<'rootTypes'>,
  core.GetGen<'objectNames'>
>;

/**
 * Determine if `B` is a subset (or equivalent to) of `A`.
*/
type IsSubset<A, B> = keyof A extends never
  ? false
  : B extends A
  ? true
  : false;

type OmitByValue<T, ValueType> = Pick<
  T,
  { [Key in keyof T]: T[Key] extends ValueType ? never : Key }[keyof T]
>;

type GetSubsetTypes<ModelName extends any> = keyof OmitByValue<
  {
    [P in keyof RootObjectTypes]: ModelName extends keyof ModelTypes
      ? IsSubset<RootObjectTypes[P], ModelTypes[ModelName]> extends true
        ? RootObjectTypes[P]
        : never
      : never;
  },
  never
>;

type SubsetTypes<ModelName extends any> = GetSubsetTypes<
  ModelName
> extends never
  ? `ERROR: No subset types are available. Please make sure that one of your GraphQL type is a subset of your t.model('<ModelName>')`
  : GetSubsetTypes<ModelName>;

type DynamicRequiredType<ReturnType extends any> = IsModelNameExistsInGraphQLTypes<
  ReturnType
> extends true
  ? { type?: SubsetTypes<ReturnType> }
  : { type: SubsetTypes<ReturnType> };

type GetNexusPrismaInput<
  ModelName extends any,
  MethodName extends any,
  InputName extends 'filtering' | 'ordering'
> = ModelName extends keyof NexusPrismaInputs
  ? MethodName extends keyof NexusPrismaInputs[ModelName]
    ? NexusPrismaInputs[ModelName][MethodName][InputName]
    : never
  : never;

/**
 *  Represents arguments required by Prisma Client JS that will
 *  be derived from a request's input (args, context, and info)
 *  and omitted from the GraphQL API. The object itself maps the
 *  names of these args to a function that takes an object representing
 *  the request's input and returns the value to pass to the prisma
 *  arg of the same name.
 */
export type LocalComputedInputs<MethodName extends any> = Record<
  string,
  (params: LocalMutationResolverParams<MethodName>) => unknown
>

export type GlobalComputedInputs = Record<
  string,
  (params: GlobalMutationResolverParams) => unknown
>

type BaseMutationResolverParams = {
  info: GraphQLResolveInfo
  ctx: Context
}

export type GlobalMutationResolverParams = BaseMutationResolverParams & {
  args: Record<string, any> & { data: unknown }
}

export type LocalMutationResolverParams<
  MethodName extends any
> = BaseMutationResolverParams & {
  args: MethodName extends keyof core.GetGen2<'argTypes', 'Mutation'>
    ? core.GetGen3<'argTypes', 'Mutation', MethodName>
    : any
}

export type Context = core.GetGen<'context'>

type NexusPrismaRelationOpts<
  ModelName extends any,
  MethodName extends any,
  ReturnType extends any
> = GetNexusPrismaInput<
  // If GetNexusPrismaInput returns never, it means there are no filtering/ordering args for it.
  ModelName,
  MethodName,
  'filtering'
> extends never
  ? {
      alias?: string;
      computedInputs?: LocalComputedInputs<MethodName>;
    } & DynamicRequiredType<ReturnType>
  : {
      alias?: string;
      computedInputs?: LocalComputedInputs<MethodName>;
      filtering?:
        | boolean
        | Partial<
            Record<
              GetNexusPrismaInput<ModelName, MethodName, 'filtering'>,
              boolean
            >
          >;
      ordering?:
        | boolean
        | Partial<
            Record<
              GetNexusPrismaInput<ModelName, MethodName, 'ordering'>,
              boolean
            >
          >;
      pagination?: boolean | Pagination;
    } & DynamicRequiredType<ReturnType>;

type IsScalar<TypeName extends any> = TypeName extends core.GetGen<'scalarNames'>
  ? true
  : false;

type IsObject<Name extends any> = Name extends core.GetGen<'objectNames'>
  ? true
  : false

type IsEnum<Name extends any> = Name extends core.GetGen<'enumNames'>
  ? true
  : false

type IsInputObject<Name extends any> = Name extends core.GetGen<'inputNames'>
  ? true
  : false

/**
 * The kind that a GraphQL type may be.
 */
type Kind = 'Enum' | 'Object' | 'Scalar' | 'InputObject'

/**
 * Helper to safely reference a Kind type. For example instead of the following
 * which would admit a typo:
 *
 * ```ts
 * type Foo = Bar extends 'scalar' ? ...
 * ```
 *
 * You can do this which guarantees a correct reference:
 *
 * ```ts
 * type Foo = Bar extends AKind<'Scalar'> ? ...
 * ```
 *
 */
type AKind<T extends Kind> = T

type GetKind<Name extends any> = IsEnum<Name> extends true
  ? 'Enum'
  : IsScalar<Name> extends true
  ? 'Scalar'
  : IsObject<Name> extends true
  ? 'Object'
  : IsInputObject<Name> extends true
  ? 'InputObject'
  // FIXME should be `never`, but GQL objects named differently
  // than backing type fall into this branch
  : 'Object'

type NexusPrismaFields<ModelName extends keyof NexusPrismaTypes> = {
  [MethodName in keyof NexusPrismaTypes[ModelName]]: NexusPrismaMethod<
    ModelName,
    MethodName,
    GetKind<NexusPrismaTypes[ModelName][MethodName]> // Is the return type a scalar?
  >;
};

type NexusPrismaMethod<
  ModelName extends keyof NexusPrismaTypes,
  MethodName extends keyof NexusPrismaTypes[ModelName],
  ThisKind extends Kind,
  ReturnType extends any = NexusPrismaTypes[ModelName][MethodName]
> =
  ThisKind extends AKind<'Enum'>
  ? () => NexusPrismaFields<ModelName>
  : ThisKind extends AKind<'Scalar'>
  ? (opts?: NexusPrismaScalarOpts) => NexusPrismaFields<ModelName> // Return optional scalar opts
  : IsModelNameExistsInGraphQLTypes<ReturnType> extends true // If model name has a mapped graphql types
  ? (
      opts?: NexusPrismaRelationOpts<ModelName, MethodName, ReturnType>
    ) => NexusPrismaFields<ModelName> // Then make opts optional
  : (
      opts: NexusPrismaRelationOpts<ModelName, MethodName, ReturnType>
    ) => NexusPrismaFields<ModelName>; // Else force use input the related graphql type -> { type: '...' }

type GetNexusPrismaMethod<
  TypeName extends string
> = TypeName extends keyof NexusPrismaMethods
  ? NexusPrismaMethods[TypeName]
  : <CustomTypeName extends keyof ModelTypes>(
      typeName: CustomTypeName
    ) => NexusPrismaMethods[CustomTypeName];

type GetNexusPrisma<
  TypeName extends string,
  ModelOrCrud extends 'model' | 'crud'
> = ModelOrCrud extends 'model'
  ? TypeName extends 'Mutation'
    ? never
    : TypeName extends 'Query'
    ? never
    : GetNexusPrismaMethod<TypeName>
  : ModelOrCrud extends 'crud'
  ? TypeName extends 'Mutation'
    ? GetNexusPrismaMethod<TypeName>
    : TypeName extends 'Query'
    ? GetNexusPrismaMethod<TypeName>
    : never
  : never;
  

// Generated
interface ModelTypes {
  User: prisma.User
  StockPortfolio: prisma.StockPortfolio
  Balance: prisma.Balance
  Transaction: prisma.Transaction
}
  
interface NexusPrismaInputs {
  Query: {
    users: {
  filtering: 'id' | 'email' | 'emailVerified' | 'password' | 'username' | 'createdAt' | 'updatedAt' | 'stockPortfolios' | 'balances' | 'transactions' | 'AND' | 'OR' | 'NOT'
  ordering: 'id' | 'email' | 'emailVerified' | 'password' | 'username' | 'createdAt' | 'updatedAt'
}
    stockPortfolios: {
  filtering: 'id' | 'name' | 'createdAt' | 'updatedAt' | 'AND' | 'OR' | 'NOT' | 'user'
  ordering: 'id' | 'user' | 'name' | 'createdAt' | 'updatedAt'
}
    balances: {
  filtering: 'credits' | 'AND' | 'OR' | 'NOT' | 'user'
  ordering: 'user' | 'credits'
}
    transactions: {
  filtering: 'id' | 'creditsBefore' | 'creditsTransacted' | 'createdAt' | 'AND' | 'OR' | 'NOT' | 'user'
  ordering: 'id' | 'user' | 'creditsBefore' | 'creditsTransacted' | 'createdAt'
}

  },
    User: {
    stockPortfolios: {
  filtering: 'id' | 'name' | 'createdAt' | 'updatedAt' | 'AND' | 'OR' | 'NOT' | 'user'
  ordering: 'id' | 'user' | 'name' | 'createdAt' | 'updatedAt'
}
    balances: {
  filtering: 'credits' | 'AND' | 'OR' | 'NOT' | 'user'
  ordering: 'user' | 'credits'
}
    transactions: {
  filtering: 'id' | 'creditsBefore' | 'creditsTransacted' | 'createdAt' | 'AND' | 'OR' | 'NOT' | 'user'
  ordering: 'id' | 'user' | 'creditsBefore' | 'creditsTransacted' | 'createdAt'
}

  },  StockPortfolio: {


  },  Balance: {


  },  Transaction: {


  }
}

interface NexusPrismaTypes {
  Query: {
    user: 'User'
    users: 'User'
    stockPortfolio: 'StockPortfolio'
    stockPortfolios: 'StockPortfolio'
    balance: 'Balance'
    balances: 'Balance'
    transaction: 'Transaction'
    transactions: 'Transaction'

  },
  Mutation: {
    createOneUser: 'User'
    updateOneUser: 'User'
    updateManyUser: 'BatchPayload'
    deleteOneUser: 'User'
    deleteManyUser: 'BatchPayload'
    upsertOneUser: 'User'
    createOneStockPortfolio: 'StockPortfolio'
    updateOneStockPortfolio: 'StockPortfolio'
    updateManyStockPortfolio: 'BatchPayload'
    deleteOneStockPortfolio: 'StockPortfolio'
    deleteManyStockPortfolio: 'BatchPayload'
    upsertOneStockPortfolio: 'StockPortfolio'
    createOneBalance: 'Balance'
    updateOneBalance: 'Balance'
    updateManyBalance: 'BatchPayload'
    deleteOneBalance: 'Balance'
    deleteManyBalance: 'BatchPayload'
    upsertOneBalance: 'Balance'
    createOneTransaction: 'Transaction'
    updateOneTransaction: 'Transaction'
    updateManyTransaction: 'BatchPayload'
    deleteOneTransaction: 'Transaction'
    deleteManyTransaction: 'BatchPayload'
    upsertOneTransaction: 'Transaction'

  },
  User: {
    id: 'String'
    email: 'String'
    emailVerified: 'Boolean'
    password: 'String'
    username: 'String'
    createdAt: 'DateTime'
    updatedAt: 'DateTime'
    stockPortfolios: 'StockPortfolio'
    balances: 'Balance'
    transactions: 'Transaction'

},  StockPortfolio: {
    id: 'String'
    user: 'User'
    name: 'String'
    headers: 'String'
    tickers: 'String'
    createdAt: 'DateTime'
    updatedAt: 'DateTime'

},  Balance: {
    user: 'User'
    credits: 'Int'

},  Transaction: {
    id: 'String'
    user: 'User'
    creditsBefore: 'Int'
    creditsTransacted: 'Int'
    createdAt: 'DateTime'

}
}

interface NexusPrismaMethods {
  User: NexusPrismaFields<'User'>
  StockPortfolio: NexusPrismaFields<'StockPortfolio'>
  Balance: NexusPrismaFields<'Balance'>
  Transaction: NexusPrismaFields<'Transaction'>
  Query: NexusPrismaFields<'Query'>
  Mutation: NexusPrismaFields<'Mutation'>
}
  

declare global {
  type NexusPrisma<
    TypeName extends string,
    ModelOrCrud extends 'model' | 'crud'
  > = GetNexusPrisma<TypeName, ModelOrCrud>;
}
  