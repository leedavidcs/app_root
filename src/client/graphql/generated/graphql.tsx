import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Maybe<T> = T | null;
// This file was generated on: Mar 23rd 2020 1:54:13 pm

/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  EmailAddress: any;
  DateTime: any;
  JSONObject: any;
  UUID: any;
  UserPassword: any;
};


export type BooleanFilter = {
  equals?: Maybe<Scalars['Boolean']>;
  not?: Maybe<Scalars['Boolean']>;
};

export enum DataKey_Provider {
  IexCloud = 'IEX_CLOUD'
}

export type DataKeyOption = {
   __typename?: 'DataKeyOption';
  name: Scalars['String'];
  dataKey: Scalars['String'];
  description: Scalars['String'];
  provider: DataKey_Provider;
};


export type DateTimeFilter = {
  equals?: Maybe<Scalars['DateTime']>;
  not?: Maybe<Scalars['DateTime']>;
  in?: Maybe<Array<Scalars['DateTime']>>;
  notIn?: Maybe<Array<Scalars['DateTime']>>;
  lt?: Maybe<Scalars['DateTime']>;
  lte?: Maybe<Scalars['DateTime']>;
  gt?: Maybe<Scalars['DateTime']>;
  gte?: Maybe<Scalars['DateTime']>;
};



export type LoginLocalUserInput = {
  userIdentifier: Scalars['String'];
  password: Scalars['String'];
};

export type Mutation = RequestRoot & {
   __typename?: 'Mutation';
  createOneStockPortfolio: StockPortfolio;
  deleteOneStockPortfolio?: Maybe<StockPortfolio>;
  loginLocalUser?: Maybe<TokenPayload>;
  refreshAccessToken?: Maybe<TokenPayload>;
  registerLocalUser?: Maybe<RegisterLocalUserPayload>;
  resendVerifyEmail?: Maybe<ResendVerifyEmailPayload>;
  setUser?: Maybe<User>;
  toggleModal: Scalars['Boolean'];
  updateOneStockPortfolio?: Maybe<StockPortfolio>;
  viewer?: Maybe<User>;
};


export type MutationCreateOneStockPortfolioArgs = {
  data: StockPortfolioCreateInput;
};


export type MutationDeleteOneStockPortfolioArgs = {
  where: StockPortfolioWhereUniqueInput;
};


export type MutationLoginLocalUserArgs = {
  input: LoginLocalUserInput;
};


export type MutationRefreshAccessTokenArgs = {
  input: RefreshAccessTokenInput;
};


export type MutationRegisterLocalUserArgs = {
  input: RegisterLocalUserInput;
};


export type MutationSetUserArgs = {
  user?: Maybe<UserInput>;
};


export type MutationToggleModalArgs = {
  force?: Maybe<Scalars['Boolean']>;
};


export type MutationUpdateOneStockPortfolioArgs = {
  data: StockPortfolioUpdateInput;
  where: StockPortfolioWhereUniqueInput;
};

export enum OrderByArg {
  Asc = 'asc',
  Desc = 'desc'
}

export type Query = RequestRoot & {
   __typename?: 'Query';
  dataKeyOptions: Array<DataKeyOption>;
  modal: Scalars['Boolean'];
  stockData?: Maybe<Array<Scalars['JSONObject']>>;
  stockPortfolio?: Maybe<StockPortfolio>;
  stockPortfolioCount?: Maybe<Scalars['Int']>;
  stockPortfolios: Array<StockPortfolio>;
  user?: Maybe<User>;
  viewer?: Maybe<User>;
};


export type QueryDataKeyOptionsArgs = {
  name?: Maybe<Scalars['String']>;
  dataKey?: Maybe<Scalars['String']>;
  provider?: Maybe<Scalars['String']>;
};


export type QueryStockDataArgs = {
  tickers: Array<Scalars['String']>;
  dataKeys: Array<Scalars['String']>;
};


export type QueryStockPortfolioArgs = {
  where: StockPortfolioWhereUniqueInput;
};


export type QueryStockPortfolioCountArgs = {
  where?: Maybe<StockPortfolioWhereInput>;
  query?: Maybe<Scalars['String']>;
};


export type QueryStockPortfoliosArgs = {
  after?: Maybe<StockPortfolioWhereUniqueInput>;
  before?: Maybe<StockPortfolioWhereUniqueInput>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  skip?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<StockPortfolioOrderByInput>;
  where?: Maybe<StockPortfolioWhereInput>;
  query?: Maybe<Scalars['String']>;
};

export type RefreshAccessTokenInput = {
  refreshToken: Scalars['String'];
};

export type RegisterLocalUserInput = {
  email: Scalars['EmailAddress'];
  password: Scalars['UserPassword'];
  username: Scalars['String'];
};

export type RegisterLocalUserPayload = {
   __typename?: 'RegisterLocalUserPayload';
  success: Scalars['Boolean'];
  error?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
};

export type RequestRoot = {
  viewer?: Maybe<User>;
};

export type ResendVerifyEmailPayload = {
   __typename?: 'ResendVerifyEmailPayload';
  success: Scalars['Boolean'];
};

export type StockPortfolio = {
   __typename?: 'StockPortfolio';
  id: Scalars['String'];
  user: User;
  name: Scalars['String'];
  headers: Array<StockPortfolioHeader>;
  tickers: Array<Scalars['String']>;
  data: Array<Scalars['JSONObject']>;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type StockPortfolioCreateInput = {
  name: Scalars['String'];
};

export type StockPortfolioFilter = {
  every?: Maybe<StockPortfolioWhereInput>;
  some?: Maybe<StockPortfolioWhereInput>;
  none?: Maybe<StockPortfolioWhereInput>;
};

export type StockPortfolioHeader = {
   __typename?: 'StockPortfolioHeader';
  name: Scalars['String'];
  dataKey: Scalars['String'];
  frozen: Scalars['Boolean'];
  resizable: Scalars['Boolean'];
  width: Scalars['Int'];
};

export type StockPortfolioHeaderInput = {
  name: Scalars['String'];
  dataKey: Scalars['String'];
  width: Scalars['Int'];
  frozen: Scalars['Boolean'];
  resizable: Scalars['Boolean'];
};

export type StockPortfolioOrderByInput = {
  id?: Maybe<OrderByArg>;
  user?: Maybe<OrderByArg>;
  name?: Maybe<OrderByArg>;
  createdAt?: Maybe<OrderByArg>;
  updatedAt?: Maybe<OrderByArg>;
};

export type StockPortfolioUpdateInput = {
  name?: Maybe<Scalars['String']>;
  headers?: Maybe<Array<StockPortfolioHeaderInput>>;
  tickers?: Maybe<Array<Scalars['String']>>;
};

export type StockPortfolioWhereInput = {
  id?: Maybe<UuidFilter>;
  name?: Maybe<StringFilter>;
  createdAt?: Maybe<DateTimeFilter>;
  updatedAt?: Maybe<DateTimeFilter>;
  AND?: Maybe<Array<StockPortfolioWhereInput>>;
  OR?: Maybe<Array<StockPortfolioWhereInput>>;
  NOT?: Maybe<Array<StockPortfolioWhereInput>>;
  user?: Maybe<UserWhereInput>;
};

export type StockPortfolioWhereUniqueInput = {
  id?: Maybe<Scalars['String']>;
  user_name?: Maybe<UserNameCompoundUniqueInput>;
};

export type StringFilter = {
  equals?: Maybe<Scalars['String']>;
  not?: Maybe<Scalars['String']>;
  in?: Maybe<Array<Scalars['String']>>;
  notIn?: Maybe<Array<Scalars['String']>>;
  lt?: Maybe<Scalars['String']>;
  lte?: Maybe<Scalars['String']>;
  gt?: Maybe<Scalars['String']>;
  gte?: Maybe<Scalars['String']>;
  contains?: Maybe<Scalars['String']>;
  startsWith?: Maybe<Scalars['String']>;
  endsWith?: Maybe<Scalars['String']>;
};

export type TokenPayload = {
   __typename?: 'TokenPayload';
  token: Scalars['String'];
  refreshToken: Scalars['String'];
};

export type User = {
   __typename?: 'User';
  id: Scalars['String'];
  email: Scalars['EmailAddress'];
  emailVerified: Scalars['Boolean'];
  username: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type UserInput = {
  /** The id of the user */
  id: Scalars['ID'];
  /** The user's email */
  email: Scalars['EmailAddress'];
  /** Whether the user verified their email address */
  emailVerified: Scalars['Boolean'];
  /** The user's encoded password */
  username: Scalars['String'];
};

export type UserNameCompoundUniqueInput = {
  user: Scalars['String'];
  name: Scalars['String'];
};


export type UserWhereInput = {
  id?: Maybe<UuidFilter>;
  email?: Maybe<StringFilter>;
  emailVerified?: Maybe<BooleanFilter>;
  password?: Maybe<StringFilter>;
  username?: Maybe<StringFilter>;
  createdAt?: Maybe<DateTimeFilter>;
  updatedAt?: Maybe<DateTimeFilter>;
  stockPortfolios?: Maybe<StockPortfolioFilter>;
  AND?: Maybe<Array<UserWhereInput>>;
  OR?: Maybe<Array<UserWhereInput>>;
  NOT?: Maybe<Array<UserWhereInput>>;
};


export type UuidFilter = {
  equals?: Maybe<Scalars['UUID']>;
  not?: Maybe<Scalars['UUID']>;
  in?: Maybe<Array<Scalars['UUID']>>;
  notIn?: Maybe<Array<Scalars['UUID']>>;
  lt?: Maybe<Scalars['UUID']>;
  lte?: Maybe<Scalars['UUID']>;
  gt?: Maybe<Scalars['UUID']>;
  gte?: Maybe<Scalars['UUID']>;
  contains?: Maybe<Scalars['UUID']>;
  startsWith?: Maybe<Scalars['UUID']>;
  endsWith?: Maybe<Scalars['UUID']>;
};

export type CreateStockPortfolioMutationVariables = {
  name: Scalars['String'];
};


export type CreateStockPortfolioMutation = (
  { __typename?: 'Mutation' }
  & { createOneStockPortfolio: (
    { __typename?: 'StockPortfolio' }
    & Pick<StockPortfolio, 'id' | 'name'>
  ) }
);

export type DeleteStockPortfolioMutationVariables = {
  id: Scalars['String'];
};


export type DeleteStockPortfolioMutation = (
  { __typename?: 'Mutation' }
  & { deleteOneStockPortfolio?: Maybe<(
    { __typename?: 'StockPortfolio' }
    & Pick<StockPortfolio, 'id' | 'name'>
  )> }
);

export type LoginLocalUserMutationVariables = {
  input: LoginLocalUserInput;
};


export type LoginLocalUserMutation = (
  { __typename?: 'Mutation' }
  & { loginLocalUser?: Maybe<(
    { __typename?: 'TokenPayload' }
    & Pick<TokenPayload, 'token' | 'refreshToken'>
  )> }
);

export type RefreshAccessTokenMutationVariables = {
  input: RefreshAccessTokenInput;
};


export type RefreshAccessTokenMutation = (
  { __typename?: 'Mutation' }
  & { refreshAccessToken?: Maybe<(
    { __typename?: 'TokenPayload' }
    & Pick<TokenPayload, 'token' | 'refreshToken'>
  )> }
);

export type RegisterLocalUserMutationVariables = {
  input: RegisterLocalUserInput;
};


export type RegisterLocalUserMutation = (
  { __typename?: 'Mutation' }
  & { registerLocalUser?: Maybe<(
    { __typename?: 'RegisterLocalUserPayload' }
    & Pick<RegisterLocalUserPayload, 'success' | 'error'>
    & { user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'email' | 'emailVerified' | 'username'>
    )> }
  )> }
);

export type ResendVerifyEmailMutationVariables = {};


export type ResendVerifyEmailMutation = (
  { __typename?: 'Mutation' }
  & { resendVerifyEmail?: Maybe<(
    { __typename?: 'ResendVerifyEmailPayload' }
    & Pick<ResendVerifyEmailPayload, 'success'>
  )> }
);

export type SetUserMutationVariables = {
  user?: Maybe<UserInput>;
};


export type SetUserMutation = (
  { __typename?: 'Mutation' }
  & { setUser?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'email' | 'emailVerified' | 'username'>
  )> }
);

export type ToggleModalMutationVariables = {
  force?: Maybe<Scalars['Boolean']>;
};


export type ToggleModalMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'toggleModal'>
);

export type UpdateOneStockPortfolioMutationVariables = {
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  tickers?: Maybe<Array<Scalars['String']>>;
  headers?: Maybe<Array<StockPortfolioHeaderInput>>;
};


export type UpdateOneStockPortfolioMutation = (
  { __typename?: 'Mutation' }
  & { updateOneStockPortfolio?: Maybe<(
    { __typename?: 'StockPortfolio' }
    & Pick<StockPortfolio, 'id' | 'name'>
  )> }
);

export type GetDataKeyOptionsQueryVariables = {
  name?: Maybe<Scalars['String']>;
  dataKey?: Maybe<Scalars['String']>;
  provider?: Maybe<Scalars['String']>;
};


export type GetDataKeyOptionsQuery = (
  { __typename?: 'Query' }
  & { dataKeyOptions: Array<(
    { __typename?: 'DataKeyOption' }
    & Pick<DataKeyOption, 'name' | 'dataKey' | 'description' | 'provider'>
  )> }
);

export type GetManyStockPortfoliosQueryVariables = {
  first?: Maybe<Scalars['Int']>;
  after?: Maybe<StockPortfolioWhereUniqueInput>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<StockPortfolioWhereInput>;
  query?: Maybe<Scalars['String']>;
};


export type GetManyStockPortfoliosQuery = (
  { __typename?: 'Query' }
  & { count: Query['stockPortfolioCount'] }
  & { stockPortfolios: Array<(
    { __typename?: 'StockPortfolio' }
    & Pick<StockPortfolio, 'id' | 'name' | 'updatedAt'>
  )> }
);

export type GetModalQueryVariables = {};


export type GetModalQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'modal'>
);

export type GetOneStockPortfolioQueryVariables = {
  where: StockPortfolioWhereUniqueInput;
};


export type GetOneStockPortfolioQuery = (
  { __typename?: 'Query' }
  & { stockPortfolio?: Maybe<(
    { __typename?: 'StockPortfolio' }
    & Pick<StockPortfolio, 'id' | 'name' | 'tickers' | 'createdAt' | 'updatedAt'>
    & { headers: Array<(
      { __typename?: 'StockPortfolioHeader' }
      & Pick<StockPortfolioHeader, 'name' | 'dataKey' | 'frozen' | 'resizable' | 'width'>
    )>, user: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username'>
    ) }
  )> }
);

export type GetStockDataQueryVariables = {
  tickers: Array<Scalars['String']>;
  dataKeys: Array<Scalars['String']>;
};


export type GetStockDataQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'stockData'>
);

export type GetUserQueryVariables = {};


export type GetUserQuery = (
  { __typename?: 'Query' }
  & { user?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'email' | 'emailVerified' | 'username'>
  )> }
);

export type GetViewerQueryVariables = {};


export type GetViewerQuery = (
  { __typename?: 'Query' }
  & { viewer?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'email' | 'emailVerified' | 'username'>
  )> }
);


export const CreateStockPortfolioDocument = gql`
    mutation CreateStockPortfolio($name: String!) {
  createOneStockPortfolio(data: {name: $name}) {
    id
    name
  }
}
    `;
export type CreateStockPortfolioMutationFn = ApolloReactCommon.MutationFunction<CreateStockPortfolioMutation, CreateStockPortfolioMutationVariables>;

/**
 * __useCreateStockPortfolioMutation__
 *
 * To run a mutation, you first call `useCreateStockPortfolioMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateStockPortfolioMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createStockPortfolioMutation, { data, loading, error }] = useCreateStockPortfolioMutation({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useCreateStockPortfolioMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateStockPortfolioMutation, CreateStockPortfolioMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateStockPortfolioMutation, CreateStockPortfolioMutationVariables>(CreateStockPortfolioDocument, baseOptions);
      }
export type CreateStockPortfolioMutationHookResult = ReturnType<typeof useCreateStockPortfolioMutation>;
export type CreateStockPortfolioMutationResult = ApolloReactCommon.MutationResult<CreateStockPortfolioMutation>;
export type CreateStockPortfolioMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateStockPortfolioMutation, CreateStockPortfolioMutationVariables>;
export const DeleteStockPortfolioDocument = gql`
    mutation DeleteStockPortfolio($id: String!) {
  deleteOneStockPortfolio(where: {id: $id}) {
    id
    name
  }
}
    `;
export type DeleteStockPortfolioMutationFn = ApolloReactCommon.MutationFunction<DeleteStockPortfolioMutation, DeleteStockPortfolioMutationVariables>;

/**
 * __useDeleteStockPortfolioMutation__
 *
 * To run a mutation, you first call `useDeleteStockPortfolioMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteStockPortfolioMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteStockPortfolioMutation, { data, loading, error }] = useDeleteStockPortfolioMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteStockPortfolioMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteStockPortfolioMutation, DeleteStockPortfolioMutationVariables>) {
        return ApolloReactHooks.useMutation<DeleteStockPortfolioMutation, DeleteStockPortfolioMutationVariables>(DeleteStockPortfolioDocument, baseOptions);
      }
export type DeleteStockPortfolioMutationHookResult = ReturnType<typeof useDeleteStockPortfolioMutation>;
export type DeleteStockPortfolioMutationResult = ApolloReactCommon.MutationResult<DeleteStockPortfolioMutation>;
export type DeleteStockPortfolioMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteStockPortfolioMutation, DeleteStockPortfolioMutationVariables>;
export const LoginLocalUserDocument = gql`
    mutation LoginLocalUser($input: LoginLocalUserInput!) {
  loginLocalUser(input: $input) {
    token
    refreshToken
  }
}
    `;
export type LoginLocalUserMutationFn = ApolloReactCommon.MutationFunction<LoginLocalUserMutation, LoginLocalUserMutationVariables>;

/**
 * __useLoginLocalUserMutation__
 *
 * To run a mutation, you first call `useLoginLocalUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginLocalUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginLocalUserMutation, { data, loading, error }] = useLoginLocalUserMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useLoginLocalUserMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<LoginLocalUserMutation, LoginLocalUserMutationVariables>) {
        return ApolloReactHooks.useMutation<LoginLocalUserMutation, LoginLocalUserMutationVariables>(LoginLocalUserDocument, baseOptions);
      }
export type LoginLocalUserMutationHookResult = ReturnType<typeof useLoginLocalUserMutation>;
export type LoginLocalUserMutationResult = ApolloReactCommon.MutationResult<LoginLocalUserMutation>;
export type LoginLocalUserMutationOptions = ApolloReactCommon.BaseMutationOptions<LoginLocalUserMutation, LoginLocalUserMutationVariables>;
export const RefreshAccessTokenDocument = gql`
    mutation RefreshAccessToken($input: RefreshAccessTokenInput!) {
  refreshAccessToken(input: $input) {
    token
    refreshToken
  }
}
    `;
export type RefreshAccessTokenMutationFn = ApolloReactCommon.MutationFunction<RefreshAccessTokenMutation, RefreshAccessTokenMutationVariables>;

/**
 * __useRefreshAccessTokenMutation__
 *
 * To run a mutation, you first call `useRefreshAccessTokenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRefreshAccessTokenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [refreshAccessTokenMutation, { data, loading, error }] = useRefreshAccessTokenMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRefreshAccessTokenMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<RefreshAccessTokenMutation, RefreshAccessTokenMutationVariables>) {
        return ApolloReactHooks.useMutation<RefreshAccessTokenMutation, RefreshAccessTokenMutationVariables>(RefreshAccessTokenDocument, baseOptions);
      }
export type RefreshAccessTokenMutationHookResult = ReturnType<typeof useRefreshAccessTokenMutation>;
export type RefreshAccessTokenMutationResult = ApolloReactCommon.MutationResult<RefreshAccessTokenMutation>;
export type RefreshAccessTokenMutationOptions = ApolloReactCommon.BaseMutationOptions<RefreshAccessTokenMutation, RefreshAccessTokenMutationVariables>;
export const RegisterLocalUserDocument = gql`
    mutation RegisterLocalUser($input: RegisterLocalUserInput!) {
  registerLocalUser(input: $input) {
    success
    error
    user {
      id
      email
      emailVerified
      username
    }
  }
}
    `;
export type RegisterLocalUserMutationFn = ApolloReactCommon.MutationFunction<RegisterLocalUserMutation, RegisterLocalUserMutationVariables>;

/**
 * __useRegisterLocalUserMutation__
 *
 * To run a mutation, you first call `useRegisterLocalUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterLocalUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerLocalUserMutation, { data, loading, error }] = useRegisterLocalUserMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRegisterLocalUserMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<RegisterLocalUserMutation, RegisterLocalUserMutationVariables>) {
        return ApolloReactHooks.useMutation<RegisterLocalUserMutation, RegisterLocalUserMutationVariables>(RegisterLocalUserDocument, baseOptions);
      }
export type RegisterLocalUserMutationHookResult = ReturnType<typeof useRegisterLocalUserMutation>;
export type RegisterLocalUserMutationResult = ApolloReactCommon.MutationResult<RegisterLocalUserMutation>;
export type RegisterLocalUserMutationOptions = ApolloReactCommon.BaseMutationOptions<RegisterLocalUserMutation, RegisterLocalUserMutationVariables>;
export const ResendVerifyEmailDocument = gql`
    mutation ResendVerifyEmail {
  resendVerifyEmail {
    success
  }
}
    `;
export type ResendVerifyEmailMutationFn = ApolloReactCommon.MutationFunction<ResendVerifyEmailMutation, ResendVerifyEmailMutationVariables>;

/**
 * __useResendVerifyEmailMutation__
 *
 * To run a mutation, you first call `useResendVerifyEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResendVerifyEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resendVerifyEmailMutation, { data, loading, error }] = useResendVerifyEmailMutation({
 *   variables: {
 *   },
 * });
 */
export function useResendVerifyEmailMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ResendVerifyEmailMutation, ResendVerifyEmailMutationVariables>) {
        return ApolloReactHooks.useMutation<ResendVerifyEmailMutation, ResendVerifyEmailMutationVariables>(ResendVerifyEmailDocument, baseOptions);
      }
export type ResendVerifyEmailMutationHookResult = ReturnType<typeof useResendVerifyEmailMutation>;
export type ResendVerifyEmailMutationResult = ApolloReactCommon.MutationResult<ResendVerifyEmailMutation>;
export type ResendVerifyEmailMutationOptions = ApolloReactCommon.BaseMutationOptions<ResendVerifyEmailMutation, ResendVerifyEmailMutationVariables>;
export const SetUserDocument = gql`
    mutation SetUser($user: UserInput) {
  setUser(user: $user) @client {
    id
    email
    emailVerified
    username
  }
}
    `;
export type SetUserMutationFn = ApolloReactCommon.MutationFunction<SetUserMutation, SetUserMutationVariables>;

/**
 * __useSetUserMutation__
 *
 * To run a mutation, you first call `useSetUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setUserMutation, { data, loading, error }] = useSetUserMutation({
 *   variables: {
 *      user: // value for 'user'
 *   },
 * });
 */
export function useSetUserMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SetUserMutation, SetUserMutationVariables>) {
        return ApolloReactHooks.useMutation<SetUserMutation, SetUserMutationVariables>(SetUserDocument, baseOptions);
      }
export type SetUserMutationHookResult = ReturnType<typeof useSetUserMutation>;
export type SetUserMutationResult = ApolloReactCommon.MutationResult<SetUserMutation>;
export type SetUserMutationOptions = ApolloReactCommon.BaseMutationOptions<SetUserMutation, SetUserMutationVariables>;
export const ToggleModalDocument = gql`
    mutation ToggleModal($force: Boolean) {
  toggleModal(force: $force) @client
}
    `;
export type ToggleModalMutationFn = ApolloReactCommon.MutationFunction<ToggleModalMutation, ToggleModalMutationVariables>;

/**
 * __useToggleModalMutation__
 *
 * To run a mutation, you first call `useToggleModalMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useToggleModalMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleModalMutation, { data, loading, error }] = useToggleModalMutation({
 *   variables: {
 *      force: // value for 'force'
 *   },
 * });
 */
export function useToggleModalMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ToggleModalMutation, ToggleModalMutationVariables>) {
        return ApolloReactHooks.useMutation<ToggleModalMutation, ToggleModalMutationVariables>(ToggleModalDocument, baseOptions);
      }
export type ToggleModalMutationHookResult = ReturnType<typeof useToggleModalMutation>;
export type ToggleModalMutationResult = ApolloReactCommon.MutationResult<ToggleModalMutation>;
export type ToggleModalMutationOptions = ApolloReactCommon.BaseMutationOptions<ToggleModalMutation, ToggleModalMutationVariables>;
export const UpdateOneStockPortfolioDocument = gql`
    mutation UpdateOneStockPortfolio($id: String!, $name: String, $tickers: [String!] = [], $headers: [StockPortfolioHeaderInput!]) {
  updateOneStockPortfolio(data: {name: $name, tickers: $tickers, headers: $headers}, where: {id: $id}) {
    id
    name
  }
}
    `;
export type UpdateOneStockPortfolioMutationFn = ApolloReactCommon.MutationFunction<UpdateOneStockPortfolioMutation, UpdateOneStockPortfolioMutationVariables>;

/**
 * __useUpdateOneStockPortfolioMutation__
 *
 * To run a mutation, you first call `useUpdateOneStockPortfolioMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateOneStockPortfolioMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateOneStockPortfolioMutation, { data, loading, error }] = useUpdateOneStockPortfolioMutation({
 *   variables: {
 *      id: // value for 'id'
 *      name: // value for 'name'
 *      tickers: // value for 'tickers'
 *      headers: // value for 'headers'
 *   },
 * });
 */
export function useUpdateOneStockPortfolioMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateOneStockPortfolioMutation, UpdateOneStockPortfolioMutationVariables>) {
        return ApolloReactHooks.useMutation<UpdateOneStockPortfolioMutation, UpdateOneStockPortfolioMutationVariables>(UpdateOneStockPortfolioDocument, baseOptions);
      }
export type UpdateOneStockPortfolioMutationHookResult = ReturnType<typeof useUpdateOneStockPortfolioMutation>;
export type UpdateOneStockPortfolioMutationResult = ApolloReactCommon.MutationResult<UpdateOneStockPortfolioMutation>;
export type UpdateOneStockPortfolioMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateOneStockPortfolioMutation, UpdateOneStockPortfolioMutationVariables>;
export const GetDataKeyOptionsDocument = gql`
    query GetDataKeyOptions($name: String, $dataKey: String, $provider: String) {
  dataKeyOptions(name: $name, dataKey: $dataKey, provider: $provider) {
    name
    dataKey
    description
    provider
  }
}
    `;

/**
 * __useGetDataKeyOptionsQuery__
 *
 * To run a query within a React component, call `useGetDataKeyOptionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDataKeyOptionsQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDataKeyOptionsQuery({
 *   variables: {
 *      name: // value for 'name'
 *      dataKey: // value for 'dataKey'
 *      provider: // value for 'provider'
 *   },
 * });
 */
export function useGetDataKeyOptionsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetDataKeyOptionsQuery, GetDataKeyOptionsQueryVariables>) {
        return ApolloReactHooks.useQuery<GetDataKeyOptionsQuery, GetDataKeyOptionsQueryVariables>(GetDataKeyOptionsDocument, baseOptions);
      }
export function useGetDataKeyOptionsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetDataKeyOptionsQuery, GetDataKeyOptionsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetDataKeyOptionsQuery, GetDataKeyOptionsQueryVariables>(GetDataKeyOptionsDocument, baseOptions);
        }
export type GetDataKeyOptionsQueryHookResult = ReturnType<typeof useGetDataKeyOptionsQuery>;
export type GetDataKeyOptionsLazyQueryHookResult = ReturnType<typeof useGetDataKeyOptionsLazyQuery>;
export type GetDataKeyOptionsQueryResult = ApolloReactCommon.QueryResult<GetDataKeyOptionsQuery, GetDataKeyOptionsQueryVariables>;
export const GetManyStockPortfoliosDocument = gql`
    query GetManyStockPortfolios($first: Int, $after: StockPortfolioWhereUniqueInput, $skip: Int, $where: StockPortfolioWhereInput, $query: String) {
  stockPortfolios(first: $first, after: $after, skip: $skip, where: $where, query: $query) {
    id
    name
    updatedAt
  }
  count: stockPortfolioCount(where: $where, query: $query)
}
    `;

/**
 * __useGetManyStockPortfoliosQuery__
 *
 * To run a query within a React component, call `useGetManyStockPortfoliosQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetManyStockPortfoliosQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetManyStockPortfoliosQuery({
 *   variables: {
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      skip: // value for 'skip'
 *      where: // value for 'where'
 *      query: // value for 'query'
 *   },
 * });
 */
export function useGetManyStockPortfoliosQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetManyStockPortfoliosQuery, GetManyStockPortfoliosQueryVariables>) {
        return ApolloReactHooks.useQuery<GetManyStockPortfoliosQuery, GetManyStockPortfoliosQueryVariables>(GetManyStockPortfoliosDocument, baseOptions);
      }
export function useGetManyStockPortfoliosLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetManyStockPortfoliosQuery, GetManyStockPortfoliosQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetManyStockPortfoliosQuery, GetManyStockPortfoliosQueryVariables>(GetManyStockPortfoliosDocument, baseOptions);
        }
export type GetManyStockPortfoliosQueryHookResult = ReturnType<typeof useGetManyStockPortfoliosQuery>;
export type GetManyStockPortfoliosLazyQueryHookResult = ReturnType<typeof useGetManyStockPortfoliosLazyQuery>;
export type GetManyStockPortfoliosQueryResult = ApolloReactCommon.QueryResult<GetManyStockPortfoliosQuery, GetManyStockPortfoliosQueryVariables>;
export const GetModalDocument = gql`
    query GetModal {
  modal @client
}
    `;

/**
 * __useGetModalQuery__
 *
 * To run a query within a React component, call `useGetModalQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetModalQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetModalQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetModalQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetModalQuery, GetModalQueryVariables>) {
        return ApolloReactHooks.useQuery<GetModalQuery, GetModalQueryVariables>(GetModalDocument, baseOptions);
      }
export function useGetModalLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetModalQuery, GetModalQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetModalQuery, GetModalQueryVariables>(GetModalDocument, baseOptions);
        }
export type GetModalQueryHookResult = ReturnType<typeof useGetModalQuery>;
export type GetModalLazyQueryHookResult = ReturnType<typeof useGetModalLazyQuery>;
export type GetModalQueryResult = ApolloReactCommon.QueryResult<GetModalQuery, GetModalQueryVariables>;
export const GetOneStockPortfolioDocument = gql`
    query GetOneStockPortfolio($where: StockPortfolioWhereUniqueInput!) {
  stockPortfolio(where: $where) {
    id
    name
    headers {
      name
      dataKey
      frozen
      resizable
      width
    }
    tickers
    createdAt
    updatedAt
    user {
      id
      username
    }
  }
}
    `;

/**
 * __useGetOneStockPortfolioQuery__
 *
 * To run a query within a React component, call `useGetOneStockPortfolioQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOneStockPortfolioQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOneStockPortfolioQuery({
 *   variables: {
 *      where: // value for 'where'
 *   },
 * });
 */
export function useGetOneStockPortfolioQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetOneStockPortfolioQuery, GetOneStockPortfolioQueryVariables>) {
        return ApolloReactHooks.useQuery<GetOneStockPortfolioQuery, GetOneStockPortfolioQueryVariables>(GetOneStockPortfolioDocument, baseOptions);
      }
export function useGetOneStockPortfolioLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetOneStockPortfolioQuery, GetOneStockPortfolioQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetOneStockPortfolioQuery, GetOneStockPortfolioQueryVariables>(GetOneStockPortfolioDocument, baseOptions);
        }
export type GetOneStockPortfolioQueryHookResult = ReturnType<typeof useGetOneStockPortfolioQuery>;
export type GetOneStockPortfolioLazyQueryHookResult = ReturnType<typeof useGetOneStockPortfolioLazyQuery>;
export type GetOneStockPortfolioQueryResult = ApolloReactCommon.QueryResult<GetOneStockPortfolioQuery, GetOneStockPortfolioQueryVariables>;
export const GetStockDataDocument = gql`
    query GetStockData($tickers: [String!]!, $dataKeys: [String!]!) {
  stockData(tickers: $tickers, dataKeys: $dataKeys)
}
    `;

/**
 * __useGetStockDataQuery__
 *
 * To run a query within a React component, call `useGetStockDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStockDataQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStockDataQuery({
 *   variables: {
 *      tickers: // value for 'tickers'
 *      dataKeys: // value for 'dataKeys'
 *   },
 * });
 */
export function useGetStockDataQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetStockDataQuery, GetStockDataQueryVariables>) {
        return ApolloReactHooks.useQuery<GetStockDataQuery, GetStockDataQueryVariables>(GetStockDataDocument, baseOptions);
      }
export function useGetStockDataLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetStockDataQuery, GetStockDataQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetStockDataQuery, GetStockDataQueryVariables>(GetStockDataDocument, baseOptions);
        }
export type GetStockDataQueryHookResult = ReturnType<typeof useGetStockDataQuery>;
export type GetStockDataLazyQueryHookResult = ReturnType<typeof useGetStockDataLazyQuery>;
export type GetStockDataQueryResult = ApolloReactCommon.QueryResult<GetStockDataQuery, GetStockDataQueryVariables>;
export const GetUserDocument = gql`
    query GetUser {
  user @client {
    id
    email
    emailVerified
    username
  }
}
    `;

/**
 * __useGetUserQuery__
 *
 * To run a query within a React component, call `useGetUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUserQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
        return ApolloReactHooks.useQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, baseOptions);
      }
export function useGetUserLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, baseOptions);
        }
export type GetUserQueryHookResult = ReturnType<typeof useGetUserQuery>;
export type GetUserLazyQueryHookResult = ReturnType<typeof useGetUserLazyQuery>;
export type GetUserQueryResult = ApolloReactCommon.QueryResult<GetUserQuery, GetUserQueryVariables>;
export const GetViewerDocument = gql`
    query GetViewer {
  viewer {
    id
    email
    emailVerified
    username
  }
}
    `;

/**
 * __useGetViewerQuery__
 *
 * To run a query within a React component, call `useGetViewerQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetViewerQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetViewerQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetViewerQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetViewerQuery, GetViewerQueryVariables>) {
        return ApolloReactHooks.useQuery<GetViewerQuery, GetViewerQueryVariables>(GetViewerDocument, baseOptions);
      }
export function useGetViewerLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetViewerQuery, GetViewerQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetViewerQuery, GetViewerQueryVariables>(GetViewerDocument, baseOptions);
        }
export type GetViewerQueryHookResult = ReturnType<typeof useGetViewerQuery>;
export type GetViewerLazyQueryHookResult = ReturnType<typeof useGetViewerLazyQuery>;
export type GetViewerQueryResult = ApolloReactCommon.QueryResult<GetViewerQuery, GetViewerQueryVariables>;