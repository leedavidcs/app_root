/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */


import { QueryComplexity } from "@nexus/schema/dist/plugins/queryComplexityPlugin"
import { FieldAuthorizeResolver } from "@nexus/schema/dist/plugins/fieldAuthorizePlugin"


declare global {
  interface NexusGenCustomOutputProperties<TypeName extends string> {
    crud: NexusPrisma<TypeName, 'crud'>
    model: NexusPrisma<TypeName, 'model'>
  }
}

declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
  DateTimeFilter: { // input type
    equals?: any | null; // DateTime
    gt?: any | null; // DateTime
    gte?: any | null; // DateTime
    in?: any[] | null; // [DateTime!]
    lt?: any | null; // DateTime
    lte?: any | null; // DateTime
    not?: any | null; // DateTime
    notIn?: any[] | null; // [DateTime!]
  }
  SnapshotOrderByInput: { // input type
    createdAt?: NexusGenEnums['OrderByArg'] | null; // OrderByArg
  }
  SnapshotWhereInput: { // input type
    AND?: NexusGenInputs['SnapshotWhereInput'][] | null; // [SnapshotWhereInput!]
    createdAt?: NexusGenInputs['DateTimeFilter'] | null; // DateTimeFilter
    NOT?: NexusGenInputs['SnapshotWhereInput'][] | null; // [SnapshotWhereInput!]
    OR?: NexusGenInputs['SnapshotWhereInput'][] | null; // [SnapshotWhereInput!]
    stockPortfolio?: NexusGenInputs['StockPortfolioWhereInput'] | null; // StockPortfolioWhereInput
  }
  SnapshotWhereUniqueInput: { // input type
    id?: string | null; // String
  }
  StockPortfolioOrderByInput: { // input type
    createdAt?: NexusGenEnums['OrderByArg'] | null; // OrderByArg
    name?: NexusGenEnums['OrderByArg'] | null; // OrderByArg
    updatedAt?: NexusGenEnums['OrderByArg'] | null; // OrderByArg
  }
  StockPortfolioWhereInput: { // input type
    AND?: NexusGenInputs['StockPortfolioWhereInput'][] | null; // [StockPortfolioWhereInput!]
    createdAt?: NexusGenInputs['DateTimeFilter'] | null; // DateTimeFilter
    name?: NexusGenInputs['StringFilter'] | null; // StringFilter
    NOT?: NexusGenInputs['StockPortfolioWhereInput'][] | null; // [StockPortfolioWhereInput!]
    OR?: NexusGenInputs['StockPortfolioWhereInput'][] | null; // [StockPortfolioWhereInput!]
    updatedAt?: NexusGenInputs['DateTimeFilter'] | null; // DateTimeFilter
  }
  StockPortfolioWhereUniqueInput: { // input type
    id?: string | null; // String
    name?: string | null; // String
  }
  StringFilter: { // input type
    contains?: string | null; // String
    endsWith?: string | null; // String
    equals?: string | null; // String
    in?: string[] | null; // [String!]
    not?: string | null; // String
    notIn?: string[] | null; // [String!]
    startsWith?: string | null; // String
  }
}

export interface NexusGenEnums {
  OrderByArg: "asc" | "desc"
  OrderSide: "Buy" | "Sell"
  OrderStatus: "Closed" | "Open"
  OrderType: "Limit" | "Market" | "Stop" | "StopLimit"
  WebhookType: "StockDataRetrieved"
}

export interface NexusGenRootTypes {
  Order: { // root type
    avgFilledPrice?: number | null; // Float
    cancelledAt?: any | null; // DateTime
    createdAt: any; // DateTime!
    failedAt?: any | null; // DateTime
    filledAt?: any | null; // DateTime
    id: string; // String!
    limitPrice?: number | null; // Float
    quantity: number; // Int!
    side: NexusGenEnums['OrderSide']; // OrderSide!
    status: NexusGenEnums['OrderStatus']; // OrderStatus!
    stopPrice?: number | null; // Float
    ticker: string; // String!
    type: NexusGenEnums['OrderType']; // OrderType!
  }
  Position: { // root type
    avgEntryPrice: number; // Float!
    costBasis: number; // Float!
    id: string; // String!
    quantity: number; // Int!
    ticker: string; // String!
  }
  Query: {};
  Snapshot: { // root type
    createdAt: any; // DateTime!
    data: any[]; // [Json!]!
    id: string; // String!
    tickers: string[]; // [String!]!
  }
  SnapshotHeader: { // root type
    dataKey?: string | null; // String
    name: string; // String!
  }
  StockPortfolio: { // root type
    createdAt: any; // DateTime!
    id: string; // String!
    name: string; // String!
    tickers: string[]; // [String!]!
    updatedAt: any; // DateTime!
  }
  StockPortfolioHeader: { // root type
    dataKey?: string | null; // String
    name: string; // String!
  }
  Webhook: { // root type
    id: string; // String!
    query?: string | null; // String
    type: NexusGenEnums['WebhookType']; // WebhookType!
    url: string; // String!
  }
  WebhookInfo: { // root type
    webhook: NexusGenRootTypes['Webhook']; // Webhook!
  }
  String: string;
  Int: number;
  Float: number;
  Boolean: boolean;
  ID: string;
  DateTime: any;
  JSONObject: any;
  Json: any;
}

export interface NexusGenAllTypes extends NexusGenRootTypes {
  DateTimeFilter: NexusGenInputs['DateTimeFilter'];
  SnapshotOrderByInput: NexusGenInputs['SnapshotOrderByInput'];
  SnapshotWhereInput: NexusGenInputs['SnapshotWhereInput'];
  SnapshotWhereUniqueInput: NexusGenInputs['SnapshotWhereUniqueInput'];
  StockPortfolioOrderByInput: NexusGenInputs['StockPortfolioOrderByInput'];
  StockPortfolioWhereInput: NexusGenInputs['StockPortfolioWhereInput'];
  StockPortfolioWhereUniqueInput: NexusGenInputs['StockPortfolioWhereUniqueInput'];
  StringFilter: NexusGenInputs['StringFilter'];
  OrderByArg: NexusGenEnums['OrderByArg'];
  OrderSide: NexusGenEnums['OrderSide'];
  OrderStatus: NexusGenEnums['OrderStatus'];
  OrderType: NexusGenEnums['OrderType'];
  WebhookType: NexusGenEnums['WebhookType'];
}

export interface NexusGenFieldTypes {
  Order: { // field return type
    avgFilledPrice: number | null; // Float
    cancelledAt: any | null; // DateTime
    createdAt: any; // DateTime!
    failedAt: any | null; // DateTime
    filledAt: any | null; // DateTime
    id: string; // String!
    limitPrice: number | null; // Float
    quantity: number; // Int!
    side: NexusGenEnums['OrderSide']; // OrderSide!
    status: NexusGenEnums['OrderStatus']; // OrderStatus!
    stockPortfolio: NexusGenRootTypes['StockPortfolio']; // StockPortfolio!
    stopPrice: number | null; // Float
    ticker: string; // String!
    type: NexusGenEnums['OrderType']; // OrderType!
  }
  Position: { // field return type
    avgEntryPrice: number; // Float!
    costBasis: number; // Float!
    id: string; // String!
    quantity: number; // Int!
    stockPortfolio: NexusGenRootTypes['StockPortfolio']; // StockPortfolio!
    ticker: string; // String!
  }
  Query: { // field return type
    ok: boolean; // Boolean!
    snapshot: NexusGenRootTypes['Snapshot'] | null; // Snapshot
    snapshots: NexusGenRootTypes['Snapshot'][]; // [Snapshot!]!
    stockPortfolio: NexusGenRootTypes['StockPortfolio'] | null; // StockPortfolio
    stockPortfolios: NexusGenRootTypes['StockPortfolio'][]; // [StockPortfolio!]!
    webhookInfo: NexusGenRootTypes['WebhookInfo']; // WebhookInfo!
  }
  Snapshot: { // field return type
    createdAt: any; // DateTime!
    data: any[]; // [Json!]!
    headers: NexusGenRootTypes['SnapshotHeader'][]; // [SnapshotHeader!]!
    id: string; // String!
    stockPortfolio: NexusGenRootTypes['StockPortfolio']; // StockPortfolio!
    tickers: string[]; // [String!]!
  }
  SnapshotHeader: { // field return type
    dataKey: string | null; // String
    name: string; // String!
  }
  StockPortfolio: { // field return type
    createdAt: any; // DateTime!
    headers: NexusGenRootTypes['StockPortfolioHeader'][]; // [StockPortfolioHeader!]!
    id: string; // String!
    name: string; // String!
    tickers: string[]; // [String!]!
    updatedAt: any; // DateTime!
  }
  StockPortfolioHeader: { // field return type
    dataKey: string | null; // String
    name: string; // String!
  }
  Webhook: { // field return type
    id: string; // String!
    query: string | null; // String
    stockPortfolio: NexusGenRootTypes['StockPortfolio']; // StockPortfolio!
    type: NexusGenEnums['WebhookType']; // WebhookType!
    url: string; // String!
  }
  WebhookInfo: { // field return type
    calledAt: any; // DateTime!
    webhook: NexusGenRootTypes['Webhook']; // Webhook!
  }
}

export interface NexusGenArgTypes {
  Query: {
    snapshot: { // args
      where: NexusGenInputs['SnapshotWhereUniqueInput']; // SnapshotWhereUniqueInput!
    }
    snapshots: { // args
      after?: NexusGenInputs['SnapshotWhereUniqueInput'] | null; // SnapshotWhereUniqueInput
      before?: NexusGenInputs['SnapshotWhereUniqueInput'] | null; // SnapshotWhereUniqueInput
      first?: number | null; // Int
      last?: number | null; // Int
      orderBy?: NexusGenInputs['SnapshotOrderByInput'] | null; // SnapshotOrderByInput
      skip?: number | null; // Int
      where?: NexusGenInputs['SnapshotWhereInput'] | null; // SnapshotWhereInput
    }
    stockPortfolio: { // args
      where?: NexusGenInputs['StockPortfolioWhereUniqueInput'] | null; // StockPortfolioWhereUniqueInput
    }
    stockPortfolios: { // args
      after?: NexusGenInputs['StockPortfolioWhereUniqueInput'] | null; // StockPortfolioWhereUniqueInput
      before?: NexusGenInputs['StockPortfolioWhereUniqueInput'] | null; // StockPortfolioWhereUniqueInput
      first?: number | null; // Int
      last?: number | null; // Int
      orderBy?: NexusGenInputs['StockPortfolioOrderByInput'] | null; // StockPortfolioOrderByInput
      skip?: number | null; // Int
      where?: NexusGenInputs['StockPortfolioWhereInput'] | null; // StockPortfolioWhereInput
    }
  }
}

export interface NexusGenAbstractResolveReturnTypes {
}

export interface NexusGenInheritedFields {}

export type NexusGenObjectNames = "Order" | "Position" | "Query" | "Snapshot" | "SnapshotHeader" | "StockPortfolio" | "StockPortfolioHeader" | "Webhook" | "WebhookInfo";

export type NexusGenInputNames = "DateTimeFilter" | "SnapshotOrderByInput" | "SnapshotWhereInput" | "SnapshotWhereUniqueInput" | "StockPortfolioOrderByInput" | "StockPortfolioWhereInput" | "StockPortfolioWhereUniqueInput" | "StringFilter";

export type NexusGenEnumNames = "OrderByArg" | "OrderSide" | "OrderStatus" | "OrderType" | "WebhookType";

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = "Boolean" | "DateTime" | "Float" | "ID" | "Int" | "JSONObject" | "Json" | "String";

export type NexusGenUnionNames = never;

export interface NexusGenTypes {
  context: any;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  allTypes: NexusGenAllTypes;
  inheritedFields: NexusGenInheritedFields;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractResolveReturn: NexusGenAbstractResolveReturnTypes;
}


declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
    /**
     * The complexity for an individual field. Return a number
     * or a function that returns a number to specify the
     * complexity for this field.
     */
    complexity?: QueryComplexity<TypeName, FieldName>
    /**
     * Authorization for an individual field. Returning "true"
     * or "Promise<true>" means the field can be accessed.
     * Returning "false" or "Promise<false>" will respond
     * with a "Not Authorized" error for the field.
     * Returning or throwing an error will also prevent the
     * resolver from executing.
     */
    authorize?: FieldAuthorizeResolver<TypeName, FieldName>
  }
  interface NexusGenPluginSchemaConfig {
  }
}