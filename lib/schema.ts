import { pgTable, serial, text, integer, timestamp, boolean, pgEnum } from 'drizzle-orm/pg-core';

export const priorityEnum = pgEnum('priority', ['high', 'medium', 'low']);
export const itemTypeEnum = pgEnum('item_type', ['need', 'want']);
export const transactionTypeEnum = pgEnum('transaction_type', ['deposit', 'withdrawal', 'allocation', 'reversal', 'transfer']);

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password'),
  name: text('name').notNull(),
  balance: integer('balance').default(0).notNull(),
  profilePicture: text('profile_picture'),
  googleId: text('google_id').unique(),
  facebookId: text('facebook_id').unique(),
  walletName: text('wallet_name').default('WishPay Wallet').notNull(),
  isWalletHidden: boolean('is_wallet_hidden').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  verificationToken: text('verification_token'),
  verificationTokenExpiry: timestamp('verification_token_expiry'),
  resetToken: text('reset_token'),
  resetTokenExpiry: timestamp('reset_token_expiry'),
});

export const items = pgTable('items', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  name: text('name').notNull(),
  price: integer('price').notNull(),
  saved: integer('saved').default(0).notNull(),
  type: itemTypeEnum('type').notNull(),
  priority: priorityEnum('priority').default('medium').notNull(),
  dateAdded: timestamp('date_added').defaultNow().notNull(),
  isArchived: boolean('is_archived').default(false).notNull(),
  dateArchived: timestamp('date_archived'),
  bankId: integer('bank_id').references(() => bankAccounts.id),
});

export const bankAccounts = pgTable('bank_accounts', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  name: text('name').notNull(),
  color: text('color').default('blue').notNull(),
  balance: integer('balance').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  amount: integer('amount').notNull(),
  type: transactionTypeEnum('type').notNull(),
  description: text('description').notNull(),
  bankId: integer('bank_id').references(() => bankAccounts.id),
  itemId: integer('item_id').references(() => items.id),
  date: timestamp('date').defaultNow().notNull(),
});