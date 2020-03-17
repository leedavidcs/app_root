/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateStockPortfolio
// ====================================================

export interface CreateStockPortfolio_createOneStockPortfolio {
  readonly __typename: "StockPortfolio";
  readonly id: string;
  readonly name: string;
}

export interface CreateStockPortfolio {
  readonly createOneStockPortfolio: CreateStockPortfolio_createOneStockPortfolio;
}

export interface CreateStockPortfolioVariables {
  readonly name: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteStockPortfolio
// ====================================================

export interface DeleteStockPortfolio_deleteOneStockPortfolio {
  readonly __typename: "StockPortfolio";
  readonly id: string;
  readonly name: string;
}

export interface DeleteStockPortfolio {
  readonly deleteOneStockPortfolio: DeleteStockPortfolio_deleteOneStockPortfolio | null;
}

export interface DeleteStockPortfolioVariables {
  readonly id?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: LoginLocalUser
// ====================================================

export interface LoginLocalUser_loginLocalUser {
  readonly __typename: "TokenPayload";
  /**
   * JSON web token to authenticate API requests
   */
  readonly token: string;
  /**
   * JSON web token to refresh the token
   */
  readonly refreshToken: string;
}

export interface LoginLocalUser {
  /**
   * Logins in the user, and returns an expiring access token
   */
  readonly loginLocalUser: LoginLocalUser_loginLocalUser | null;
}

export interface LoginLocalUserVariables {
  readonly input: LoginLocalUserInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RefreshAccessToken
// ====================================================

export interface RefreshAccessToken_refreshAccessToken {
  readonly __typename: "TokenPayload";
  /**
   * JSON web token to authenticate API requests
   */
  readonly token: string;
  /**
   * JSON web token to refresh the token
   */
  readonly refreshToken: string;
}

export interface RefreshAccessToken {
  /**
   * Refreshes the currently logged-in user's access token
   */
  readonly refreshAccessToken: RefreshAccessToken_refreshAccessToken | null;
}

export interface RefreshAccessTokenVariables {
  readonly input: RefreshAccessTokenInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RegisterLocalUser
// ====================================================

export interface RegisterLocalUser_registerLocalUser_user {
  readonly __typename: "User";
  readonly id: string;
  /**
   * The user's email
   */
  readonly email: any | null;
  readonly emailVerified: boolean;
  readonly username: string;
}

export interface RegisterLocalUser_registerLocalUser {
  readonly __typename: "RegisterLocalUserPayload";
  /**
   * Whether the registration successfully created a user or not
   */
  readonly success: boolean;
  /**
   * An error will be described if success is false
   */
  readonly error: string | null;
  /**
   * The user object
   */
  readonly user: RegisterLocalUser_registerLocalUser_user | null;
}

export interface RegisterLocalUser {
  /**
   * Performs local auth registration (custom username + password)
   */
  readonly registerLocalUser: RegisterLocalUser_registerLocalUser | null;
}

export interface RegisterLocalUserVariables {
  readonly input: RegisterLocalUserInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ResendVerifyEmail
// ====================================================

export interface ResendVerifyEmail_resendVerifyEmail {
  readonly __typename: "ResendVerifyEmailPayload";
  /**
   * Status, on whether the email was successfully resent
   */
  readonly success: boolean;
}

export interface ResendVerifyEmail {
  /**
   * Resends the account verification email to the logged-in user
   */
  readonly resendVerifyEmail: ResendVerifyEmail_resendVerifyEmail | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SetUser
// ====================================================

export interface SetUser_setUser {
  readonly __typename: "User";
  readonly id: string;
  /**
   * The user's email
   */
  readonly email: any | null;
  readonly emailVerified: boolean;
  readonly username: string;
}

export interface SetUser {
  readonly setUser: SetUser_setUser | null;
}

export interface SetUserVariables {
  readonly user?: UserInput | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ToggleModal
// ====================================================

export interface ToggleModal {
  readonly toggleModal: boolean;
}

export interface ToggleModalVariables {
  readonly force?: boolean | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetModal
// ====================================================

export interface GetModal {
  readonly modal: boolean;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetOneStockPortfolio
// ====================================================

export interface GetOneStockPortfolio_stockPortfolio_headers {
  readonly __typename: "StockPortfolioHeader";
  readonly name: string;
  readonly dataKey: string;
  readonly width: number;
  readonly frozen: boolean;
  readonly resizable: boolean;
}

export interface GetOneStockPortfolio_stockPortfolio {
  readonly __typename: "StockPortfolio";
  readonly id: string;
  readonly name: string;
  readonly headers: ReadonlyArray<GetOneStockPortfolio_stockPortfolio_headers>;
  readonly tickers: ReadonlyArray<string>;
  readonly createdAt: any;
  readonly updatedAt: any;
}

export interface GetOneStockPortfolio {
  readonly stockPortfolio: GetOneStockPortfolio_stockPortfolio | null;
}

export interface GetOneStockPortfolioVariables {
  readonly id?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetStockPortfolioCount
// ====================================================

export interface GetStockPortfolioCount {
  readonly stockPortfolioCount: number | null;
}

export interface GetStockPortfolioCountVariables {
  readonly where?: StockPortfolioWhereInput | null;
  readonly query?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetStockPortfoliosForPreview
// ====================================================

export interface GetStockPortfoliosForPreview_stockPortfolios {
  readonly __typename: "StockPortfolio";
  readonly id: string;
  readonly name: string;
  readonly updatedAt: any;
}

export interface GetStockPortfoliosForPreview {
  readonly stockPortfolios: ReadonlyArray<GetStockPortfoliosForPreview_stockPortfolios>;
}

export interface GetStockPortfoliosForPreviewVariables {
  readonly first?: number | null;
  readonly after?: StockPortfolioWhereUniqueInput | null;
  readonly skip?: number | null;
  readonly where?: StockPortfolioWhereInput | null;
  readonly query?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetUser
// ====================================================

export interface GetUser_user {
  readonly __typename: "User";
  readonly id: string;
  /**
   * The user's email
   */
  readonly email: any | null;
  readonly emailVerified: boolean;
  readonly username: string;
}

export interface GetUser {
  readonly user: GetUser_user | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetViewer
// ====================================================

export interface GetViewer_viewer {
  readonly __typename: "User";
  readonly id: string;
  /**
   * The user's email
   */
  readonly email: any | null;
  readonly emailVerified: boolean;
  readonly username: string;
}

export interface GetViewer {
  /**
   * The viewer of this request
   */
  readonly viewer: GetViewer_viewer | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export interface BooleanFilter {
  readonly equals?: boolean | null;
  readonly not?: boolean | null;
}

export interface DateTimeFilter {
  readonly equals?: any | null;
  readonly not?: any | null;
  readonly in?: ReadonlyArray<any> | null;
  readonly notIn?: ReadonlyArray<any> | null;
  readonly lt?: any | null;
  readonly lte?: any | null;
  readonly gt?: any | null;
  readonly gte?: any | null;
}

export interface IntFilter {
  readonly equals?: number | null;
  readonly not?: number | null;
  readonly in?: ReadonlyArray<number> | null;
  readonly notIn?: ReadonlyArray<number> | null;
  readonly lt?: number | null;
  readonly lte?: number | null;
  readonly gt?: number | null;
  readonly gte?: number | null;
}

export interface LoginLocalUserInput {
  readonly userIdentifier: string;
  readonly password: string;
}

export interface RefreshAccessTokenInput {
  readonly refreshToken: string;
}

export interface RegisterLocalUserInput {
  readonly email: any;
  readonly password: any;
  readonly username: string;
}

export interface StockPortfolioFilter {
  readonly every?: StockPortfolioWhereInput | null;
  readonly some?: StockPortfolioWhereInput | null;
  readonly none?: StockPortfolioWhereInput | null;
}

export interface StockPortfolioHeaderFilter {
  readonly every?: StockPortfolioHeaderWhereInput | null;
  readonly some?: StockPortfolioHeaderWhereInput | null;
  readonly none?: StockPortfolioHeaderWhereInput | null;
}

export interface StockPortfolioHeaderWhereInput {
  readonly id?: UUIDFilter | null;
  readonly name?: StringFilter | null;
  readonly dataKey?: StringFilter | null;
  readonly width?: IntFilter | null;
  readonly frozen?: BooleanFilter | null;
  readonly resizable?: BooleanFilter | null;
  readonly AND?: ReadonlyArray<StockPortfolioHeaderWhereInput> | null;
  readonly OR?: ReadonlyArray<StockPortfolioHeaderWhereInput> | null;
  readonly NOT?: ReadonlyArray<StockPortfolioHeaderWhereInput> | null;
  readonly stockPortfolio?: StockPortfolioWhereInput | null;
}

export interface StockPortfolioWhereInput {
  readonly id?: UUIDFilter | null;
  readonly name?: StringFilter | null;
  readonly headers?: StockPortfolioHeaderFilter | null;
  readonly createdAt?: DateTimeFilter | null;
  readonly updatedAt?: DateTimeFilter | null;
  readonly AND?: ReadonlyArray<StockPortfolioWhereInput> | null;
  readonly OR?: ReadonlyArray<StockPortfolioWhereInput> | null;
  readonly NOT?: ReadonlyArray<StockPortfolioWhereInput> | null;
  readonly user?: UserWhereInput | null;
}

export interface StockPortfolioWhereUniqueInput {
  readonly id?: string | null;
  readonly user_name?: UserNameCompoundUniqueInput | null;
}

export interface StringFilter {
  readonly equals?: string | null;
  readonly not?: string | null;
  readonly in?: ReadonlyArray<string> | null;
  readonly notIn?: ReadonlyArray<string> | null;
  readonly lt?: string | null;
  readonly lte?: string | null;
  readonly gt?: string | null;
  readonly gte?: string | null;
  readonly contains?: string | null;
  readonly startsWith?: string | null;
  readonly endsWith?: string | null;
}

export interface UUIDFilter {
  readonly equals?: any | null;
  readonly not?: any | null;
  readonly in?: ReadonlyArray<any> | null;
  readonly notIn?: ReadonlyArray<any> | null;
  readonly lt?: any | null;
  readonly lte?: any | null;
  readonly gt?: any | null;
  readonly gte?: any | null;
  readonly contains?: any | null;
  readonly startsWith?: any | null;
  readonly endsWith?: any | null;
}

export interface UserInput {
  readonly id: string;
  readonly email: any;
  readonly emailVerified: boolean;
  readonly username: string;
}

export interface UserNameCompoundUniqueInput {
  readonly user: string;
  readonly name: string;
}

export interface UserWhereInput {
  readonly id?: UUIDFilter | null;
  readonly email?: StringFilter | null;
  readonly emailVerified?: BooleanFilter | null;
  readonly password?: StringFilter | null;
  readonly username?: StringFilter | null;
  readonly createdAt?: DateTimeFilter | null;
  readonly updatedAt?: DateTimeFilter | null;
  readonly stockPortfolios?: StockPortfolioFilter | null;
  readonly AND?: ReadonlyArray<UserWhereInput> | null;
  readonly OR?: ReadonlyArray<UserWhereInput> | null;
  readonly NOT?: ReadonlyArray<UserWhereInput> | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
