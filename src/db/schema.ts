import {
  pgTable,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  numeric,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

// ---------- USERS ----------
export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey(),
    username: varchar("username", { length: 40 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    passwordHash: text("password_hash").notNull(),
    fullName: varchar("full_name", { length: 120 }).default("").notNull(),
    avatarUrl: text("avatar_url").default("").notNull(),
    bio: text("bio").default("").notNull(),
    location: varchar("location", { length: 120 }).default("").notNull(),
    phone: varchar("phone", { length: 40 }).default("").notNull(),
    role: varchar("role", { length: 20 }).default("user").notNull(), // user | admin
    verified: boolean("verified").default(false).notNull(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    phoneVerified: boolean("phone_verified").default(false).notNull(),
    isSuspended: boolean("is_suspended").default(false).notNull(),
    rating: numeric("rating", { precision: 3, scale: 2 }).default("0").notNull(),
    ratingCount: integer("rating_count").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("users_username_idx").on(t.username), uniqueIndex("users_email_idx").on(t.email)]
);

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  token: text("token").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [uniqueIndex("sessions_token_idx").on(t.token)]);

// ---------- CATEGORIES ----------
export const categories = pgTable(
  "categories",
  {
    id: text("id").primaryKey(),
    name: varchar("name", { length: 80 }).notNull(),
    slug: varchar("slug", { length: 80 }).notNull(),
    icon: varchar("icon", { length: 10 }).default("🛍️").notNull(),
  },
  (t) => [uniqueIndex("categories_slug_idx").on(t.slug)]
);

// ---------- PRODUCTS ----------
export const products = pgTable(
  "products",
  {
    id: text("id").primaryKey(),
    sellerId: text("seller_id").notNull(),
    categoryId: text("category_id").notNull(),
    title: varchar("title", { length: 160 }).notNull(),
    description: text("description").default("").notNull(),
    price: numeric("price", { precision: 14, scale: 2 }).notNull(),
    condition: varchar("condition", { length: 10 }).default("used").notNull(), // new | used
    location: varchar("location", { length: 120 }).default("").notNull(),
    quantity: integer("quantity").default(1).notNull(),
    deliveryOptions: text("delivery_options").default("").notNull(),
    status: varchar("status", { length: 20 }).default("active").notNull(), // active|sold|pending|removed
    featured: boolean("featured").default(false).notNull(),
    viewsCount: integer("views_count").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [index("products_seller_idx").on(t.sellerId), index("products_category_idx").on(t.categoryId)]
);

export const productImages = pgTable("product_images", {
  id: text("id").primaryKey(),
  productId: text("product_id").notNull(),
  url: text("url").notNull(),
  position: integer("position").default(0).notNull(),
});

export const favorites = pgTable(
  "favorites",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    productId: text("product_id").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("favorites_user_product_idx").on(t.userId, t.productId)]
);

export const cartItems = pgTable(
  "cart_items",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    productId: text("product_id").notNull(),
    quantity: integer("quantity").default(1).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("cart_user_product_idx").on(t.userId, t.productId)]
);

// ---------- ORDERS ----------
export const orders = pgTable("orders", {
  id: text("id").primaryKey(),
  buyerId: text("buyer_id").notNull(),
  status: varchar("status", { length: 30 }).default("pending_payment").notNull(),
  subtotal: numeric("subtotal", { precision: 14, scale: 2 }).notNull(),
  deliveryFee: numeric("delivery_fee", { precision: 14, scale: 2 }).default("0").notNull(),
  total: numeric("total", { precision: 14, scale: 2 }).notNull(),
  customerName: varchar("customer_name", { length: 120 }).notNull(),
  phone: varchar("phone", { length: 40 }).notNull(),
  address: text("address").notNull(),
  city: varchar("city", { length: 80 }).notNull(),
  state: varchar("state", { length: 80 }).notNull(),
  paymentMethod: varchar("payment_method", { length: 30 }).notNull(),
  paymentReference: varchar("payment_reference", { length: 120 }).default("").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: text("id").primaryKey(),
  orderId: text("order_id").notNull(),
  productId: text("product_id").notNull(),
  sellerId: text("seller_id").notNull(),
  title: varchar("title", { length: 160 }).notNull(),
  price: numeric("price", { precision: 14, scale: 2 }).notNull(),
  quantity: integer("quantity").default(1).notNull(),
  imageUrl: text("image_url").default("").notNull(),
});

export const payments = pgTable("payments", {
  id: text("id").primaryKey(),
  orderId: text("order_id").notNull(),
  provider: varchar("provider", { length: 30 }).notNull(), // paystack|flutterwave|opay|bank_transfer|card
  reference: varchar("reference", { length: 150 }).notNull(),
  amount: numeric("amount", { precision: 14, scale: 2 }).notNull(),
  status: varchar("status", { length: 20 }).default("pending").notNull(), // pending|success|failed
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ---------- SOCIAL ----------
export const follows = pgTable(
  "follows",
  {
    id: text("id").primaryKey(),
    followerId: text("follower_id").notNull(),
    followingId: text("following_id").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("follows_pair_idx").on(t.followerId, t.followingId)]
);

export const posts = pgTable("posts", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  content: text("content").default("").notNull(),
  productId: text("product_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const postMedia = pgTable("post_media", {
  id: text("id").primaryKey(),
  postId: text("post_id").notNull(),
  url: text("url").notNull(),
  type: varchar("type", { length: 10 }).default("image").notNull(), // image|video
});

export const likes = pgTable(
  "likes",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    postId: text("post_id").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("likes_user_post_idx").on(t.userId, t.postId)]
);

export const comments = pgTable("comments", {
  id: text("id").primaryKey(),
  postId: text("post_id").notNull(),
  userId: text("user_id").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const shares = pgTable("shares", {
  id: text("id").primaryKey(),
  postId: text("post_id").notNull(),
  userId: text("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reviews = pgTable("reviews", {
  id: text("id").primaryKey(),
  sellerId: text("seller_id").notNull(),
  buyerId: text("buyer_id").notNull(),
  productId: text("product_id").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment").default("").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ---------- MESSAGING ----------
export const conversations = pgTable(
  "conversations",
  {
    id: text("id").primaryKey(),
    userAId: text("user_a_id").notNull(),
    userBId: text("user_b_id").notNull(),
    lastMessageAt: timestamp("last_message_at").defaultNow().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("conversations_pair_idx").on(t.userAId, t.userBId)]
);

export const messages = pgTable("messages", {
  id: text("id").primaryKey(),
  conversationId: text("conversation_id").notNull(),
  senderId: text("sender_id").notNull(),
  content: text("content").default("").notNull(),
  imageUrl: text("image_url").default("").notNull(),
  productId: text("product_id"),
  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const presence = pgTable("presence", {
  userId: text("user_id").primaryKey(),
  lastSeenAt: timestamp("last_seen_at").defaultNow().notNull(),
});

// ---------- NOTIFICATIONS ----------
export const notifications = pgTable("notifications", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  type: varchar("type", { length: 40 }).notNull(),
  content: text("content").notNull(),
  link: text("link").default("").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ---------- SAFETY ----------
export const reports = pgTable("reports", {
  id: text("id").primaryKey(),
  reporterId: text("reporter_id").notNull(),
  targetType: varchar("target_type", { length: 20 }).notNull(), // user | product | post
  targetId: text("target_id").notNull(),
  reason: text("reason").notNull(),
  status: varchar("status", { length: 20 }).default("open").notNull(), // open|reviewed|dismissed
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const blocks = pgTable(
  "blocks",
  {
    id: text("id").primaryKey(),
    blockerId: text("blocker_id").notNull(),
    blockedId: text("blocked_id").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("blocks_pair_idx").on(t.blockerId, t.blockedId)]
);
