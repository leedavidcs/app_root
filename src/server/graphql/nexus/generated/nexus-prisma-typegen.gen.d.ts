import * as Typegen from 'nexus-plugin-prisma/typegen'
import * as Prisma from '@prisma/client';

// Pagination type
type Pagination = {
  take?: boolean
  skip?: boolean
  cursor?: boolean
}

// Prisma custom scalar names
type CustomScalars = 'DateTime' | 'Json'

// Prisma model type definitions
interface PrismaModels {
  User: Prisma.User
  StockPortfolio: Prisma.StockPortfolio
  Position: Prisma.Position
  Order: Prisma.Order
  StockPortfolioSettings: Prisma.StockPortfolioSettings
  Balance: Prisma.Balance
  Transaction: Prisma.Transaction
  StripeDetails: Prisma.StripeDetails
  Webhook: Prisma.Webhook
  Snapshot: Prisma.Snapshot
  LatestSnapshot: Prisma.LatestSnapshot
  ScheduledEvent: Prisma.ScheduledEvent
  StockPortfolioEvent: Prisma.StockPortfolioEvent
  OrderEvent: Prisma.OrderEvent
}

// Prisma input types metadata
interface NexusPrismaInputs {
  Query: {
    users: {
      filtering: 'id' | 'email' | 'emailVerified' | 'password' | 'username' | 'timezone' | 'stockPortfolios' | 'createdAt' | 'updatedAt' | 'Transaction' | 'ScheduledEvent' | 'AND' | 'OR' | 'NOT' | 'balance' | 'stripeDetails'
      ordering: 'id' | 'email' | 'emailVerified' | 'password' | 'username' | 'timezone' | 'createdAt' | 'updatedAt'
    }
    stockPortfolios: {
      filtering: 'id' | 'userId' | 'name' | 'snapshots' | 'orders' | 'buyingPower' | 'createdAt' | 'updatedAt' | 'Position' | 'Webhook' | 'StockPortfolioEvent' | 'AND' | 'OR' | 'NOT' | 'user' | 'settings' | 'latestSnapshot'
      ordering: 'id' | 'userId' | 'name' | 'buyingPower' | 'createdAt' | 'updatedAt'
    }
    positions: {
      filtering: 'id' | 'stockPortfolioId' | 'ticker' | 'quantity' | 'avgEntryPrice' | 'costBasis' | 'AND' | 'OR' | 'NOT' | 'stockPortfolio'
      ordering: 'id' | 'stockPortfolioId' | 'ticker' | 'quantity' | 'avgEntryPrice' | 'costBasis'
    }
    orders: {
      filtering: 'id' | 'stockPortfolioId' | 'ticker' | 'quantity' | 'filledQuantity' | 'type' | 'side' | 'status' | 'limitPrice' | 'stopPrice' | 'avgFilledPrice' | 'timeInForce' | 'createdAt' | 'filledAt' | 'cancelledAt' | 'failedAt' | 'AND' | 'OR' | 'NOT' | 'stockPortfolio'
      ordering: 'id' | 'stockPortfolioId' | 'ticker' | 'quantity' | 'filledQuantity' | 'type' | 'side' | 'status' | 'limitPrice' | 'stopPrice' | 'avgFilledPrice' | 'timeInForce' | 'createdAt' | 'filledAt' | 'cancelledAt' | 'failedAt'
    }
    stockPortfolioSettings: {
      filtering: 'stockPortfolioId' | 'enableSnapshots' | 'AND' | 'OR' | 'NOT' | 'stockPortfolio'
      ordering: 'stockPortfolioId' | 'enableSnapshots'
    }
    balances: {
      filtering: 'userId' | 'credits' | 'AND' | 'OR' | 'NOT' | 'user'
      ordering: 'userId' | 'credits'
    }
    transactions: {
      filtering: 'id' | 'userId' | 'creditsBefore' | 'creditsTransacted' | 'createdAt' | 'paymentIntentId' | 'status' | 'AND' | 'OR' | 'NOT' | 'user'
      ordering: 'id' | 'userId' | 'creditsBefore' | 'creditsTransacted' | 'createdAt' | 'paymentIntentId' | 'status'
    }
    stripeDetails: {
      filtering: 'userId' | 'customerId' | 'AND' | 'OR' | 'NOT' | 'user'
      ordering: 'userId' | 'customerId'
    }
    webhooks: {
      filtering: 'id' | 'stockPortfolioId' | 'query' | 'secret' | 'type' | 'url' | 'timeout' | 'createdAt' | 'AND' | 'OR' | 'NOT' | 'stockPortfolio'
      ordering: 'id' | 'stockPortfolioId' | 'query' | 'secret' | 'type' | 'url' | 'timeout' | 'createdAt'
    }
    snapshots: {
      filtering: 'id' | 'stockPortfolioId' | 'createdAt' | 'LatestSnapshot' | 'AND' | 'OR' | 'NOT' | 'stockPortfolio'
      ordering: 'id' | 'stockPortfolioId' | 'createdAt'
    }
    latestSnapshots: {
      filtering: 'snapshotId' | 'stockPortfolioId' | 'updatedAt' | 'AND' | 'OR' | 'NOT' | 'snapshot' | 'stockPortfolio'
      ordering: 'snapshotId' | 'stockPortfolioId' | 'updatedAt'
    }
    scheduledEvents: {
      filtering: 'id' | 'userId' | 'recurrence' | 'hour' | 'minute' | 'interval' | 'next' | 'StockPortfolioEvent' | 'OrderEvent' | 'AND' | 'OR' | 'NOT' | 'user'
      ordering: 'id' | 'userId' | 'recurrence' | 'hour' | 'minute' | 'interval' | 'next'
    }
    stockPortfolioEvents: {
      filtering: 'scheduledEventId' | 'type' | 'stockPortfolioId' | 'AND' | 'OR' | 'NOT' | 'scheduledEvent' | 'stockPortfolio'
      ordering: 'scheduledEventId' | 'type' | 'stockPortfolioId'
    }
    orderEvents: {
      filtering: 'scheduledEventId' | 'type' | 'AND' | 'OR' | 'NOT' | 'scheduledEvent'
      ordering: 'scheduledEventId' | 'type'
    }
  },
  User: {
    stockPortfolios: {
      filtering: 'id' | 'userId' | 'name' | 'snapshots' | 'orders' | 'buyingPower' | 'createdAt' | 'updatedAt' | 'Position' | 'Webhook' | 'StockPortfolioEvent' | 'AND' | 'OR' | 'NOT' | 'user' | 'settings' | 'latestSnapshot'
      ordering: 'id' | 'userId' | 'name' | 'buyingPower' | 'createdAt' | 'updatedAt'
    }
    Transaction: {
      filtering: 'id' | 'userId' | 'creditsBefore' | 'creditsTransacted' | 'createdAt' | 'paymentIntentId' | 'status' | 'AND' | 'OR' | 'NOT' | 'user'
      ordering: 'id' | 'userId' | 'creditsBefore' | 'creditsTransacted' | 'createdAt' | 'paymentIntentId' | 'status'
    }
    ScheduledEvent: {
      filtering: 'id' | 'userId' | 'recurrence' | 'hour' | 'minute' | 'interval' | 'next' | 'StockPortfolioEvent' | 'OrderEvent' | 'AND' | 'OR' | 'NOT' | 'user'
      ordering: 'id' | 'userId' | 'recurrence' | 'hour' | 'minute' | 'interval' | 'next'
    }
  }
  StockPortfolio: {
    snapshots: {
      filtering: 'id' | 'stockPortfolioId' | 'createdAt' | 'LatestSnapshot' | 'AND' | 'OR' | 'NOT' | 'stockPortfolio'
      ordering: 'id' | 'stockPortfolioId' | 'createdAt'
    }
    orders: {
      filtering: 'id' | 'stockPortfolioId' | 'ticker' | 'quantity' | 'filledQuantity' | 'type' | 'side' | 'status' | 'limitPrice' | 'stopPrice' | 'avgFilledPrice' | 'timeInForce' | 'createdAt' | 'filledAt' | 'cancelledAt' | 'failedAt' | 'AND' | 'OR' | 'NOT' | 'stockPortfolio'
      ordering: 'id' | 'stockPortfolioId' | 'ticker' | 'quantity' | 'filledQuantity' | 'type' | 'side' | 'status' | 'limitPrice' | 'stopPrice' | 'avgFilledPrice' | 'timeInForce' | 'createdAt' | 'filledAt' | 'cancelledAt' | 'failedAt'
    }
    Position: {
      filtering: 'id' | 'stockPortfolioId' | 'ticker' | 'quantity' | 'avgEntryPrice' | 'costBasis' | 'AND' | 'OR' | 'NOT' | 'stockPortfolio'
      ordering: 'id' | 'stockPortfolioId' | 'ticker' | 'quantity' | 'avgEntryPrice' | 'costBasis'
    }
    Webhook: {
      filtering: 'id' | 'stockPortfolioId' | 'query' | 'secret' | 'type' | 'url' | 'timeout' | 'createdAt' | 'AND' | 'OR' | 'NOT' | 'stockPortfolio'
      ordering: 'id' | 'stockPortfolioId' | 'query' | 'secret' | 'type' | 'url' | 'timeout' | 'createdAt'
    }
    StockPortfolioEvent: {
      filtering: 'scheduledEventId' | 'type' | 'stockPortfolioId' | 'AND' | 'OR' | 'NOT' | 'scheduledEvent' | 'stockPortfolio'
      ordering: 'scheduledEventId' | 'type' | 'stockPortfolioId'
    }
  }
  Position: {

  }
  Order: {

  }
  StockPortfolioSettings: {

  }
  Balance: {

  }
  Transaction: {

  }
  StripeDetails: {

  }
  Webhook: {

  }
  Snapshot: {
    LatestSnapshot: {
      filtering: 'snapshotId' | 'stockPortfolioId' | 'updatedAt' | 'AND' | 'OR' | 'NOT' | 'snapshot' | 'stockPortfolio'
      ordering: 'snapshotId' | 'stockPortfolioId' | 'updatedAt'
    }
  }
  LatestSnapshot: {

  }
  ScheduledEvent: {
    StockPortfolioEvent: {
      filtering: 'scheduledEventId' | 'type' | 'stockPortfolioId' | 'AND' | 'OR' | 'NOT' | 'scheduledEvent' | 'stockPortfolio'
      ordering: 'scheduledEventId' | 'type' | 'stockPortfolioId'
    }
    OrderEvent: {
      filtering: 'scheduledEventId' | 'type' | 'AND' | 'OR' | 'NOT' | 'scheduledEvent'
      ordering: 'scheduledEventId' | 'type'
    }
  }
  StockPortfolioEvent: {

  }
  OrderEvent: {

  }
}

// Prisma output types metadata
interface NexusPrismaOutputs {
  Query: {
    user: 'User'
    users: 'User'
    stockPortfolio: 'StockPortfolio'
    stockPortfolios: 'StockPortfolio'
    position: 'Position'
    positions: 'Position'
    order: 'Order'
    orders: 'Order'
    stockPortfolioSettings: 'StockPortfolioSettings'
    stockPortfolioSettings: 'StockPortfolioSettings'
    balance: 'Balance'
    balances: 'Balance'
    transaction: 'Transaction'
    transactions: 'Transaction'
    stripeDetails: 'StripeDetails'
    stripeDetails: 'StripeDetails'
    webhook: 'Webhook'
    webhooks: 'Webhook'
    snapshot: 'Snapshot'
    snapshots: 'Snapshot'
    latestSnapshot: 'LatestSnapshot'
    latestSnapshots: 'LatestSnapshot'
    scheduledEvent: 'ScheduledEvent'
    scheduledEvents: 'ScheduledEvent'
    stockPortfolioEvent: 'StockPortfolioEvent'
    stockPortfolioEvents: 'StockPortfolioEvent'
    orderEvent: 'OrderEvent'
    orderEvents: 'OrderEvent'
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
    createOnePosition: 'Position'
    updateOnePosition: 'Position'
    updateManyPosition: 'BatchPayload'
    deleteOnePosition: 'Position'
    deleteManyPosition: 'BatchPayload'
    upsertOnePosition: 'Position'
    createOneOrder: 'Order'
    updateOneOrder: 'Order'
    updateManyOrder: 'BatchPayload'
    deleteOneOrder: 'Order'
    deleteManyOrder: 'BatchPayload'
    upsertOneOrder: 'Order'
    createOneStockPortfolioSettings: 'StockPortfolioSettings'
    updateOneStockPortfolioSettings: 'StockPortfolioSettings'
    updateManyStockPortfolioSettings: 'BatchPayload'
    deleteOneStockPortfolioSettings: 'StockPortfolioSettings'
    deleteManyStockPortfolioSettings: 'BatchPayload'
    upsertOneStockPortfolioSettings: 'StockPortfolioSettings'
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
    createOneStripeDetails: 'StripeDetails'
    updateOneStripeDetails: 'StripeDetails'
    updateManyStripeDetails: 'BatchPayload'
    deleteOneStripeDetails: 'StripeDetails'
    deleteManyStripeDetails: 'BatchPayload'
    upsertOneStripeDetails: 'StripeDetails'
    createOneWebhook: 'Webhook'
    updateOneWebhook: 'Webhook'
    updateManyWebhook: 'BatchPayload'
    deleteOneWebhook: 'Webhook'
    deleteManyWebhook: 'BatchPayload'
    upsertOneWebhook: 'Webhook'
    createOneSnapshot: 'Snapshot'
    updateOneSnapshot: 'Snapshot'
    updateManySnapshot: 'BatchPayload'
    deleteOneSnapshot: 'Snapshot'
    deleteManySnapshot: 'BatchPayload'
    upsertOneSnapshot: 'Snapshot'
    createOneLatestSnapshot: 'LatestSnapshot'
    updateOneLatestSnapshot: 'LatestSnapshot'
    updateManyLatestSnapshot: 'BatchPayload'
    deleteOneLatestSnapshot: 'LatestSnapshot'
    deleteManyLatestSnapshot: 'BatchPayload'
    upsertOneLatestSnapshot: 'LatestSnapshot'
    createOneScheduledEvent: 'ScheduledEvent'
    updateOneScheduledEvent: 'ScheduledEvent'
    updateManyScheduledEvent: 'BatchPayload'
    deleteOneScheduledEvent: 'ScheduledEvent'
    deleteManyScheduledEvent: 'BatchPayload'
    upsertOneScheduledEvent: 'ScheduledEvent'
    createOneStockPortfolioEvent: 'StockPortfolioEvent'
    updateOneStockPortfolioEvent: 'StockPortfolioEvent'
    updateManyStockPortfolioEvent: 'BatchPayload'
    deleteOneStockPortfolioEvent: 'StockPortfolioEvent'
    deleteManyStockPortfolioEvent: 'BatchPayload'
    upsertOneStockPortfolioEvent: 'StockPortfolioEvent'
    createOneOrderEvent: 'OrderEvent'
    updateOneOrderEvent: 'OrderEvent'
    updateManyOrderEvent: 'BatchPayload'
    deleteOneOrderEvent: 'OrderEvent'
    deleteManyOrderEvent: 'BatchPayload'
    upsertOneOrderEvent: 'OrderEvent'
  },
  User: {
    id: 'String'
    email: 'String'
    emailVerified: 'Boolean'
    password: 'String'
    username: 'String'
    timezone: 'String'
    balance: 'Balance'
    stripeDetails: 'StripeDetails'
    stockPortfolios: 'StockPortfolio'
    createdAt: 'DateTime'
    updatedAt: 'DateTime'
    Transaction: 'Transaction'
    ScheduledEvent: 'ScheduledEvent'
  }
  StockPortfolio: {
    id: 'String'
    user: 'User'
    userId: 'String'
    name: 'String'
    headers: 'Json'
    tickers: 'String'
    settings: 'StockPortfolioSettings'
    snapshots: 'Snapshot'
    orders: 'Order'
    latestSnapshot: 'LatestSnapshot'
    buyingPower: 'Float'
    createdAt: 'DateTime'
    updatedAt: 'DateTime'
    Position: 'Position'
    Webhook: 'Webhook'
    StockPortfolioEvent: 'StockPortfolioEvent'
  }
  Position: {
    id: 'String'
    stockPortfolio: 'StockPortfolio'
    stockPortfolioId: 'String'
    ticker: 'String'
    quantity: 'Int'
    avgEntryPrice: 'Float'
    costBasis: 'Float'
  }
  Order: {
    id: 'String'
    stockPortfolio: 'StockPortfolio'
    stockPortfolioId: 'String'
    ticker: 'String'
    quantity: 'Int'
    filledQuantity: 'Int'
    type: 'OrderType'
    side: 'OrderSide'
    status: 'OrderStatus'
    limitPrice: 'Float'
    stopPrice: 'Float'
    avgFilledPrice: 'Float'
    timeInForce: 'TimeInForce'
    createdAt: 'DateTime'
    filledAt: 'DateTime'
    cancelledAt: 'DateTime'
    failedAt: 'DateTime'
  }
  StockPortfolioSettings: {
    stockPortfolio: 'StockPortfolio'
    stockPortfolioId: 'String'
    enableSnapshots: 'Boolean'
  }
  Balance: {
    user: 'User'
    userId: 'String'
    credits: 'Int'
  }
  Transaction: {
    id: 'String'
    user: 'User'
    userId: 'String'
    creditsBefore: 'Int'
    creditsTransacted: 'Int'
    createdAt: 'DateTime'
    paymentIntentId: 'String'
    status: 'TransactionStatus'
  }
  StripeDetails: {
    user: 'User'
    userId: 'String'
    customerId: 'String'
  }
  Webhook: {
    id: 'String'
    stockPortfolio: 'StockPortfolio'
    stockPortfolioId: 'String'
    query: 'String'
    secret: 'String'
    type: 'WebhookType'
    url: 'String'
    timeout: 'Int'
    createdAt: 'DateTime'
  }
  Snapshot: {
    id: 'String'
    tickers: 'String'
    headers: 'Json'
    stockPortfolio: 'StockPortfolio'
    stockPortfolioId: 'String'
    data: 'Json'
    createdAt: 'DateTime'
    LatestSnapshot: 'LatestSnapshot'
  }
  LatestSnapshot: {
    snapshot: 'Snapshot'
    snapshotId: 'String'
    stockPortfolio: 'StockPortfolio'
    stockPortfolioId: 'String'
    updatedAt: 'DateTime'
  }
  ScheduledEvent: {
    id: 'String'
    user: 'User'
    userId: 'String'
    recurrence: 'Recurrence'
    days: 'Day'
    hour: 'Int'
    minute: 'Int'
    interval: 'Int'
    next: 'DateTime'
    StockPortfolioEvent: 'StockPortfolioEvent'
    OrderEvent: 'OrderEvent'
  }
  StockPortfolioEvent: {
    scheduledEvent: 'ScheduledEvent'
    scheduledEventId: 'String'
    type: 'StockPortfolioEventType'
    stockPortfolio: 'StockPortfolio'
    stockPortfolioId: 'String'
  }
  OrderEvent: {
    scheduledEvent: 'ScheduledEvent'
    scheduledEventId: 'String'
    type: 'OrderEventType'
  }
}

// Helper to gather all methods relative to a model
interface NexusPrismaMethods {
  User: Typegen.NexusPrismaFields<'User'>
  StockPortfolio: Typegen.NexusPrismaFields<'StockPortfolio'>
  Position: Typegen.NexusPrismaFields<'Position'>
  Order: Typegen.NexusPrismaFields<'Order'>
  StockPortfolioSettings: Typegen.NexusPrismaFields<'StockPortfolioSettings'>
  Balance: Typegen.NexusPrismaFields<'Balance'>
  Transaction: Typegen.NexusPrismaFields<'Transaction'>
  StripeDetails: Typegen.NexusPrismaFields<'StripeDetails'>
  Webhook: Typegen.NexusPrismaFields<'Webhook'>
  Snapshot: Typegen.NexusPrismaFields<'Snapshot'>
  LatestSnapshot: Typegen.NexusPrismaFields<'LatestSnapshot'>
  ScheduledEvent: Typegen.NexusPrismaFields<'ScheduledEvent'>
  StockPortfolioEvent: Typegen.NexusPrismaFields<'StockPortfolioEvent'>
  OrderEvent: Typegen.NexusPrismaFields<'OrderEvent'>
  Query: Typegen.NexusPrismaFields<'Query'>
  Mutation: Typegen.NexusPrismaFields<'Mutation'>
}

interface NexusPrismaGenTypes {
  inputs: NexusPrismaInputs
  outputs: NexusPrismaOutputs
  methods: NexusPrismaMethods
  models: PrismaModels
  pagination: Pagination
  scalars: CustomScalars
}

declare global {
  interface NexusPrismaGen extends NexusPrismaGenTypes {}

  type NexusPrisma<
    TypeName extends string,
    ModelOrCrud extends 'model' | 'crud'
  > = Typegen.GetNexusPrisma<TypeName, ModelOrCrud>;
}
  