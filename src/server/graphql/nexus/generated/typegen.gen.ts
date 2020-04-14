/**
 * This file was automatically generated by GraphQL Nexus
 * Do not make changes to this file directly
 */

import * as ctx from "../../context"
import { QueryComplexity } from "@nexus/schema/dist/plugins/queryComplexityPlugin"
import { FieldAuthorizeResolver } from "@nexus/schema/dist/plugins/fieldAuthorizePlugin"
import { IFieldRateLimitResolver } from "/home/leedavidcs/projects/app_root/src/server/graphql/nexus/plugins/rate-limit.plugin"


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
  AddressInput: { // input type
    city?: string | null; // String
    country?: string | null; // String
    line1: string; // String!
    state?: string | null; // String
    zipcode?: string | null; // String
  }
  BalanceFilter: { // input type
    every?: NexusGenInputs['BalanceWhereInput'] | null; // BalanceWhereInput
    none?: NexusGenInputs['BalanceWhereInput'] | null; // BalanceWhereInput
    some?: NexusGenInputs['BalanceWhereInput'] | null; // BalanceWhereInput
  }
  BalanceWhereInput: { // input type
    AND?: NexusGenInputs['BalanceWhereInput'][] | null; // [BalanceWhereInput!]
    credits?: NexusGenInputs['IntFilter'] | null; // IntFilter
    NOT?: NexusGenInputs['BalanceWhereInput'][] | null; // [BalanceWhereInput!]
    OR?: NexusGenInputs['BalanceWhereInput'][] | null; // [BalanceWhereInput!]
    user?: NexusGenInputs['UserWhereInput'] | null; // UserWhereInput
    userId?: NexusGenInputs['StringFilter'] | null; // StringFilter
  }
  BalanceWhereUniqueInput: { // input type
    userId?: string | null; // String
  }
  BooleanFilter: { // input type
    equals?: boolean | null; // Boolean
    not?: boolean | null; // Boolean
  }
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
  IntFilter: { // input type
    equals?: number | null; // Int
    gt?: number | null; // Int
    gte?: number | null; // Int
    in?: number[] | null; // [Int!]
    lt?: number | null; // Int
    lte?: number | null; // Int
    not?: number | null; // Int
    notIn?: number[] | null; // [Int!]
  }
  LoginLocalUserInput: { // input type
    password: string; // String!
    userIdentifier: string; // String!
  }
  NullableStringFilter: { // input type
    contains?: string | null; // String
    endsWith?: string | null; // String
    equals?: string | null; // String
    gt?: string | null; // String
    gte?: string | null; // String
    in?: string[] | null; // [String!]
    lt?: string | null; // String
    lte?: string | null; // String
    not?: string | null; // String
    notIn?: string[] | null; // [String!]
    startsWith?: string | null; // String
  }
  OrderDetailInput: { // input type
    id: string; // String!
    quantity?: number | null; // Int
    type: NexusGenEnums['OrderDetailType']; // OrderDetailType!
  }
  RefreshAccessTokenInput: { // input type
    refreshToken: string; // String!
  }
  RegisterLocalUserInput: { // input type
    email: any; // EmailAddress!
    password: any; // UserPassword!
    username: string; // String!
  }
  StockPortfolioCreateInput: { // input type
    name: string; // String!
  }
  StockPortfolioFilter: { // input type
    every?: NexusGenInputs['StockPortfolioWhereInput'] | null; // StockPortfolioWhereInput
    none?: NexusGenInputs['StockPortfolioWhereInput'] | null; // StockPortfolioWhereInput
    some?: NexusGenInputs['StockPortfolioWhereInput'] | null; // StockPortfolioWhereInput
  }
  StockPortfolioHeaderInput: { // input type
    dataKey: string; // String!
    frozen: boolean; // Boolean!
    name: string; // String!
    resizable: boolean; // Boolean!
    width: number; // Int!
  }
  StockPortfolioOrderByInput: { // input type
    createdAt?: NexusGenEnums['OrderByArg'] | null; // OrderByArg
    id?: NexusGenEnums['OrderByArg'] | null; // OrderByArg
    name?: NexusGenEnums['OrderByArg'] | null; // OrderByArg
    updatedAt?: NexusGenEnums['OrderByArg'] | null; // OrderByArg
    user?: NexusGenEnums['OrderByArg'] | null; // OrderByArg
    userId?: NexusGenEnums['OrderByArg'] | null; // OrderByArg
  }
  StockPortfolioUpdateInput: { // input type
    headers?: NexusGenInputs['StockPortfolioHeaderInput'][] | null; // [StockPortfolioHeaderInput!]
    name?: string | null; // String
    tickers?: string[] | null; // [String!]
  }
  StockPortfolioWhereInput: { // input type
    AND?: NexusGenInputs['StockPortfolioWhereInput'][] | null; // [StockPortfolioWhereInput!]
    createdAt?: NexusGenInputs['DateTimeFilter'] | null; // DateTimeFilter
    id?: NexusGenInputs['StringFilter'] | null; // StringFilter
    name?: NexusGenInputs['StringFilter'] | null; // StringFilter
    NOT?: NexusGenInputs['StockPortfolioWhereInput'][] | null; // [StockPortfolioWhereInput!]
    OR?: NexusGenInputs['StockPortfolioWhereInput'][] | null; // [StockPortfolioWhereInput!]
    updatedAt?: NexusGenInputs['DateTimeFilter'] | null; // DateTimeFilter
    user?: NexusGenInputs['UserWhereInput'] | null; // UserWhereInput
    userId?: NexusGenInputs['StringFilter'] | null; // StringFilter
  }
  StockPortfolioWhereUniqueInput: { // input type
    id?: string | null; // String
    userId_name?: NexusGenInputs['UserIdNameCompoundUniqueInput'] | null; // UserIdNameCompoundUniqueInput
  }
  StringFilter: { // input type
    contains?: string | null; // String
    endsWith?: string | null; // String
    equals?: string | null; // String
    gt?: string | null; // String
    gte?: string | null; // String
    in?: string[] | null; // [String!]
    lt?: string | null; // String
    lte?: string | null; // String
    not?: string | null; // String
    notIn?: string[] | null; // [String!]
    startsWith?: string | null; // String
  }
  StripeDetailsFilter: { // input type
    every?: NexusGenInputs['StripeDetailsWhereInput'] | null; // StripeDetailsWhereInput
    none?: NexusGenInputs['StripeDetailsWhereInput'] | null; // StripeDetailsWhereInput
    some?: NexusGenInputs['StripeDetailsWhereInput'] | null; // StripeDetailsWhereInput
  }
  StripeDetailsWhereInput: { // input type
    AND?: NexusGenInputs['StripeDetailsWhereInput'][] | null; // [StripeDetailsWhereInput!]
    customerId?: NexusGenInputs['StringFilter'] | null; // StringFilter
    NOT?: NexusGenInputs['StripeDetailsWhereInput'][] | null; // [StripeDetailsWhereInput!]
    OR?: NexusGenInputs['StripeDetailsWhereInput'][] | null; // [StripeDetailsWhereInput!]
    user?: NexusGenInputs['UserWhereInput'] | null; // UserWhereInput
    userId?: NexusGenInputs['StringFilter'] | null; // StringFilter
  }
  TransactionFilter: { // input type
    every?: NexusGenInputs['TransactionWhereInput'] | null; // TransactionWhereInput
    none?: NexusGenInputs['TransactionWhereInput'] | null; // TransactionWhereInput
    some?: NexusGenInputs['TransactionWhereInput'] | null; // TransactionWhereInput
  }
  TransactionOrderByInput: { // input type
    createdAt?: NexusGenEnums['OrderByArg'] | null; // OrderByArg
    creditsBefore?: NexusGenEnums['OrderByArg'] | null; // OrderByArg
    creditsTransacted?: NexusGenEnums['OrderByArg'] | null; // OrderByArg
    id?: NexusGenEnums['OrderByArg'] | null; // OrderByArg
    paymentIntentId?: NexusGenEnums['OrderByArg'] | null; // OrderByArg
    status?: NexusGenEnums['OrderByArg'] | null; // OrderByArg
    user?: NexusGenEnums['OrderByArg'] | null; // OrderByArg
    userId?: NexusGenEnums['OrderByArg'] | null; // OrderByArg
  }
  TransactionWhereInput: { // input type
    AND?: NexusGenInputs['TransactionWhereInput'][] | null; // [TransactionWhereInput!]
    createdAt?: NexusGenInputs['DateTimeFilter'] | null; // DateTimeFilter
    creditsBefore?: NexusGenInputs['IntFilter'] | null; // IntFilter
    creditsTransacted?: NexusGenInputs['IntFilter'] | null; // IntFilter
    id?: NexusGenInputs['StringFilter'] | null; // StringFilter
    NOT?: NexusGenInputs['TransactionWhereInput'][] | null; // [TransactionWhereInput!]
    OR?: NexusGenInputs['TransactionWhereInput'][] | null; // [TransactionWhereInput!]
    paymentIntentId?: NexusGenInputs['NullableStringFilter'] | null; // NullableStringFilter
    status?: NexusGenEnums['TransactionStatus'] | null; // TransactionStatus
    user?: NexusGenInputs['UserWhereInput'] | null; // UserWhereInput
    userId?: NexusGenInputs['StringFilter'] | null; // StringFilter
  }
  TransactionWhereUniqueInput: { // input type
    id?: string | null; // String
    paymentIntentId?: string | null; // String
  }
  UserIdNameCompoundUniqueInput: { // input type
    name: string; // String!
    userId: string; // String!
  }
  UserWhereInput: { // input type
    AND?: NexusGenInputs['UserWhereInput'][] | null; // [UserWhereInput!]
    balance?: NexusGenInputs['BalanceFilter'] | null; // BalanceFilter
    createdAt?: NexusGenInputs['DateTimeFilter'] | null; // DateTimeFilter
    email?: NexusGenInputs['StringFilter'] | null; // StringFilter
    emailVerified?: NexusGenInputs['BooleanFilter'] | null; // BooleanFilter
    id?: NexusGenInputs['StringFilter'] | null; // StringFilter
    NOT?: NexusGenInputs['UserWhereInput'][] | null; // [UserWhereInput!]
    OR?: NexusGenInputs['UserWhereInput'][] | null; // [UserWhereInput!]
    password?: NexusGenInputs['StringFilter'] | null; // StringFilter
    stockPortfolio?: NexusGenInputs['StockPortfolioFilter'] | null; // StockPortfolioFilter
    stripeDetails?: NexusGenInputs['StripeDetailsFilter'] | null; // StripeDetailsFilter
    transaction?: NexusGenInputs['TransactionFilter'] | null; // TransactionFilter
    updatedAt?: NexusGenInputs['DateTimeFilter'] | null; // DateTimeFilter
    username?: NexusGenInputs['StringFilter'] | null; // StringFilter
  }
}

export interface NexusGenEnums {
  DataKey_Provider: "IEX_CLOUD"
  OrderByArg: "asc" | "desc"
  OrderDetailType: "PriceBundle"
  TransactionStatus: "FAILED" | "PENDING" | "SUCCEEDED"
}

export interface NexusGenRootTypes {
  Balance: { // root type
    credits: number; // Int!
  }
  DataKeyOption: { // root type
    dataKey: string; // String!
    name: string; // String!
    provider: NexusGenEnums['DataKey_Provider']; // DataKey_Provider!
  }
  Mutation: {};
  PriceBundle: { // root type
    credits: number; // Int!
    id: string; // String!
    price: number; // Float!
  }
  Query: {};
  RegisterLocalUserPayload: { // root type
    error?: string | null; // String
    success: boolean; // Boolean!
    user?: NexusGenRootTypes['User'] | null; // User
  }
  ResendVerifyEmailPayload: { // root type
    success: boolean; // Boolean!
  }
  StockData: { // root type
    dataKeys: string[]; // [String!]!
    tickers: string[]; // [String!]!
  }
  StockDataSearch: { // root type
    exchange: string; // String!
    region: string; // String!
    securityName: string; // String!
    securityType: string; // String!
    symbol: string; // String!
  }
  StockPortfolio: { // root type
    createdAt: any; // DateTime!
    id: string; // String!
    name: string; // String!
    tickers: string[]; // [String!]!
    updatedAt: any; // DateTime!
  }
  StockPortfolioHeader: { // root type
    dataKey: string; // String!
    frozen: boolean; // Boolean!
    name: string; // String!
    resizable: boolean; // Boolean!
    width: number; // Int!
  }
  StripeCard: { // root type
    brand: string; // String!
    exp_month: number; // Int!
    exp_year: number; // Int!
    fingerprint?: string | null; // String
    last4: string; // String!
  }
  StripePaymentIntent: { // root type
    amount?: number | null; // Float
    client_secret?: string | null; // String
    created: number; // Int!
    currency?: string | null; // String
    id: string; // String!
  }
  StripePaymentMethod: { // root type
    card?: NexusGenRootTypes['StripeCard'] | null; // StripeCard
    created: number; // Int!
    id: string; // String!
  }
  StripeSetupIntent: { // root type
    client_secret?: string | null; // String
    created: number; // Int!
    id: string; // String!
  }
  TokenPayload: { // root type
    refreshToken: string; // String!
    token: string; // String!
  }
  Transaction: { // root type
    creditsBefore: number; // Int!
    creditsTransacted: number; // Int!
    id: string; // String!
    paymentIntentId?: string | null; // String
  }
  User: { // root type
    createdAt: any; // DateTime!
    email: any; // EmailAddress!
    emailVerified: boolean; // Boolean!
    id: string; // String!
    updatedAt: any; // DateTime!
    username: string; // String!
  }
  RequestRoot: NexusGenRootTypes['Mutation'] | NexusGenRootTypes['Query'];
  String: string;
  Int: number;
  Float: number;
  Boolean: boolean;
  ID: string;
  DateTime: any;
  EmailAddress: any;
  JSONObject: any;
  UserPassword: any;
}

export interface NexusGenAllTypes extends NexusGenRootTypes {
  AddressInput: NexusGenInputs['AddressInput'];
  BalanceFilter: NexusGenInputs['BalanceFilter'];
  BalanceWhereInput: NexusGenInputs['BalanceWhereInput'];
  BalanceWhereUniqueInput: NexusGenInputs['BalanceWhereUniqueInput'];
  BooleanFilter: NexusGenInputs['BooleanFilter'];
  DateTimeFilter: NexusGenInputs['DateTimeFilter'];
  IntFilter: NexusGenInputs['IntFilter'];
  LoginLocalUserInput: NexusGenInputs['LoginLocalUserInput'];
  NullableStringFilter: NexusGenInputs['NullableStringFilter'];
  OrderDetailInput: NexusGenInputs['OrderDetailInput'];
  RefreshAccessTokenInput: NexusGenInputs['RefreshAccessTokenInput'];
  RegisterLocalUserInput: NexusGenInputs['RegisterLocalUserInput'];
  StockPortfolioCreateInput: NexusGenInputs['StockPortfolioCreateInput'];
  StockPortfolioFilter: NexusGenInputs['StockPortfolioFilter'];
  StockPortfolioHeaderInput: NexusGenInputs['StockPortfolioHeaderInput'];
  StockPortfolioOrderByInput: NexusGenInputs['StockPortfolioOrderByInput'];
  StockPortfolioUpdateInput: NexusGenInputs['StockPortfolioUpdateInput'];
  StockPortfolioWhereInput: NexusGenInputs['StockPortfolioWhereInput'];
  StockPortfolioWhereUniqueInput: NexusGenInputs['StockPortfolioWhereUniqueInput'];
  StringFilter: NexusGenInputs['StringFilter'];
  StripeDetailsFilter: NexusGenInputs['StripeDetailsFilter'];
  StripeDetailsWhereInput: NexusGenInputs['StripeDetailsWhereInput'];
  TransactionFilter: NexusGenInputs['TransactionFilter'];
  TransactionOrderByInput: NexusGenInputs['TransactionOrderByInput'];
  TransactionWhereInput: NexusGenInputs['TransactionWhereInput'];
  TransactionWhereUniqueInput: NexusGenInputs['TransactionWhereUniqueInput'];
  UserIdNameCompoundUniqueInput: NexusGenInputs['UserIdNameCompoundUniqueInput'];
  UserWhereInput: NexusGenInputs['UserWhereInput'];
  DataKey_Provider: NexusGenEnums['DataKey_Provider'];
  OrderByArg: NexusGenEnums['OrderByArg'];
  OrderDetailType: NexusGenEnums['OrderDetailType'];
  TransactionStatus: NexusGenEnums['TransactionStatus'];
}

export interface NexusGenFieldTypes {
  Balance: { // field return type
    credits: number; // Int!
    user: NexusGenRootTypes['User']; // User!
  }
  DataKeyOption: { // field return type
    dataKey: string; // String!
    name: string; // String!
    provider: NexusGenEnums['DataKey_Provider']; // DataKey_Provider!
  }
  Mutation: { // field return type
    applySucceededTransaction: NexusGenRootTypes['Balance'] | null; // Balance
    cancelStripeSetupIntent: NexusGenRootTypes['StripeSetupIntent'] | null; // StripeSetupIntent
    cancelTransaction: NexusGenRootTypes['Balance'] | null; // Balance
    createOneStockPortfolio: NexusGenRootTypes['StockPortfolio']; // StockPortfolio!
    createStripePaymentIntent: NexusGenRootTypes['StripePaymentIntent'] | null; // StripePaymentIntent
    createStripeSetupIntent: NexusGenRootTypes['StripeSetupIntent'] | null; // StripeSetupIntent
    deleteOneStockPortfolio: NexusGenRootTypes['StockPortfolio'] | null; // StockPortfolio
    loginLocalUser: NexusGenRootTypes['TokenPayload'] | null; // TokenPayload
    refreshAccessToken: NexusGenRootTypes['TokenPayload'] | null; // TokenPayload
    registerLocalUser: NexusGenRootTypes['RegisterLocalUserPayload'] | null; // RegisterLocalUserPayload
    resendVerifyEmail: NexusGenRootTypes['ResendVerifyEmailPayload'] | null; // ResendVerifyEmailPayload
    updateOneStockPortfolio: NexusGenRootTypes['StockPortfolio'] | null; // StockPortfolio
    viewer: NexusGenRootTypes['User'] | null; // User
  }
  PriceBundle: { // field return type
    credits: number; // Int!
    id: string; // String!
    price: number; // Float!
  }
  Query: { // field return type
    balance: NexusGenRootTypes['Balance'] | null; // Balance
    dataKeyOptions: NexusGenRootTypes['DataKeyOption'][]; // [DataKeyOption!]!
    priceBundles: NexusGenRootTypes['PriceBundle'][]; // [PriceBundle!]!
    stockData: NexusGenRootTypes['StockData'] | null; // StockData
    stockPortfolio: NexusGenRootTypes['StockPortfolio'] | null; // StockPortfolio
    stockPortfolioCount: number | null; // Int
    stockPortfolios: NexusGenRootTypes['StockPortfolio'][]; // [StockPortfolio!]!
    stockSymbols: NexusGenRootTypes['StockDataSearch'][]; // [StockDataSearch!]!
    transactions: NexusGenRootTypes['Transaction'][]; // [Transaction!]!
    viewer: NexusGenRootTypes['User'] | null; // User
  }
  RegisterLocalUserPayload: { // field return type
    error: string | null; // String
    success: boolean; // Boolean!
    user: NexusGenRootTypes['User'] | null; // User
  }
  ResendVerifyEmailPayload: { // field return type
    success: boolean; // Boolean!
  }
  StockData: { // field return type
    data: any[] | null; // [JSONObject!]
    dataKeys: string[]; // [String!]!
    refreshCost: number; // Int!
    tickers: string[]; // [String!]!
  }
  StockDataSearch: { // field return type
    exchange: string; // String!
    region: string; // String!
    securityName: string; // String!
    securityType: string; // String!
    symbol: string; // String!
  }
  StockPortfolio: { // field return type
    createdAt: any; // DateTime!
    headers: NexusGenRootTypes['StockPortfolioHeader'][]; // [StockPortfolioHeader!]!
    id: string; // String!
    name: string; // String!
    stockData: NexusGenRootTypes['StockData'] | null; // StockData
    tickers: string[]; // [String!]!
    updatedAt: any; // DateTime!
    user: NexusGenRootTypes['User']; // User!
  }
  StockPortfolioHeader: { // field return type
    dataKey: string; // String!
    frozen: boolean; // Boolean!
    name: string; // String!
    resizable: boolean; // Boolean!
    width: number; // Int!
  }
  StripeCard: { // field return type
    brand: string; // String!
    exp_month: number; // Int!
    exp_year: number; // Int!
    fingerprint: string | null; // String
    last4: string; // String!
  }
  StripePaymentIntent: { // field return type
    amount: number | null; // Float
    client_secret: string | null; // String
    created: number; // Int!
    currency: string | null; // String
    id: string; // String!
    payment_method: NexusGenRootTypes['StripePaymentMethod'] | null; // StripePaymentMethod
  }
  StripePaymentMethod: { // field return type
    card: NexusGenRootTypes['StripeCard'] | null; // StripeCard
    created: number; // Int!
    id: string; // String!
  }
  StripeSetupIntent: { // field return type
    client_secret: string | null; // String
    created: number; // Int!
    id: string; // String!
    payment_method: NexusGenRootTypes['StripePaymentMethod'] | null; // StripePaymentMethod
  }
  TokenPayload: { // field return type
    refreshToken: string; // String!
    token: string; // String!
  }
  Transaction: { // field return type
    creditsBefore: number; // Int!
    creditsTransacted: number; // Int!
    id: string; // String!
    paymentIntent: NexusGenRootTypes['StripePaymentIntent'] | null; // StripePaymentIntent
    paymentIntentId: string | null; // String
    user: NexusGenRootTypes['User']; // User!
  }
  User: { // field return type
    balance: NexusGenRootTypes['Balance'] | null; // Balance
    createdAt: any; // DateTime!
    email: any; // EmailAddress!
    emailVerified: boolean; // Boolean!
    id: string; // String!
    updatedAt: any; // DateTime!
    username: string; // String!
  }
  RequestRoot: { // field return type
    viewer: NexusGenRootTypes['User'] | null; // User
  }
}

export interface NexusGenArgTypes {
  Mutation: {
    applySucceededTransaction: { // args
      paymentIntentId: string; // String!
    }
    cancelStripeSetupIntent: { // args
      id: string; // String!
    }
    cancelTransaction: { // args
      paymentIntentId: string; // String!
    }
    createOneStockPortfolio: { // args
      data: NexusGenInputs['StockPortfolioCreateInput']; // StockPortfolioCreateInput!
    }
    createStripePaymentIntent: { // args
      orderDetails: NexusGenInputs['OrderDetailInput'][]; // [OrderDetailInput!]!
      paymentMethodId: string; // String!
    }
    deleteOneStockPortfolio: { // args
      where: NexusGenInputs['StockPortfolioWhereUniqueInput']; // StockPortfolioWhereUniqueInput!
    }
    loginLocalUser: { // args
      input: NexusGenInputs['LoginLocalUserInput']; // LoginLocalUserInput!
    }
    refreshAccessToken: { // args
      input: NexusGenInputs['RefreshAccessTokenInput']; // RefreshAccessTokenInput!
    }
    registerLocalUser: { // args
      input: NexusGenInputs['RegisterLocalUserInput']; // RegisterLocalUserInput!
    }
    updateOneStockPortfolio: { // args
      data: NexusGenInputs['StockPortfolioUpdateInput']; // StockPortfolioUpdateInput!
      where: NexusGenInputs['StockPortfolioWhereUniqueInput']; // StockPortfolioWhereUniqueInput!
    }
  }
  Query: {
    balance: { // args
      where: NexusGenInputs['BalanceWhereUniqueInput']; // BalanceWhereUniqueInput!
    }
    dataKeyOptions: { // args
      dataKey?: string | null; // String
      name?: string | null; // String
      provider?: string | null; // String
    }
    stockData: { // args
      dataKeys: string[]; // [String!]!
      tickers: string[]; // [String!]!
    }
    stockPortfolio: { // args
      where: NexusGenInputs['StockPortfolioWhereUniqueInput']; // StockPortfolioWhereUniqueInput!
    }
    stockPortfolioCount: { // args
      query?: string | null; // String
      where?: NexusGenInputs['StockPortfolioWhereInput'] | null; // StockPortfolioWhereInput
    }
    stockPortfolios: { // args
      after?: NexusGenInputs['StockPortfolioWhereUniqueInput'] | null; // StockPortfolioWhereUniqueInput
      before?: NexusGenInputs['StockPortfolioWhereUniqueInput'] | null; // StockPortfolioWhereUniqueInput
      first?: number | null; // Int
      last?: number | null; // Int
      orderBy?: NexusGenInputs['StockPortfolioOrderByInput'] | null; // StockPortfolioOrderByInput
      query?: string | null; // String
      skip?: number | null; // Int
      where?: NexusGenInputs['StockPortfolioWhereInput'] | null; // StockPortfolioWhereInput
    }
    stockSymbols: { // args
      text: string; // String!
    }
    transactions: { // args
      after?: NexusGenInputs['TransactionWhereUniqueInput'] | null; // TransactionWhereUniqueInput
      before?: NexusGenInputs['TransactionWhereUniqueInput'] | null; // TransactionWhereUniqueInput
      first?: number | null; // Int
      last?: number | null; // Int
      orderBy?: NexusGenInputs['TransactionOrderByInput'] | null; // TransactionOrderByInput
      skip?: number | null; // Int
      where?: NexusGenInputs['TransactionWhereInput'] | null; // TransactionWhereInput
    }
  }
}

export interface NexusGenAbstractResolveReturnTypes {
  RequestRoot: "Mutation" | "Query"
}

export interface NexusGenInheritedFields {}

export type NexusGenObjectNames = "Balance" | "DataKeyOption" | "Mutation" | "PriceBundle" | "Query" | "RegisterLocalUserPayload" | "ResendVerifyEmailPayload" | "StockData" | "StockDataSearch" | "StockPortfolio" | "StockPortfolioHeader" | "StripeCard" | "StripePaymentIntent" | "StripePaymentMethod" | "StripeSetupIntent" | "TokenPayload" | "Transaction" | "User";

export type NexusGenInputNames = "AddressInput" | "BalanceFilter" | "BalanceWhereInput" | "BalanceWhereUniqueInput" | "BooleanFilter" | "DateTimeFilter" | "IntFilter" | "LoginLocalUserInput" | "NullableStringFilter" | "OrderDetailInput" | "RefreshAccessTokenInput" | "RegisterLocalUserInput" | "StockPortfolioCreateInput" | "StockPortfolioFilter" | "StockPortfolioHeaderInput" | "StockPortfolioOrderByInput" | "StockPortfolioUpdateInput" | "StockPortfolioWhereInput" | "StockPortfolioWhereUniqueInput" | "StringFilter" | "StripeDetailsFilter" | "StripeDetailsWhereInput" | "TransactionFilter" | "TransactionOrderByInput" | "TransactionWhereInput" | "TransactionWhereUniqueInput" | "UserIdNameCompoundUniqueInput" | "UserWhereInput";

export type NexusGenEnumNames = "DataKey_Provider" | "OrderByArg" | "OrderDetailType" | "TransactionStatus";

export type NexusGenInterfaceNames = "RequestRoot";

export type NexusGenScalarNames = "Boolean" | "DateTime" | "EmailAddress" | "Float" | "ID" | "Int" | "JSONObject" | "String" | "UserPassword";

export type NexusGenUnionNames = never;

export interface NexusGenTypes {
  context: ctx.IServerContextWithUser;
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
    rateLimit?: IFieldRateLimitResolver<TypeName, FieldName>
  }
  interface NexusGenPluginSchemaConfig {
  }
}