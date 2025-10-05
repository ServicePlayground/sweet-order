
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model PhoneVerification
 * 
 */
export type PhoneVerification = $Result.DefaultSelection<Prisma.$PhoneVerificationPayload>
/**
 * Model Product
 * 
 */
export type Product = $Result.DefaultSelection<Prisma.$ProductPayload>
/**
 * Model ProductImage
 * 
 */
export type ProductImage = $Result.DefaultSelection<Prisma.$ProductImagePayload>
/**
 * Model ProductLike
 * 
 */
export type ProductLike = $Result.DefaultSelection<Prisma.$ProductLikePayload>

/**
 * Enums
 */
export namespace $Enums {
  export const MainCategory: {
  PRODUCT: 'PRODUCT'
};

export type MainCategory = (typeof MainCategory)[keyof typeof MainCategory]


export const SubCategory: {
  CAKE: 'CAKE'
};

export type SubCategory = (typeof SubCategory)[keyof typeof SubCategory]


export const TargetAudience: {
  ADULT: 'ADULT',
  CHILD: 'CHILD',
  PET: 'PET'
};

export type TargetAudience = (typeof TargetAudience)[keyof typeof TargetAudience]


export const SizeRange: {
  ONE_TO_TWO: 'ONE_TO_TWO',
  TWO_TO_THREE: 'TWO_TO_THREE',
  THREE_TO_FOUR: 'THREE_TO_FOUR',
  FOUR_TO_FIVE: 'FOUR_TO_FIVE',
  FIVE_OR_MORE: 'FIVE_OR_MORE'
};

export type SizeRange = (typeof SizeRange)[keyof typeof SizeRange]


export const DeliveryMethod: {
  PICKUP: 'PICKUP',
  DELIVERY: 'DELIVERY'
};

export type DeliveryMethod = (typeof DeliveryMethod)[keyof typeof DeliveryMethod]


export const DeliveryDays: {
  SAME_DAY: 'SAME_DAY',
  ONE_TO_TWO: 'ONE_TO_TWO',
  TWO_TO_THREE: 'TWO_TO_THREE',
  THREE_TO_FOUR: 'THREE_TO_FOUR',
  FOUR_TO_FIVE: 'FOUR_TO_FIVE',
  FIVE_TO_SIX: 'FIVE_TO_SIX',
  SIX_TO_SEVEN: 'SIX_TO_SEVEN',
  OVER_WEEK: 'OVER_WEEK'
};

export type DeliveryDays = (typeof DeliveryDays)[keyof typeof DeliveryDays]


export const ProductStatus: {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  OUT_OF_STOCK: 'OUT_OF_STOCK'
};

export type ProductStatus = (typeof ProductStatus)[keyof typeof ProductStatus]

}

export type MainCategory = $Enums.MainCategory

export const MainCategory: typeof $Enums.MainCategory

export type SubCategory = $Enums.SubCategory

export const SubCategory: typeof $Enums.SubCategory

export type TargetAudience = $Enums.TargetAudience

export const TargetAudience: typeof $Enums.TargetAudience

export type SizeRange = $Enums.SizeRange

export const SizeRange: typeof $Enums.SizeRange

export type DeliveryMethod = $Enums.DeliveryMethod

export const DeliveryMethod: typeof $Enums.DeliveryMethod

export type DeliveryDays = $Enums.DeliveryDays

export const DeliveryDays: typeof $Enums.DeliveryDays

export type ProductStatus = $Enums.ProductStatus

export const ProductStatus: typeof $Enums.ProductStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.phoneVerification`: Exposes CRUD operations for the **PhoneVerification** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PhoneVerifications
    * const phoneVerifications = await prisma.phoneVerification.findMany()
    * ```
    */
  get phoneVerification(): Prisma.PhoneVerificationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.product`: Exposes CRUD operations for the **Product** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Products
    * const products = await prisma.product.findMany()
    * ```
    */
  get product(): Prisma.ProductDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.productImage`: Exposes CRUD operations for the **ProductImage** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProductImages
    * const productImages = await prisma.productImage.findMany()
    * ```
    */
  get productImage(): Prisma.ProductImageDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.productLike`: Exposes CRUD operations for the **ProductLike** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProductLikes
    * const productLikes = await prisma.productLike.findMany()
    * ```
    */
  get productLike(): Prisma.ProductLikeDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.16.3
   * Query Engine version: bb420e667c1820a8c05a38023385f6cc7ef8e83a
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    PhoneVerification: 'PhoneVerification',
    Product: 'Product',
    ProductImage: 'ProductImage',
    ProductLike: 'ProductLike'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "phoneVerification" | "product" | "productImage" | "productLike"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      PhoneVerification: {
        payload: Prisma.$PhoneVerificationPayload<ExtArgs>
        fields: Prisma.PhoneVerificationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PhoneVerificationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhoneVerificationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PhoneVerificationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhoneVerificationPayload>
          }
          findFirst: {
            args: Prisma.PhoneVerificationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhoneVerificationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PhoneVerificationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhoneVerificationPayload>
          }
          findMany: {
            args: Prisma.PhoneVerificationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhoneVerificationPayload>[]
          }
          create: {
            args: Prisma.PhoneVerificationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhoneVerificationPayload>
          }
          createMany: {
            args: Prisma.PhoneVerificationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PhoneVerificationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhoneVerificationPayload>[]
          }
          delete: {
            args: Prisma.PhoneVerificationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhoneVerificationPayload>
          }
          update: {
            args: Prisma.PhoneVerificationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhoneVerificationPayload>
          }
          deleteMany: {
            args: Prisma.PhoneVerificationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PhoneVerificationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PhoneVerificationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhoneVerificationPayload>[]
          }
          upsert: {
            args: Prisma.PhoneVerificationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhoneVerificationPayload>
          }
          aggregate: {
            args: Prisma.PhoneVerificationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePhoneVerification>
          }
          groupBy: {
            args: Prisma.PhoneVerificationGroupByArgs<ExtArgs>
            result: $Utils.Optional<PhoneVerificationGroupByOutputType>[]
          }
          count: {
            args: Prisma.PhoneVerificationCountArgs<ExtArgs>
            result: $Utils.Optional<PhoneVerificationCountAggregateOutputType> | number
          }
        }
      }
      Product: {
        payload: Prisma.$ProductPayload<ExtArgs>
        fields: Prisma.ProductFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProductFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProductFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          findFirst: {
            args: Prisma.ProductFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProductFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          findMany: {
            args: Prisma.ProductFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>[]
          }
          create: {
            args: Prisma.ProductCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          createMany: {
            args: Prisma.ProductCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProductCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>[]
          }
          delete: {
            args: Prisma.ProductDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          update: {
            args: Prisma.ProductUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          deleteMany: {
            args: Prisma.ProductDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProductUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProductUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>[]
          }
          upsert: {
            args: Prisma.ProductUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          aggregate: {
            args: Prisma.ProductAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProduct>
          }
          groupBy: {
            args: Prisma.ProductGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProductGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProductCountArgs<ExtArgs>
            result: $Utils.Optional<ProductCountAggregateOutputType> | number
          }
        }
      }
      ProductImage: {
        payload: Prisma.$ProductImagePayload<ExtArgs>
        fields: Prisma.ProductImageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProductImageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductImagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProductImageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductImagePayload>
          }
          findFirst: {
            args: Prisma.ProductImageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductImagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProductImageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductImagePayload>
          }
          findMany: {
            args: Prisma.ProductImageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductImagePayload>[]
          }
          create: {
            args: Prisma.ProductImageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductImagePayload>
          }
          createMany: {
            args: Prisma.ProductImageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProductImageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductImagePayload>[]
          }
          delete: {
            args: Prisma.ProductImageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductImagePayload>
          }
          update: {
            args: Prisma.ProductImageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductImagePayload>
          }
          deleteMany: {
            args: Prisma.ProductImageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProductImageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProductImageUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductImagePayload>[]
          }
          upsert: {
            args: Prisma.ProductImageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductImagePayload>
          }
          aggregate: {
            args: Prisma.ProductImageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProductImage>
          }
          groupBy: {
            args: Prisma.ProductImageGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProductImageGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProductImageCountArgs<ExtArgs>
            result: $Utils.Optional<ProductImageCountAggregateOutputType> | number
          }
        }
      }
      ProductLike: {
        payload: Prisma.$ProductLikePayload<ExtArgs>
        fields: Prisma.ProductLikeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProductLikeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductLikePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProductLikeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductLikePayload>
          }
          findFirst: {
            args: Prisma.ProductLikeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductLikePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProductLikeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductLikePayload>
          }
          findMany: {
            args: Prisma.ProductLikeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductLikePayload>[]
          }
          create: {
            args: Prisma.ProductLikeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductLikePayload>
          }
          createMany: {
            args: Prisma.ProductLikeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProductLikeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductLikePayload>[]
          }
          delete: {
            args: Prisma.ProductLikeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductLikePayload>
          }
          update: {
            args: Prisma.ProductLikeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductLikePayload>
          }
          deleteMany: {
            args: Prisma.ProductLikeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProductLikeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProductLikeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductLikePayload>[]
          }
          upsert: {
            args: Prisma.ProductLikeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductLikePayload>
          }
          aggregate: {
            args: Prisma.ProductLikeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProductLike>
          }
          groupBy: {
            args: Prisma.ProductLikeGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProductLikeGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProductLikeCountArgs<ExtArgs>
            result: $Utils.Optional<ProductLikeCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    phoneVerification?: PhoneVerificationOmit
    product?: ProductOmit
    productImage?: ProductImageOmit
    productLike?: ProductLikeOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    productLikes: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    productLikes?: boolean | UserCountOutputTypeCountProductLikesArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountProductLikesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductLikeWhereInput
  }


  /**
   * Count Type ProductCountOutputType
   */

  export type ProductCountOutputType = {
    images: number
    likes: number
  }

  export type ProductCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    images?: boolean | ProductCountOutputTypeCountImagesArgs
    likes?: boolean | ProductCountOutputTypeCountLikesArgs
  }

  // Custom InputTypes
  /**
   * ProductCountOutputType without action
   */
  export type ProductCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductCountOutputType
     */
    select?: ProductCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProductCountOutputType without action
   */
  export type ProductCountOutputTypeCountImagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductImageWhereInput
  }

  /**
   * ProductCountOutputType without action
   */
  export type ProductCountOutputTypeCountLikesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductLikeWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    phone: string | null
    passwordHash: string | null
    name: string | null
    nickname: string | null
    email: string | null
    profileImageUrl: string | null
    isPhoneVerified: boolean | null
    isActive: boolean | null
    userId: string | null
    googleId: string | null
    googleEmail: string | null
    createdAt: Date | null
    lastLoginAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    phone: string | null
    passwordHash: string | null
    name: string | null
    nickname: string | null
    email: string | null
    profileImageUrl: string | null
    isPhoneVerified: boolean | null
    isActive: boolean | null
    userId: string | null
    googleId: string | null
    googleEmail: string | null
    createdAt: Date | null
    lastLoginAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    phone: number
    passwordHash: number
    name: number
    nickname: number
    email: number
    profileImageUrl: number
    isPhoneVerified: number
    isActive: number
    userId: number
    googleId: number
    googleEmail: number
    createdAt: number
    lastLoginAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    phone?: true
    passwordHash?: true
    name?: true
    nickname?: true
    email?: true
    profileImageUrl?: true
    isPhoneVerified?: true
    isActive?: true
    userId?: true
    googleId?: true
    googleEmail?: true
    createdAt?: true
    lastLoginAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    phone?: true
    passwordHash?: true
    name?: true
    nickname?: true
    email?: true
    profileImageUrl?: true
    isPhoneVerified?: true
    isActive?: true
    userId?: true
    googleId?: true
    googleEmail?: true
    createdAt?: true
    lastLoginAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    phone?: true
    passwordHash?: true
    name?: true
    nickname?: true
    email?: true
    profileImageUrl?: true
    isPhoneVerified?: true
    isActive?: true
    userId?: true
    googleId?: true
    googleEmail?: true
    createdAt?: true
    lastLoginAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    phone: string
    passwordHash: string | null
    name: string | null
    nickname: string | null
    email: string | null
    profileImageUrl: string | null
    isPhoneVerified: boolean
    isActive: boolean
    userId: string | null
    googleId: string | null
    googleEmail: string | null
    createdAt: Date
    lastLoginAt: Date | null
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    phone?: boolean
    passwordHash?: boolean
    name?: boolean
    nickname?: boolean
    email?: boolean
    profileImageUrl?: boolean
    isPhoneVerified?: boolean
    isActive?: boolean
    userId?: boolean
    googleId?: boolean
    googleEmail?: boolean
    createdAt?: boolean
    lastLoginAt?: boolean
    productLikes?: boolean | User$productLikesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    phone?: boolean
    passwordHash?: boolean
    name?: boolean
    nickname?: boolean
    email?: boolean
    profileImageUrl?: boolean
    isPhoneVerified?: boolean
    isActive?: boolean
    userId?: boolean
    googleId?: boolean
    googleEmail?: boolean
    createdAt?: boolean
    lastLoginAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    phone?: boolean
    passwordHash?: boolean
    name?: boolean
    nickname?: boolean
    email?: boolean
    profileImageUrl?: boolean
    isPhoneVerified?: boolean
    isActive?: boolean
    userId?: boolean
    googleId?: boolean
    googleEmail?: boolean
    createdAt?: boolean
    lastLoginAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    phone?: boolean
    passwordHash?: boolean
    name?: boolean
    nickname?: boolean
    email?: boolean
    profileImageUrl?: boolean
    isPhoneVerified?: boolean
    isActive?: boolean
    userId?: boolean
    googleId?: boolean
    googleEmail?: boolean
    createdAt?: boolean
    lastLoginAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "phone" | "passwordHash" | "name" | "nickname" | "email" | "profileImageUrl" | "isPhoneVerified" | "isActive" | "userId" | "googleId" | "googleEmail" | "createdAt" | "lastLoginAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    productLikes?: boolean | User$productLikesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      productLikes: Prisma.$ProductLikePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      phone: string
      passwordHash: string | null
      name: string | null
      nickname: string | null
      email: string | null
      profileImageUrl: string | null
      isPhoneVerified: boolean
      isActive: boolean
      userId: string | null
      googleId: string | null
      googleEmail: string | null
      createdAt: Date
      lastLoginAt: Date | null
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    productLikes<T extends User$productLikesArgs<ExtArgs> = {}>(args?: Subset<T, User$productLikesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductLikePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly phone: FieldRef<"User", 'String'>
    readonly passwordHash: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly nickname: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly profileImageUrl: FieldRef<"User", 'String'>
    readonly isPhoneVerified: FieldRef<"User", 'Boolean'>
    readonly isActive: FieldRef<"User", 'Boolean'>
    readonly userId: FieldRef<"User", 'String'>
    readonly googleId: FieldRef<"User", 'String'>
    readonly googleEmail: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly lastLoginAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.productLikes
   */
  export type User$productLikesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductLike
     */
    select?: ProductLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductLike
     */
    omit?: ProductLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductLikeInclude<ExtArgs> | null
    where?: ProductLikeWhereInput
    orderBy?: ProductLikeOrderByWithRelationInput | ProductLikeOrderByWithRelationInput[]
    cursor?: ProductLikeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProductLikeScalarFieldEnum | ProductLikeScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model PhoneVerification
   */

  export type AggregatePhoneVerification = {
    _count: PhoneVerificationCountAggregateOutputType | null
    _min: PhoneVerificationMinAggregateOutputType | null
    _max: PhoneVerificationMaxAggregateOutputType | null
  }

  export type PhoneVerificationMinAggregateOutputType = {
    id: string | null
    phone: string | null
    verificationCode: string | null
    expiresAt: Date | null
    isVerified: boolean | null
    purpose: string | null
    userId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PhoneVerificationMaxAggregateOutputType = {
    id: string | null
    phone: string | null
    verificationCode: string | null
    expiresAt: Date | null
    isVerified: boolean | null
    purpose: string | null
    userId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PhoneVerificationCountAggregateOutputType = {
    id: number
    phone: number
    verificationCode: number
    expiresAt: number
    isVerified: number
    purpose: number
    userId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PhoneVerificationMinAggregateInputType = {
    id?: true
    phone?: true
    verificationCode?: true
    expiresAt?: true
    isVerified?: true
    purpose?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PhoneVerificationMaxAggregateInputType = {
    id?: true
    phone?: true
    verificationCode?: true
    expiresAt?: true
    isVerified?: true
    purpose?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PhoneVerificationCountAggregateInputType = {
    id?: true
    phone?: true
    verificationCode?: true
    expiresAt?: true
    isVerified?: true
    purpose?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PhoneVerificationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PhoneVerification to aggregate.
     */
    where?: PhoneVerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PhoneVerifications to fetch.
     */
    orderBy?: PhoneVerificationOrderByWithRelationInput | PhoneVerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PhoneVerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PhoneVerifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PhoneVerifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PhoneVerifications
    **/
    _count?: true | PhoneVerificationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PhoneVerificationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PhoneVerificationMaxAggregateInputType
  }

  export type GetPhoneVerificationAggregateType<T extends PhoneVerificationAggregateArgs> = {
        [P in keyof T & keyof AggregatePhoneVerification]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePhoneVerification[P]>
      : GetScalarType<T[P], AggregatePhoneVerification[P]>
  }




  export type PhoneVerificationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PhoneVerificationWhereInput
    orderBy?: PhoneVerificationOrderByWithAggregationInput | PhoneVerificationOrderByWithAggregationInput[]
    by: PhoneVerificationScalarFieldEnum[] | PhoneVerificationScalarFieldEnum
    having?: PhoneVerificationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PhoneVerificationCountAggregateInputType | true
    _min?: PhoneVerificationMinAggregateInputType
    _max?: PhoneVerificationMaxAggregateInputType
  }

  export type PhoneVerificationGroupByOutputType = {
    id: string
    phone: string
    verificationCode: string
    expiresAt: Date
    isVerified: boolean
    purpose: string
    userId: string | null
    createdAt: Date
    updatedAt: Date
    _count: PhoneVerificationCountAggregateOutputType | null
    _min: PhoneVerificationMinAggregateOutputType | null
    _max: PhoneVerificationMaxAggregateOutputType | null
  }

  type GetPhoneVerificationGroupByPayload<T extends PhoneVerificationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PhoneVerificationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PhoneVerificationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PhoneVerificationGroupByOutputType[P]>
            : GetScalarType<T[P], PhoneVerificationGroupByOutputType[P]>
        }
      >
    >


  export type PhoneVerificationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    phone?: boolean
    verificationCode?: boolean
    expiresAt?: boolean
    isVerified?: boolean
    purpose?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["phoneVerification"]>

  export type PhoneVerificationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    phone?: boolean
    verificationCode?: boolean
    expiresAt?: boolean
    isVerified?: boolean
    purpose?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["phoneVerification"]>

  export type PhoneVerificationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    phone?: boolean
    verificationCode?: boolean
    expiresAt?: boolean
    isVerified?: boolean
    purpose?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["phoneVerification"]>

  export type PhoneVerificationSelectScalar = {
    id?: boolean
    phone?: boolean
    verificationCode?: boolean
    expiresAt?: boolean
    isVerified?: boolean
    purpose?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PhoneVerificationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "phone" | "verificationCode" | "expiresAt" | "isVerified" | "purpose" | "userId" | "createdAt" | "updatedAt", ExtArgs["result"]["phoneVerification"]>

  export type $PhoneVerificationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PhoneVerification"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      phone: string
      verificationCode: string
      expiresAt: Date
      isVerified: boolean
      purpose: string
      userId: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["phoneVerification"]>
    composites: {}
  }

  type PhoneVerificationGetPayload<S extends boolean | null | undefined | PhoneVerificationDefaultArgs> = $Result.GetResult<Prisma.$PhoneVerificationPayload, S>

  type PhoneVerificationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PhoneVerificationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PhoneVerificationCountAggregateInputType | true
    }

  export interface PhoneVerificationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PhoneVerification'], meta: { name: 'PhoneVerification' } }
    /**
     * Find zero or one PhoneVerification that matches the filter.
     * @param {PhoneVerificationFindUniqueArgs} args - Arguments to find a PhoneVerification
     * @example
     * // Get one PhoneVerification
     * const phoneVerification = await prisma.phoneVerification.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PhoneVerificationFindUniqueArgs>(args: SelectSubset<T, PhoneVerificationFindUniqueArgs<ExtArgs>>): Prisma__PhoneVerificationClient<$Result.GetResult<Prisma.$PhoneVerificationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PhoneVerification that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PhoneVerificationFindUniqueOrThrowArgs} args - Arguments to find a PhoneVerification
     * @example
     * // Get one PhoneVerification
     * const phoneVerification = await prisma.phoneVerification.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PhoneVerificationFindUniqueOrThrowArgs>(args: SelectSubset<T, PhoneVerificationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PhoneVerificationClient<$Result.GetResult<Prisma.$PhoneVerificationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PhoneVerification that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhoneVerificationFindFirstArgs} args - Arguments to find a PhoneVerification
     * @example
     * // Get one PhoneVerification
     * const phoneVerification = await prisma.phoneVerification.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PhoneVerificationFindFirstArgs>(args?: SelectSubset<T, PhoneVerificationFindFirstArgs<ExtArgs>>): Prisma__PhoneVerificationClient<$Result.GetResult<Prisma.$PhoneVerificationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PhoneVerification that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhoneVerificationFindFirstOrThrowArgs} args - Arguments to find a PhoneVerification
     * @example
     * // Get one PhoneVerification
     * const phoneVerification = await prisma.phoneVerification.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PhoneVerificationFindFirstOrThrowArgs>(args?: SelectSubset<T, PhoneVerificationFindFirstOrThrowArgs<ExtArgs>>): Prisma__PhoneVerificationClient<$Result.GetResult<Prisma.$PhoneVerificationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PhoneVerifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhoneVerificationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PhoneVerifications
     * const phoneVerifications = await prisma.phoneVerification.findMany()
     * 
     * // Get first 10 PhoneVerifications
     * const phoneVerifications = await prisma.phoneVerification.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const phoneVerificationWithIdOnly = await prisma.phoneVerification.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PhoneVerificationFindManyArgs>(args?: SelectSubset<T, PhoneVerificationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PhoneVerificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PhoneVerification.
     * @param {PhoneVerificationCreateArgs} args - Arguments to create a PhoneVerification.
     * @example
     * // Create one PhoneVerification
     * const PhoneVerification = await prisma.phoneVerification.create({
     *   data: {
     *     // ... data to create a PhoneVerification
     *   }
     * })
     * 
     */
    create<T extends PhoneVerificationCreateArgs>(args: SelectSubset<T, PhoneVerificationCreateArgs<ExtArgs>>): Prisma__PhoneVerificationClient<$Result.GetResult<Prisma.$PhoneVerificationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PhoneVerifications.
     * @param {PhoneVerificationCreateManyArgs} args - Arguments to create many PhoneVerifications.
     * @example
     * // Create many PhoneVerifications
     * const phoneVerification = await prisma.phoneVerification.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PhoneVerificationCreateManyArgs>(args?: SelectSubset<T, PhoneVerificationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PhoneVerifications and returns the data saved in the database.
     * @param {PhoneVerificationCreateManyAndReturnArgs} args - Arguments to create many PhoneVerifications.
     * @example
     * // Create many PhoneVerifications
     * const phoneVerification = await prisma.phoneVerification.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PhoneVerifications and only return the `id`
     * const phoneVerificationWithIdOnly = await prisma.phoneVerification.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PhoneVerificationCreateManyAndReturnArgs>(args?: SelectSubset<T, PhoneVerificationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PhoneVerificationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PhoneVerification.
     * @param {PhoneVerificationDeleteArgs} args - Arguments to delete one PhoneVerification.
     * @example
     * // Delete one PhoneVerification
     * const PhoneVerification = await prisma.phoneVerification.delete({
     *   where: {
     *     // ... filter to delete one PhoneVerification
     *   }
     * })
     * 
     */
    delete<T extends PhoneVerificationDeleteArgs>(args: SelectSubset<T, PhoneVerificationDeleteArgs<ExtArgs>>): Prisma__PhoneVerificationClient<$Result.GetResult<Prisma.$PhoneVerificationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PhoneVerification.
     * @param {PhoneVerificationUpdateArgs} args - Arguments to update one PhoneVerification.
     * @example
     * // Update one PhoneVerification
     * const phoneVerification = await prisma.phoneVerification.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PhoneVerificationUpdateArgs>(args: SelectSubset<T, PhoneVerificationUpdateArgs<ExtArgs>>): Prisma__PhoneVerificationClient<$Result.GetResult<Prisma.$PhoneVerificationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PhoneVerifications.
     * @param {PhoneVerificationDeleteManyArgs} args - Arguments to filter PhoneVerifications to delete.
     * @example
     * // Delete a few PhoneVerifications
     * const { count } = await prisma.phoneVerification.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PhoneVerificationDeleteManyArgs>(args?: SelectSubset<T, PhoneVerificationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PhoneVerifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhoneVerificationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PhoneVerifications
     * const phoneVerification = await prisma.phoneVerification.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PhoneVerificationUpdateManyArgs>(args: SelectSubset<T, PhoneVerificationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PhoneVerifications and returns the data updated in the database.
     * @param {PhoneVerificationUpdateManyAndReturnArgs} args - Arguments to update many PhoneVerifications.
     * @example
     * // Update many PhoneVerifications
     * const phoneVerification = await prisma.phoneVerification.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PhoneVerifications and only return the `id`
     * const phoneVerificationWithIdOnly = await prisma.phoneVerification.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PhoneVerificationUpdateManyAndReturnArgs>(args: SelectSubset<T, PhoneVerificationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PhoneVerificationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PhoneVerification.
     * @param {PhoneVerificationUpsertArgs} args - Arguments to update or create a PhoneVerification.
     * @example
     * // Update or create a PhoneVerification
     * const phoneVerification = await prisma.phoneVerification.upsert({
     *   create: {
     *     // ... data to create a PhoneVerification
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PhoneVerification we want to update
     *   }
     * })
     */
    upsert<T extends PhoneVerificationUpsertArgs>(args: SelectSubset<T, PhoneVerificationUpsertArgs<ExtArgs>>): Prisma__PhoneVerificationClient<$Result.GetResult<Prisma.$PhoneVerificationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PhoneVerifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhoneVerificationCountArgs} args - Arguments to filter PhoneVerifications to count.
     * @example
     * // Count the number of PhoneVerifications
     * const count = await prisma.phoneVerification.count({
     *   where: {
     *     // ... the filter for the PhoneVerifications we want to count
     *   }
     * })
    **/
    count<T extends PhoneVerificationCountArgs>(
      args?: Subset<T, PhoneVerificationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PhoneVerificationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PhoneVerification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhoneVerificationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PhoneVerificationAggregateArgs>(args: Subset<T, PhoneVerificationAggregateArgs>): Prisma.PrismaPromise<GetPhoneVerificationAggregateType<T>>

    /**
     * Group by PhoneVerification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhoneVerificationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PhoneVerificationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PhoneVerificationGroupByArgs['orderBy'] }
        : { orderBy?: PhoneVerificationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PhoneVerificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPhoneVerificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PhoneVerification model
   */
  readonly fields: PhoneVerificationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PhoneVerification.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PhoneVerificationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PhoneVerification model
   */
  interface PhoneVerificationFieldRefs {
    readonly id: FieldRef<"PhoneVerification", 'String'>
    readonly phone: FieldRef<"PhoneVerification", 'String'>
    readonly verificationCode: FieldRef<"PhoneVerification", 'String'>
    readonly expiresAt: FieldRef<"PhoneVerification", 'DateTime'>
    readonly isVerified: FieldRef<"PhoneVerification", 'Boolean'>
    readonly purpose: FieldRef<"PhoneVerification", 'String'>
    readonly userId: FieldRef<"PhoneVerification", 'String'>
    readonly createdAt: FieldRef<"PhoneVerification", 'DateTime'>
    readonly updatedAt: FieldRef<"PhoneVerification", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PhoneVerification findUnique
   */
  export type PhoneVerificationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PhoneVerification
     */
    select?: PhoneVerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PhoneVerification
     */
    omit?: PhoneVerificationOmit<ExtArgs> | null
    /**
     * Filter, which PhoneVerification to fetch.
     */
    where: PhoneVerificationWhereUniqueInput
  }

  /**
   * PhoneVerification findUniqueOrThrow
   */
  export type PhoneVerificationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PhoneVerification
     */
    select?: PhoneVerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PhoneVerification
     */
    omit?: PhoneVerificationOmit<ExtArgs> | null
    /**
     * Filter, which PhoneVerification to fetch.
     */
    where: PhoneVerificationWhereUniqueInput
  }

  /**
   * PhoneVerification findFirst
   */
  export type PhoneVerificationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PhoneVerification
     */
    select?: PhoneVerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PhoneVerification
     */
    omit?: PhoneVerificationOmit<ExtArgs> | null
    /**
     * Filter, which PhoneVerification to fetch.
     */
    where?: PhoneVerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PhoneVerifications to fetch.
     */
    orderBy?: PhoneVerificationOrderByWithRelationInput | PhoneVerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PhoneVerifications.
     */
    cursor?: PhoneVerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PhoneVerifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PhoneVerifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PhoneVerifications.
     */
    distinct?: PhoneVerificationScalarFieldEnum | PhoneVerificationScalarFieldEnum[]
  }

  /**
   * PhoneVerification findFirstOrThrow
   */
  export type PhoneVerificationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PhoneVerification
     */
    select?: PhoneVerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PhoneVerification
     */
    omit?: PhoneVerificationOmit<ExtArgs> | null
    /**
     * Filter, which PhoneVerification to fetch.
     */
    where?: PhoneVerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PhoneVerifications to fetch.
     */
    orderBy?: PhoneVerificationOrderByWithRelationInput | PhoneVerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PhoneVerifications.
     */
    cursor?: PhoneVerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PhoneVerifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PhoneVerifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PhoneVerifications.
     */
    distinct?: PhoneVerificationScalarFieldEnum | PhoneVerificationScalarFieldEnum[]
  }

  /**
   * PhoneVerification findMany
   */
  export type PhoneVerificationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PhoneVerification
     */
    select?: PhoneVerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PhoneVerification
     */
    omit?: PhoneVerificationOmit<ExtArgs> | null
    /**
     * Filter, which PhoneVerifications to fetch.
     */
    where?: PhoneVerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PhoneVerifications to fetch.
     */
    orderBy?: PhoneVerificationOrderByWithRelationInput | PhoneVerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PhoneVerifications.
     */
    cursor?: PhoneVerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PhoneVerifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PhoneVerifications.
     */
    skip?: number
    distinct?: PhoneVerificationScalarFieldEnum | PhoneVerificationScalarFieldEnum[]
  }

  /**
   * PhoneVerification create
   */
  export type PhoneVerificationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PhoneVerification
     */
    select?: PhoneVerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PhoneVerification
     */
    omit?: PhoneVerificationOmit<ExtArgs> | null
    /**
     * The data needed to create a PhoneVerification.
     */
    data: XOR<PhoneVerificationCreateInput, PhoneVerificationUncheckedCreateInput>
  }

  /**
   * PhoneVerification createMany
   */
  export type PhoneVerificationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PhoneVerifications.
     */
    data: PhoneVerificationCreateManyInput | PhoneVerificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PhoneVerification createManyAndReturn
   */
  export type PhoneVerificationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PhoneVerification
     */
    select?: PhoneVerificationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PhoneVerification
     */
    omit?: PhoneVerificationOmit<ExtArgs> | null
    /**
     * The data used to create many PhoneVerifications.
     */
    data: PhoneVerificationCreateManyInput | PhoneVerificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PhoneVerification update
   */
  export type PhoneVerificationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PhoneVerification
     */
    select?: PhoneVerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PhoneVerification
     */
    omit?: PhoneVerificationOmit<ExtArgs> | null
    /**
     * The data needed to update a PhoneVerification.
     */
    data: XOR<PhoneVerificationUpdateInput, PhoneVerificationUncheckedUpdateInput>
    /**
     * Choose, which PhoneVerification to update.
     */
    where: PhoneVerificationWhereUniqueInput
  }

  /**
   * PhoneVerification updateMany
   */
  export type PhoneVerificationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PhoneVerifications.
     */
    data: XOR<PhoneVerificationUpdateManyMutationInput, PhoneVerificationUncheckedUpdateManyInput>
    /**
     * Filter which PhoneVerifications to update
     */
    where?: PhoneVerificationWhereInput
    /**
     * Limit how many PhoneVerifications to update.
     */
    limit?: number
  }

  /**
   * PhoneVerification updateManyAndReturn
   */
  export type PhoneVerificationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PhoneVerification
     */
    select?: PhoneVerificationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PhoneVerification
     */
    omit?: PhoneVerificationOmit<ExtArgs> | null
    /**
     * The data used to update PhoneVerifications.
     */
    data: XOR<PhoneVerificationUpdateManyMutationInput, PhoneVerificationUncheckedUpdateManyInput>
    /**
     * Filter which PhoneVerifications to update
     */
    where?: PhoneVerificationWhereInput
    /**
     * Limit how many PhoneVerifications to update.
     */
    limit?: number
  }

  /**
   * PhoneVerification upsert
   */
  export type PhoneVerificationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PhoneVerification
     */
    select?: PhoneVerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PhoneVerification
     */
    omit?: PhoneVerificationOmit<ExtArgs> | null
    /**
     * The filter to search for the PhoneVerification to update in case it exists.
     */
    where: PhoneVerificationWhereUniqueInput
    /**
     * In case the PhoneVerification found by the `where` argument doesn't exist, create a new PhoneVerification with this data.
     */
    create: XOR<PhoneVerificationCreateInput, PhoneVerificationUncheckedCreateInput>
    /**
     * In case the PhoneVerification was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PhoneVerificationUpdateInput, PhoneVerificationUncheckedUpdateInput>
  }

  /**
   * PhoneVerification delete
   */
  export type PhoneVerificationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PhoneVerification
     */
    select?: PhoneVerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PhoneVerification
     */
    omit?: PhoneVerificationOmit<ExtArgs> | null
    /**
     * Filter which PhoneVerification to delete.
     */
    where: PhoneVerificationWhereUniqueInput
  }

  /**
   * PhoneVerification deleteMany
   */
  export type PhoneVerificationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PhoneVerifications to delete
     */
    where?: PhoneVerificationWhereInput
    /**
     * Limit how many PhoneVerifications to delete.
     */
    limit?: number
  }

  /**
   * PhoneVerification without action
   */
  export type PhoneVerificationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PhoneVerification
     */
    select?: PhoneVerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PhoneVerification
     */
    omit?: PhoneVerificationOmit<ExtArgs> | null
  }


  /**
   * Model Product
   */

  export type AggregateProduct = {
    _count: ProductCountAggregateOutputType | null
    _avg: ProductAvgAggregateOutputType | null
    _sum: ProductSumAggregateOutputType | null
    _min: ProductMinAggregateOutputType | null
    _max: ProductMaxAggregateOutputType | null
  }

  export type ProductAvgAggregateOutputType = {
    originalPrice: number | null
    salePrice: number | null
    likeCount: number | null
  }

  export type ProductSumAggregateOutputType = {
    originalPrice: number | null
    salePrice: number | null
    likeCount: number | null
  }

  export type ProductMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    originalPrice: number | null
    salePrice: number | null
    notice: string | null
    caution: string | null
    basicIncluded: string | null
    location: string | null
    likeCount: number | null
    createdAt: Date | null
    updatedAt: Date | null
    detailDescription: string | null
    productNumber: string | null
    foodType: string | null
    producer: string | null
    manufactureDate: string | null
    packageInfo: string | null
    calories: string | null
    ingredients: string | null
    origin: string | null
    customerService: string | null
    status: $Enums.ProductStatus | null
  }

  export type ProductMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    originalPrice: number | null
    salePrice: number | null
    notice: string | null
    caution: string | null
    basicIncluded: string | null
    location: string | null
    likeCount: number | null
    createdAt: Date | null
    updatedAt: Date | null
    detailDescription: string | null
    productNumber: string | null
    foodType: string | null
    producer: string | null
    manufactureDate: string | null
    packageInfo: string | null
    calories: string | null
    ingredients: string | null
    origin: string | null
    customerService: string | null
    status: $Enums.ProductStatus | null
  }

  export type ProductCountAggregateOutputType = {
    id: number
    name: number
    description: number
    originalPrice: number
    salePrice: number
    notice: number
    caution: number
    basicIncluded: number
    location: number
    likeCount: number
    createdAt: number
    updatedAt: number
    orderFormSchema: number
    detailDescription: number
    productNumber: number
    foodType: number
    producer: number
    manufactureDate: number
    packageInfo: number
    calories: number
    ingredients: number
    origin: number
    customerService: number
    mainCategory: number
    subCategory: number
    targetAudience: number
    sizeRange: number
    deliveryMethod: number
    deliveryDays: number
    hashtags: number
    status: number
    _all: number
  }


  export type ProductAvgAggregateInputType = {
    originalPrice?: true
    salePrice?: true
    likeCount?: true
  }

  export type ProductSumAggregateInputType = {
    originalPrice?: true
    salePrice?: true
    likeCount?: true
  }

  export type ProductMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    originalPrice?: true
    salePrice?: true
    notice?: true
    caution?: true
    basicIncluded?: true
    location?: true
    likeCount?: true
    createdAt?: true
    updatedAt?: true
    detailDescription?: true
    productNumber?: true
    foodType?: true
    producer?: true
    manufactureDate?: true
    packageInfo?: true
    calories?: true
    ingredients?: true
    origin?: true
    customerService?: true
    status?: true
  }

  export type ProductMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    originalPrice?: true
    salePrice?: true
    notice?: true
    caution?: true
    basicIncluded?: true
    location?: true
    likeCount?: true
    createdAt?: true
    updatedAt?: true
    detailDescription?: true
    productNumber?: true
    foodType?: true
    producer?: true
    manufactureDate?: true
    packageInfo?: true
    calories?: true
    ingredients?: true
    origin?: true
    customerService?: true
    status?: true
  }

  export type ProductCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    originalPrice?: true
    salePrice?: true
    notice?: true
    caution?: true
    basicIncluded?: true
    location?: true
    likeCount?: true
    createdAt?: true
    updatedAt?: true
    orderFormSchema?: true
    detailDescription?: true
    productNumber?: true
    foodType?: true
    producer?: true
    manufactureDate?: true
    packageInfo?: true
    calories?: true
    ingredients?: true
    origin?: true
    customerService?: true
    mainCategory?: true
    subCategory?: true
    targetAudience?: true
    sizeRange?: true
    deliveryMethod?: true
    deliveryDays?: true
    hashtags?: true
    status?: true
    _all?: true
  }

  export type ProductAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Product to aggregate.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Products
    **/
    _count?: true | ProductCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProductAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProductSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProductMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProductMaxAggregateInputType
  }

  export type GetProductAggregateType<T extends ProductAggregateArgs> = {
        [P in keyof T & keyof AggregateProduct]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProduct[P]>
      : GetScalarType<T[P], AggregateProduct[P]>
  }




  export type ProductGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductWhereInput
    orderBy?: ProductOrderByWithAggregationInput | ProductOrderByWithAggregationInput[]
    by: ProductScalarFieldEnum[] | ProductScalarFieldEnum
    having?: ProductScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProductCountAggregateInputType | true
    _avg?: ProductAvgAggregateInputType
    _sum?: ProductSumAggregateInputType
    _min?: ProductMinAggregateInputType
    _max?: ProductMaxAggregateInputType
  }

  export type ProductGroupByOutputType = {
    id: string
    name: string
    description: string | null
    originalPrice: number
    salePrice: number
    notice: string | null
    caution: string | null
    basicIncluded: string | null
    location: string | null
    likeCount: number
    createdAt: Date
    updatedAt: Date
    orderFormSchema: JsonValue | null
    detailDescription: string | null
    productNumber: string
    foodType: string
    producer: string
    manufactureDate: string
    packageInfo: string
    calories: string
    ingredients: string
    origin: string
    customerService: string
    mainCategory: $Enums.MainCategory[]
    subCategory: $Enums.SubCategory[]
    targetAudience: $Enums.TargetAudience[]
    sizeRange: $Enums.SizeRange[]
    deliveryMethod: $Enums.DeliveryMethod[]
    deliveryDays: $Enums.DeliveryDays[]
    hashtags: string[]
    status: $Enums.ProductStatus
    _count: ProductCountAggregateOutputType | null
    _avg: ProductAvgAggregateOutputType | null
    _sum: ProductSumAggregateOutputType | null
    _min: ProductMinAggregateOutputType | null
    _max: ProductMaxAggregateOutputType | null
  }

  type GetProductGroupByPayload<T extends ProductGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProductGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProductGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProductGroupByOutputType[P]>
            : GetScalarType<T[P], ProductGroupByOutputType[P]>
        }
      >
    >


  export type ProductSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    originalPrice?: boolean
    salePrice?: boolean
    notice?: boolean
    caution?: boolean
    basicIncluded?: boolean
    location?: boolean
    likeCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    orderFormSchema?: boolean
    detailDescription?: boolean
    productNumber?: boolean
    foodType?: boolean
    producer?: boolean
    manufactureDate?: boolean
    packageInfo?: boolean
    calories?: boolean
    ingredients?: boolean
    origin?: boolean
    customerService?: boolean
    mainCategory?: boolean
    subCategory?: boolean
    targetAudience?: boolean
    sizeRange?: boolean
    deliveryMethod?: boolean
    deliveryDays?: boolean
    hashtags?: boolean
    status?: boolean
    images?: boolean | Product$imagesArgs<ExtArgs>
    likes?: boolean | Product$likesArgs<ExtArgs>
    _count?: boolean | ProductCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["product"]>

  export type ProductSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    originalPrice?: boolean
    salePrice?: boolean
    notice?: boolean
    caution?: boolean
    basicIncluded?: boolean
    location?: boolean
    likeCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    orderFormSchema?: boolean
    detailDescription?: boolean
    productNumber?: boolean
    foodType?: boolean
    producer?: boolean
    manufactureDate?: boolean
    packageInfo?: boolean
    calories?: boolean
    ingredients?: boolean
    origin?: boolean
    customerService?: boolean
    mainCategory?: boolean
    subCategory?: boolean
    targetAudience?: boolean
    sizeRange?: boolean
    deliveryMethod?: boolean
    deliveryDays?: boolean
    hashtags?: boolean
    status?: boolean
  }, ExtArgs["result"]["product"]>

  export type ProductSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    originalPrice?: boolean
    salePrice?: boolean
    notice?: boolean
    caution?: boolean
    basicIncluded?: boolean
    location?: boolean
    likeCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    orderFormSchema?: boolean
    detailDescription?: boolean
    productNumber?: boolean
    foodType?: boolean
    producer?: boolean
    manufactureDate?: boolean
    packageInfo?: boolean
    calories?: boolean
    ingredients?: boolean
    origin?: boolean
    customerService?: boolean
    mainCategory?: boolean
    subCategory?: boolean
    targetAudience?: boolean
    sizeRange?: boolean
    deliveryMethod?: boolean
    deliveryDays?: boolean
    hashtags?: boolean
    status?: boolean
  }, ExtArgs["result"]["product"]>

  export type ProductSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    originalPrice?: boolean
    salePrice?: boolean
    notice?: boolean
    caution?: boolean
    basicIncluded?: boolean
    location?: boolean
    likeCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    orderFormSchema?: boolean
    detailDescription?: boolean
    productNumber?: boolean
    foodType?: boolean
    producer?: boolean
    manufactureDate?: boolean
    packageInfo?: boolean
    calories?: boolean
    ingredients?: boolean
    origin?: boolean
    customerService?: boolean
    mainCategory?: boolean
    subCategory?: boolean
    targetAudience?: boolean
    sizeRange?: boolean
    deliveryMethod?: boolean
    deliveryDays?: boolean
    hashtags?: boolean
    status?: boolean
  }

  export type ProductOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "originalPrice" | "salePrice" | "notice" | "caution" | "basicIncluded" | "location" | "likeCount" | "createdAt" | "updatedAt" | "orderFormSchema" | "detailDescription" | "productNumber" | "foodType" | "producer" | "manufactureDate" | "packageInfo" | "calories" | "ingredients" | "origin" | "customerService" | "mainCategory" | "subCategory" | "targetAudience" | "sizeRange" | "deliveryMethod" | "deliveryDays" | "hashtags" | "status", ExtArgs["result"]["product"]>
  export type ProductInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    images?: boolean | Product$imagesArgs<ExtArgs>
    likes?: boolean | Product$likesArgs<ExtArgs>
    _count?: boolean | ProductCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ProductIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type ProductIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ProductPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Product"
    objects: {
      images: Prisma.$ProductImagePayload<ExtArgs>[]
      likes: Prisma.$ProductLikePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      originalPrice: number
      salePrice: number
      notice: string | null
      caution: string | null
      basicIncluded: string | null
      location: string | null
      likeCount: number
      createdAt: Date
      updatedAt: Date
      orderFormSchema: Prisma.JsonValue | null
      detailDescription: string | null
      productNumber: string
      foodType: string
      producer: string
      manufactureDate: string
      packageInfo: string
      calories: string
      ingredients: string
      origin: string
      customerService: string
      mainCategory: $Enums.MainCategory[]
      subCategory: $Enums.SubCategory[]
      targetAudience: $Enums.TargetAudience[]
      sizeRange: $Enums.SizeRange[]
      deliveryMethod: $Enums.DeliveryMethod[]
      deliveryDays: $Enums.DeliveryDays[]
      hashtags: string[]
      status: $Enums.ProductStatus
    }, ExtArgs["result"]["product"]>
    composites: {}
  }

  type ProductGetPayload<S extends boolean | null | undefined | ProductDefaultArgs> = $Result.GetResult<Prisma.$ProductPayload, S>

  type ProductCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProductFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProductCountAggregateInputType | true
    }

  export interface ProductDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Product'], meta: { name: 'Product' } }
    /**
     * Find zero or one Product that matches the filter.
     * @param {ProductFindUniqueArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProductFindUniqueArgs>(args: SelectSubset<T, ProductFindUniqueArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Product that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProductFindUniqueOrThrowArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProductFindUniqueOrThrowArgs>(args: SelectSubset<T, ProductFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Product that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFindFirstArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProductFindFirstArgs>(args?: SelectSubset<T, ProductFindFirstArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Product that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFindFirstOrThrowArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProductFindFirstOrThrowArgs>(args?: SelectSubset<T, ProductFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Products that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Products
     * const products = await prisma.product.findMany()
     * 
     * // Get first 10 Products
     * const products = await prisma.product.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const productWithIdOnly = await prisma.product.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProductFindManyArgs>(args?: SelectSubset<T, ProductFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Product.
     * @param {ProductCreateArgs} args - Arguments to create a Product.
     * @example
     * // Create one Product
     * const Product = await prisma.product.create({
     *   data: {
     *     // ... data to create a Product
     *   }
     * })
     * 
     */
    create<T extends ProductCreateArgs>(args: SelectSubset<T, ProductCreateArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Products.
     * @param {ProductCreateManyArgs} args - Arguments to create many Products.
     * @example
     * // Create many Products
     * const product = await prisma.product.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProductCreateManyArgs>(args?: SelectSubset<T, ProductCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Products and returns the data saved in the database.
     * @param {ProductCreateManyAndReturnArgs} args - Arguments to create many Products.
     * @example
     * // Create many Products
     * const product = await prisma.product.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Products and only return the `id`
     * const productWithIdOnly = await prisma.product.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProductCreateManyAndReturnArgs>(args?: SelectSubset<T, ProductCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Product.
     * @param {ProductDeleteArgs} args - Arguments to delete one Product.
     * @example
     * // Delete one Product
     * const Product = await prisma.product.delete({
     *   where: {
     *     // ... filter to delete one Product
     *   }
     * })
     * 
     */
    delete<T extends ProductDeleteArgs>(args: SelectSubset<T, ProductDeleteArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Product.
     * @param {ProductUpdateArgs} args - Arguments to update one Product.
     * @example
     * // Update one Product
     * const product = await prisma.product.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProductUpdateArgs>(args: SelectSubset<T, ProductUpdateArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Products.
     * @param {ProductDeleteManyArgs} args - Arguments to filter Products to delete.
     * @example
     * // Delete a few Products
     * const { count } = await prisma.product.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProductDeleteManyArgs>(args?: SelectSubset<T, ProductDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Products.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Products
     * const product = await prisma.product.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProductUpdateManyArgs>(args: SelectSubset<T, ProductUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Products and returns the data updated in the database.
     * @param {ProductUpdateManyAndReturnArgs} args - Arguments to update many Products.
     * @example
     * // Update many Products
     * const product = await prisma.product.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Products and only return the `id`
     * const productWithIdOnly = await prisma.product.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProductUpdateManyAndReturnArgs>(args: SelectSubset<T, ProductUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Product.
     * @param {ProductUpsertArgs} args - Arguments to update or create a Product.
     * @example
     * // Update or create a Product
     * const product = await prisma.product.upsert({
     *   create: {
     *     // ... data to create a Product
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Product we want to update
     *   }
     * })
     */
    upsert<T extends ProductUpsertArgs>(args: SelectSubset<T, ProductUpsertArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Products.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductCountArgs} args - Arguments to filter Products to count.
     * @example
     * // Count the number of Products
     * const count = await prisma.product.count({
     *   where: {
     *     // ... the filter for the Products we want to count
     *   }
     * })
    **/
    count<T extends ProductCountArgs>(
      args?: Subset<T, ProductCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProductCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Product.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProductAggregateArgs>(args: Subset<T, ProductAggregateArgs>): Prisma.PrismaPromise<GetProductAggregateType<T>>

    /**
     * Group by Product.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProductGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProductGroupByArgs['orderBy'] }
        : { orderBy?: ProductGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProductGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProductGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Product model
   */
  readonly fields: ProductFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Product.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProductClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    images<T extends Product$imagesArgs<ExtArgs> = {}>(args?: Subset<T, Product$imagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductImagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    likes<T extends Product$likesArgs<ExtArgs> = {}>(args?: Subset<T, Product$likesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductLikePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Product model
   */
  interface ProductFieldRefs {
    readonly id: FieldRef<"Product", 'String'>
    readonly name: FieldRef<"Product", 'String'>
    readonly description: FieldRef<"Product", 'String'>
    readonly originalPrice: FieldRef<"Product", 'Int'>
    readonly salePrice: FieldRef<"Product", 'Int'>
    readonly notice: FieldRef<"Product", 'String'>
    readonly caution: FieldRef<"Product", 'String'>
    readonly basicIncluded: FieldRef<"Product", 'String'>
    readonly location: FieldRef<"Product", 'String'>
    readonly likeCount: FieldRef<"Product", 'Int'>
    readonly createdAt: FieldRef<"Product", 'DateTime'>
    readonly updatedAt: FieldRef<"Product", 'DateTime'>
    readonly orderFormSchema: FieldRef<"Product", 'Json'>
    readonly detailDescription: FieldRef<"Product", 'String'>
    readonly productNumber: FieldRef<"Product", 'String'>
    readonly foodType: FieldRef<"Product", 'String'>
    readonly producer: FieldRef<"Product", 'String'>
    readonly manufactureDate: FieldRef<"Product", 'String'>
    readonly packageInfo: FieldRef<"Product", 'String'>
    readonly calories: FieldRef<"Product", 'String'>
    readonly ingredients: FieldRef<"Product", 'String'>
    readonly origin: FieldRef<"Product", 'String'>
    readonly customerService: FieldRef<"Product", 'String'>
    readonly mainCategory: FieldRef<"Product", 'MainCategory[]'>
    readonly subCategory: FieldRef<"Product", 'SubCategory[]'>
    readonly targetAudience: FieldRef<"Product", 'TargetAudience[]'>
    readonly sizeRange: FieldRef<"Product", 'SizeRange[]'>
    readonly deliveryMethod: FieldRef<"Product", 'DeliveryMethod[]'>
    readonly deliveryDays: FieldRef<"Product", 'DeliveryDays[]'>
    readonly hashtags: FieldRef<"Product", 'String[]'>
    readonly status: FieldRef<"Product", 'ProductStatus'>
  }
    

  // Custom InputTypes
  /**
   * Product findUnique
   */
  export type ProductFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product findUniqueOrThrow
   */
  export type ProductFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product findFirst
   */
  export type ProductFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Products.
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Products.
     */
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Product findFirstOrThrow
   */
  export type ProductFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Products.
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Products.
     */
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Product findMany
   */
  export type ProductFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Products to fetch.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Products.
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Product create
   */
  export type ProductCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * The data needed to create a Product.
     */
    data: XOR<ProductCreateInput, ProductUncheckedCreateInput>
  }

  /**
   * Product createMany
   */
  export type ProductCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Products.
     */
    data: ProductCreateManyInput | ProductCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Product createManyAndReturn
   */
  export type ProductCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * The data used to create many Products.
     */
    data: ProductCreateManyInput | ProductCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Product update
   */
  export type ProductUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * The data needed to update a Product.
     */
    data: XOR<ProductUpdateInput, ProductUncheckedUpdateInput>
    /**
     * Choose, which Product to update.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product updateMany
   */
  export type ProductUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Products.
     */
    data: XOR<ProductUpdateManyMutationInput, ProductUncheckedUpdateManyInput>
    /**
     * Filter which Products to update
     */
    where?: ProductWhereInput
    /**
     * Limit how many Products to update.
     */
    limit?: number
  }

  /**
   * Product updateManyAndReturn
   */
  export type ProductUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * The data used to update Products.
     */
    data: XOR<ProductUpdateManyMutationInput, ProductUncheckedUpdateManyInput>
    /**
     * Filter which Products to update
     */
    where?: ProductWhereInput
    /**
     * Limit how many Products to update.
     */
    limit?: number
  }

  /**
   * Product upsert
   */
  export type ProductUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * The filter to search for the Product to update in case it exists.
     */
    where: ProductWhereUniqueInput
    /**
     * In case the Product found by the `where` argument doesn't exist, create a new Product with this data.
     */
    create: XOR<ProductCreateInput, ProductUncheckedCreateInput>
    /**
     * In case the Product was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProductUpdateInput, ProductUncheckedUpdateInput>
  }

  /**
   * Product delete
   */
  export type ProductDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter which Product to delete.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product deleteMany
   */
  export type ProductDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Products to delete
     */
    where?: ProductWhereInput
    /**
     * Limit how many Products to delete.
     */
    limit?: number
  }

  /**
   * Product.images
   */
  export type Product$imagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductImage
     */
    select?: ProductImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductImage
     */
    omit?: ProductImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductImageInclude<ExtArgs> | null
    where?: ProductImageWhereInput
    orderBy?: ProductImageOrderByWithRelationInput | ProductImageOrderByWithRelationInput[]
    cursor?: ProductImageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProductImageScalarFieldEnum | ProductImageScalarFieldEnum[]
  }

  /**
   * Product.likes
   */
  export type Product$likesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductLike
     */
    select?: ProductLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductLike
     */
    omit?: ProductLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductLikeInclude<ExtArgs> | null
    where?: ProductLikeWhereInput
    orderBy?: ProductLikeOrderByWithRelationInput | ProductLikeOrderByWithRelationInput[]
    cursor?: ProductLikeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProductLikeScalarFieldEnum | ProductLikeScalarFieldEnum[]
  }

  /**
   * Product without action
   */
  export type ProductDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
  }


  /**
   * Model ProductImage
   */

  export type AggregateProductImage = {
    _count: ProductImageCountAggregateOutputType | null
    _avg: ProductImageAvgAggregateOutputType | null
    _sum: ProductImageSumAggregateOutputType | null
    _min: ProductImageMinAggregateOutputType | null
    _max: ProductImageMaxAggregateOutputType | null
  }

  export type ProductImageAvgAggregateOutputType = {
    order: number | null
  }

  export type ProductImageSumAggregateOutputType = {
    order: number | null
  }

  export type ProductImageMinAggregateOutputType = {
    id: string | null
    url: string | null
    alt: string | null
    order: number | null
    productId: string | null
    createdAt: Date | null
  }

  export type ProductImageMaxAggregateOutputType = {
    id: string | null
    url: string | null
    alt: string | null
    order: number | null
    productId: string | null
    createdAt: Date | null
  }

  export type ProductImageCountAggregateOutputType = {
    id: number
    url: number
    alt: number
    order: number
    productId: number
    createdAt: number
    _all: number
  }


  export type ProductImageAvgAggregateInputType = {
    order?: true
  }

  export type ProductImageSumAggregateInputType = {
    order?: true
  }

  export type ProductImageMinAggregateInputType = {
    id?: true
    url?: true
    alt?: true
    order?: true
    productId?: true
    createdAt?: true
  }

  export type ProductImageMaxAggregateInputType = {
    id?: true
    url?: true
    alt?: true
    order?: true
    productId?: true
    createdAt?: true
  }

  export type ProductImageCountAggregateInputType = {
    id?: true
    url?: true
    alt?: true
    order?: true
    productId?: true
    createdAt?: true
    _all?: true
  }

  export type ProductImageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProductImage to aggregate.
     */
    where?: ProductImageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductImages to fetch.
     */
    orderBy?: ProductImageOrderByWithRelationInput | ProductImageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProductImageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductImages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductImages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProductImages
    **/
    _count?: true | ProductImageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProductImageAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProductImageSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProductImageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProductImageMaxAggregateInputType
  }

  export type GetProductImageAggregateType<T extends ProductImageAggregateArgs> = {
        [P in keyof T & keyof AggregateProductImage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProductImage[P]>
      : GetScalarType<T[P], AggregateProductImage[P]>
  }




  export type ProductImageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductImageWhereInput
    orderBy?: ProductImageOrderByWithAggregationInput | ProductImageOrderByWithAggregationInput[]
    by: ProductImageScalarFieldEnum[] | ProductImageScalarFieldEnum
    having?: ProductImageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProductImageCountAggregateInputType | true
    _avg?: ProductImageAvgAggregateInputType
    _sum?: ProductImageSumAggregateInputType
    _min?: ProductImageMinAggregateInputType
    _max?: ProductImageMaxAggregateInputType
  }

  export type ProductImageGroupByOutputType = {
    id: string
    url: string
    alt: string | null
    order: number
    productId: string
    createdAt: Date
    _count: ProductImageCountAggregateOutputType | null
    _avg: ProductImageAvgAggregateOutputType | null
    _sum: ProductImageSumAggregateOutputType | null
    _min: ProductImageMinAggregateOutputType | null
    _max: ProductImageMaxAggregateOutputType | null
  }

  type GetProductImageGroupByPayload<T extends ProductImageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProductImageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProductImageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProductImageGroupByOutputType[P]>
            : GetScalarType<T[P], ProductImageGroupByOutputType[P]>
        }
      >
    >


  export type ProductImageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    url?: boolean
    alt?: boolean
    order?: boolean
    productId?: boolean
    createdAt?: boolean
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["productImage"]>

  export type ProductImageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    url?: boolean
    alt?: boolean
    order?: boolean
    productId?: boolean
    createdAt?: boolean
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["productImage"]>

  export type ProductImageSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    url?: boolean
    alt?: boolean
    order?: boolean
    productId?: boolean
    createdAt?: boolean
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["productImage"]>

  export type ProductImageSelectScalar = {
    id?: boolean
    url?: boolean
    alt?: boolean
    order?: boolean
    productId?: boolean
    createdAt?: boolean
  }

  export type ProductImageOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "url" | "alt" | "order" | "productId" | "createdAt", ExtArgs["result"]["productImage"]>
  export type ProductImageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }
  export type ProductImageIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }
  export type ProductImageIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }

  export type $ProductImagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProductImage"
    objects: {
      product: Prisma.$ProductPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      url: string
      alt: string | null
      order: number
      productId: string
      createdAt: Date
    }, ExtArgs["result"]["productImage"]>
    composites: {}
  }

  type ProductImageGetPayload<S extends boolean | null | undefined | ProductImageDefaultArgs> = $Result.GetResult<Prisma.$ProductImagePayload, S>

  type ProductImageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProductImageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProductImageCountAggregateInputType | true
    }

  export interface ProductImageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProductImage'], meta: { name: 'ProductImage' } }
    /**
     * Find zero or one ProductImage that matches the filter.
     * @param {ProductImageFindUniqueArgs} args - Arguments to find a ProductImage
     * @example
     * // Get one ProductImage
     * const productImage = await prisma.productImage.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProductImageFindUniqueArgs>(args: SelectSubset<T, ProductImageFindUniqueArgs<ExtArgs>>): Prisma__ProductImageClient<$Result.GetResult<Prisma.$ProductImagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ProductImage that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProductImageFindUniqueOrThrowArgs} args - Arguments to find a ProductImage
     * @example
     * // Get one ProductImage
     * const productImage = await prisma.productImage.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProductImageFindUniqueOrThrowArgs>(args: SelectSubset<T, ProductImageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProductImageClient<$Result.GetResult<Prisma.$ProductImagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProductImage that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductImageFindFirstArgs} args - Arguments to find a ProductImage
     * @example
     * // Get one ProductImage
     * const productImage = await prisma.productImage.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProductImageFindFirstArgs>(args?: SelectSubset<T, ProductImageFindFirstArgs<ExtArgs>>): Prisma__ProductImageClient<$Result.GetResult<Prisma.$ProductImagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProductImage that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductImageFindFirstOrThrowArgs} args - Arguments to find a ProductImage
     * @example
     * // Get one ProductImage
     * const productImage = await prisma.productImage.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProductImageFindFirstOrThrowArgs>(args?: SelectSubset<T, ProductImageFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProductImageClient<$Result.GetResult<Prisma.$ProductImagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ProductImages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductImageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProductImages
     * const productImages = await prisma.productImage.findMany()
     * 
     * // Get first 10 ProductImages
     * const productImages = await prisma.productImage.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const productImageWithIdOnly = await prisma.productImage.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProductImageFindManyArgs>(args?: SelectSubset<T, ProductImageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductImagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ProductImage.
     * @param {ProductImageCreateArgs} args - Arguments to create a ProductImage.
     * @example
     * // Create one ProductImage
     * const ProductImage = await prisma.productImage.create({
     *   data: {
     *     // ... data to create a ProductImage
     *   }
     * })
     * 
     */
    create<T extends ProductImageCreateArgs>(args: SelectSubset<T, ProductImageCreateArgs<ExtArgs>>): Prisma__ProductImageClient<$Result.GetResult<Prisma.$ProductImagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ProductImages.
     * @param {ProductImageCreateManyArgs} args - Arguments to create many ProductImages.
     * @example
     * // Create many ProductImages
     * const productImage = await prisma.productImage.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProductImageCreateManyArgs>(args?: SelectSubset<T, ProductImageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ProductImages and returns the data saved in the database.
     * @param {ProductImageCreateManyAndReturnArgs} args - Arguments to create many ProductImages.
     * @example
     * // Create many ProductImages
     * const productImage = await prisma.productImage.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ProductImages and only return the `id`
     * const productImageWithIdOnly = await prisma.productImage.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProductImageCreateManyAndReturnArgs>(args?: SelectSubset<T, ProductImageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductImagePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ProductImage.
     * @param {ProductImageDeleteArgs} args - Arguments to delete one ProductImage.
     * @example
     * // Delete one ProductImage
     * const ProductImage = await prisma.productImage.delete({
     *   where: {
     *     // ... filter to delete one ProductImage
     *   }
     * })
     * 
     */
    delete<T extends ProductImageDeleteArgs>(args: SelectSubset<T, ProductImageDeleteArgs<ExtArgs>>): Prisma__ProductImageClient<$Result.GetResult<Prisma.$ProductImagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ProductImage.
     * @param {ProductImageUpdateArgs} args - Arguments to update one ProductImage.
     * @example
     * // Update one ProductImage
     * const productImage = await prisma.productImage.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProductImageUpdateArgs>(args: SelectSubset<T, ProductImageUpdateArgs<ExtArgs>>): Prisma__ProductImageClient<$Result.GetResult<Prisma.$ProductImagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ProductImages.
     * @param {ProductImageDeleteManyArgs} args - Arguments to filter ProductImages to delete.
     * @example
     * // Delete a few ProductImages
     * const { count } = await prisma.productImage.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProductImageDeleteManyArgs>(args?: SelectSubset<T, ProductImageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProductImages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductImageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProductImages
     * const productImage = await prisma.productImage.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProductImageUpdateManyArgs>(args: SelectSubset<T, ProductImageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProductImages and returns the data updated in the database.
     * @param {ProductImageUpdateManyAndReturnArgs} args - Arguments to update many ProductImages.
     * @example
     * // Update many ProductImages
     * const productImage = await prisma.productImage.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ProductImages and only return the `id`
     * const productImageWithIdOnly = await prisma.productImage.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProductImageUpdateManyAndReturnArgs>(args: SelectSubset<T, ProductImageUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductImagePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ProductImage.
     * @param {ProductImageUpsertArgs} args - Arguments to update or create a ProductImage.
     * @example
     * // Update or create a ProductImage
     * const productImage = await prisma.productImage.upsert({
     *   create: {
     *     // ... data to create a ProductImage
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProductImage we want to update
     *   }
     * })
     */
    upsert<T extends ProductImageUpsertArgs>(args: SelectSubset<T, ProductImageUpsertArgs<ExtArgs>>): Prisma__ProductImageClient<$Result.GetResult<Prisma.$ProductImagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ProductImages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductImageCountArgs} args - Arguments to filter ProductImages to count.
     * @example
     * // Count the number of ProductImages
     * const count = await prisma.productImage.count({
     *   where: {
     *     // ... the filter for the ProductImages we want to count
     *   }
     * })
    **/
    count<T extends ProductImageCountArgs>(
      args?: Subset<T, ProductImageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProductImageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProductImage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductImageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProductImageAggregateArgs>(args: Subset<T, ProductImageAggregateArgs>): Prisma.PrismaPromise<GetProductImageAggregateType<T>>

    /**
     * Group by ProductImage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductImageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProductImageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProductImageGroupByArgs['orderBy'] }
        : { orderBy?: ProductImageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProductImageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProductImageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProductImage model
   */
  readonly fields: ProductImageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProductImage.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProductImageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    product<T extends ProductDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProductDefaultArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ProductImage model
   */
  interface ProductImageFieldRefs {
    readonly id: FieldRef<"ProductImage", 'String'>
    readonly url: FieldRef<"ProductImage", 'String'>
    readonly alt: FieldRef<"ProductImage", 'String'>
    readonly order: FieldRef<"ProductImage", 'Int'>
    readonly productId: FieldRef<"ProductImage", 'String'>
    readonly createdAt: FieldRef<"ProductImage", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ProductImage findUnique
   */
  export type ProductImageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductImage
     */
    select?: ProductImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductImage
     */
    omit?: ProductImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductImageInclude<ExtArgs> | null
    /**
     * Filter, which ProductImage to fetch.
     */
    where: ProductImageWhereUniqueInput
  }

  /**
   * ProductImage findUniqueOrThrow
   */
  export type ProductImageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductImage
     */
    select?: ProductImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductImage
     */
    omit?: ProductImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductImageInclude<ExtArgs> | null
    /**
     * Filter, which ProductImage to fetch.
     */
    where: ProductImageWhereUniqueInput
  }

  /**
   * ProductImage findFirst
   */
  export type ProductImageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductImage
     */
    select?: ProductImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductImage
     */
    omit?: ProductImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductImageInclude<ExtArgs> | null
    /**
     * Filter, which ProductImage to fetch.
     */
    where?: ProductImageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductImages to fetch.
     */
    orderBy?: ProductImageOrderByWithRelationInput | ProductImageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProductImages.
     */
    cursor?: ProductImageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductImages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductImages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProductImages.
     */
    distinct?: ProductImageScalarFieldEnum | ProductImageScalarFieldEnum[]
  }

  /**
   * ProductImage findFirstOrThrow
   */
  export type ProductImageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductImage
     */
    select?: ProductImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductImage
     */
    omit?: ProductImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductImageInclude<ExtArgs> | null
    /**
     * Filter, which ProductImage to fetch.
     */
    where?: ProductImageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductImages to fetch.
     */
    orderBy?: ProductImageOrderByWithRelationInput | ProductImageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProductImages.
     */
    cursor?: ProductImageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductImages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductImages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProductImages.
     */
    distinct?: ProductImageScalarFieldEnum | ProductImageScalarFieldEnum[]
  }

  /**
   * ProductImage findMany
   */
  export type ProductImageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductImage
     */
    select?: ProductImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductImage
     */
    omit?: ProductImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductImageInclude<ExtArgs> | null
    /**
     * Filter, which ProductImages to fetch.
     */
    where?: ProductImageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductImages to fetch.
     */
    orderBy?: ProductImageOrderByWithRelationInput | ProductImageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProductImages.
     */
    cursor?: ProductImageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductImages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductImages.
     */
    skip?: number
    distinct?: ProductImageScalarFieldEnum | ProductImageScalarFieldEnum[]
  }

  /**
   * ProductImage create
   */
  export type ProductImageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductImage
     */
    select?: ProductImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductImage
     */
    omit?: ProductImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductImageInclude<ExtArgs> | null
    /**
     * The data needed to create a ProductImage.
     */
    data: XOR<ProductImageCreateInput, ProductImageUncheckedCreateInput>
  }

  /**
   * ProductImage createMany
   */
  export type ProductImageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProductImages.
     */
    data: ProductImageCreateManyInput | ProductImageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProductImage createManyAndReturn
   */
  export type ProductImageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductImage
     */
    select?: ProductImageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProductImage
     */
    omit?: ProductImageOmit<ExtArgs> | null
    /**
     * The data used to create many ProductImages.
     */
    data: ProductImageCreateManyInput | ProductImageCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductImageIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProductImage update
   */
  export type ProductImageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductImage
     */
    select?: ProductImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductImage
     */
    omit?: ProductImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductImageInclude<ExtArgs> | null
    /**
     * The data needed to update a ProductImage.
     */
    data: XOR<ProductImageUpdateInput, ProductImageUncheckedUpdateInput>
    /**
     * Choose, which ProductImage to update.
     */
    where: ProductImageWhereUniqueInput
  }

  /**
   * ProductImage updateMany
   */
  export type ProductImageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProductImages.
     */
    data: XOR<ProductImageUpdateManyMutationInput, ProductImageUncheckedUpdateManyInput>
    /**
     * Filter which ProductImages to update
     */
    where?: ProductImageWhereInput
    /**
     * Limit how many ProductImages to update.
     */
    limit?: number
  }

  /**
   * ProductImage updateManyAndReturn
   */
  export type ProductImageUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductImage
     */
    select?: ProductImageSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProductImage
     */
    omit?: ProductImageOmit<ExtArgs> | null
    /**
     * The data used to update ProductImages.
     */
    data: XOR<ProductImageUpdateManyMutationInput, ProductImageUncheckedUpdateManyInput>
    /**
     * Filter which ProductImages to update
     */
    where?: ProductImageWhereInput
    /**
     * Limit how many ProductImages to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductImageIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProductImage upsert
   */
  export type ProductImageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductImage
     */
    select?: ProductImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductImage
     */
    omit?: ProductImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductImageInclude<ExtArgs> | null
    /**
     * The filter to search for the ProductImage to update in case it exists.
     */
    where: ProductImageWhereUniqueInput
    /**
     * In case the ProductImage found by the `where` argument doesn't exist, create a new ProductImage with this data.
     */
    create: XOR<ProductImageCreateInput, ProductImageUncheckedCreateInput>
    /**
     * In case the ProductImage was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProductImageUpdateInput, ProductImageUncheckedUpdateInput>
  }

  /**
   * ProductImage delete
   */
  export type ProductImageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductImage
     */
    select?: ProductImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductImage
     */
    omit?: ProductImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductImageInclude<ExtArgs> | null
    /**
     * Filter which ProductImage to delete.
     */
    where: ProductImageWhereUniqueInput
  }

  /**
   * ProductImage deleteMany
   */
  export type ProductImageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProductImages to delete
     */
    where?: ProductImageWhereInput
    /**
     * Limit how many ProductImages to delete.
     */
    limit?: number
  }

  /**
   * ProductImage without action
   */
  export type ProductImageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductImage
     */
    select?: ProductImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductImage
     */
    omit?: ProductImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductImageInclude<ExtArgs> | null
  }


  /**
   * Model ProductLike
   */

  export type AggregateProductLike = {
    _count: ProductLikeCountAggregateOutputType | null
    _min: ProductLikeMinAggregateOutputType | null
    _max: ProductLikeMaxAggregateOutputType | null
  }

  export type ProductLikeMinAggregateOutputType = {
    id: string | null
    userId: string | null
    productId: string | null
    createdAt: Date | null
  }

  export type ProductLikeMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    productId: string | null
    createdAt: Date | null
  }

  export type ProductLikeCountAggregateOutputType = {
    id: number
    userId: number
    productId: number
    createdAt: number
    _all: number
  }


  export type ProductLikeMinAggregateInputType = {
    id?: true
    userId?: true
    productId?: true
    createdAt?: true
  }

  export type ProductLikeMaxAggregateInputType = {
    id?: true
    userId?: true
    productId?: true
    createdAt?: true
  }

  export type ProductLikeCountAggregateInputType = {
    id?: true
    userId?: true
    productId?: true
    createdAt?: true
    _all?: true
  }

  export type ProductLikeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProductLike to aggregate.
     */
    where?: ProductLikeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductLikes to fetch.
     */
    orderBy?: ProductLikeOrderByWithRelationInput | ProductLikeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProductLikeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductLikes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductLikes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProductLikes
    **/
    _count?: true | ProductLikeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProductLikeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProductLikeMaxAggregateInputType
  }

  export type GetProductLikeAggregateType<T extends ProductLikeAggregateArgs> = {
        [P in keyof T & keyof AggregateProductLike]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProductLike[P]>
      : GetScalarType<T[P], AggregateProductLike[P]>
  }




  export type ProductLikeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductLikeWhereInput
    orderBy?: ProductLikeOrderByWithAggregationInput | ProductLikeOrderByWithAggregationInput[]
    by: ProductLikeScalarFieldEnum[] | ProductLikeScalarFieldEnum
    having?: ProductLikeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProductLikeCountAggregateInputType | true
    _min?: ProductLikeMinAggregateInputType
    _max?: ProductLikeMaxAggregateInputType
  }

  export type ProductLikeGroupByOutputType = {
    id: string
    userId: string
    productId: string
    createdAt: Date
    _count: ProductLikeCountAggregateOutputType | null
    _min: ProductLikeMinAggregateOutputType | null
    _max: ProductLikeMaxAggregateOutputType | null
  }

  type GetProductLikeGroupByPayload<T extends ProductLikeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProductLikeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProductLikeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProductLikeGroupByOutputType[P]>
            : GetScalarType<T[P], ProductLikeGroupByOutputType[P]>
        }
      >
    >


  export type ProductLikeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    productId?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["productLike"]>

  export type ProductLikeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    productId?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["productLike"]>

  export type ProductLikeSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    productId?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["productLike"]>

  export type ProductLikeSelectScalar = {
    id?: boolean
    userId?: boolean
    productId?: boolean
    createdAt?: boolean
  }

  export type ProductLikeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "productId" | "createdAt", ExtArgs["result"]["productLike"]>
  export type ProductLikeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }
  export type ProductLikeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }
  export type ProductLikeIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    product?: boolean | ProductDefaultArgs<ExtArgs>
  }

  export type $ProductLikePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProductLike"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      product: Prisma.$ProductPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      productId: string
      createdAt: Date
    }, ExtArgs["result"]["productLike"]>
    composites: {}
  }

  type ProductLikeGetPayload<S extends boolean | null | undefined | ProductLikeDefaultArgs> = $Result.GetResult<Prisma.$ProductLikePayload, S>

  type ProductLikeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProductLikeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProductLikeCountAggregateInputType | true
    }

  export interface ProductLikeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProductLike'], meta: { name: 'ProductLike' } }
    /**
     * Find zero or one ProductLike that matches the filter.
     * @param {ProductLikeFindUniqueArgs} args - Arguments to find a ProductLike
     * @example
     * // Get one ProductLike
     * const productLike = await prisma.productLike.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProductLikeFindUniqueArgs>(args: SelectSubset<T, ProductLikeFindUniqueArgs<ExtArgs>>): Prisma__ProductLikeClient<$Result.GetResult<Prisma.$ProductLikePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ProductLike that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProductLikeFindUniqueOrThrowArgs} args - Arguments to find a ProductLike
     * @example
     * // Get one ProductLike
     * const productLike = await prisma.productLike.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProductLikeFindUniqueOrThrowArgs>(args: SelectSubset<T, ProductLikeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProductLikeClient<$Result.GetResult<Prisma.$ProductLikePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProductLike that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductLikeFindFirstArgs} args - Arguments to find a ProductLike
     * @example
     * // Get one ProductLike
     * const productLike = await prisma.productLike.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProductLikeFindFirstArgs>(args?: SelectSubset<T, ProductLikeFindFirstArgs<ExtArgs>>): Prisma__ProductLikeClient<$Result.GetResult<Prisma.$ProductLikePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProductLike that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductLikeFindFirstOrThrowArgs} args - Arguments to find a ProductLike
     * @example
     * // Get one ProductLike
     * const productLike = await prisma.productLike.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProductLikeFindFirstOrThrowArgs>(args?: SelectSubset<T, ProductLikeFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProductLikeClient<$Result.GetResult<Prisma.$ProductLikePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ProductLikes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductLikeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProductLikes
     * const productLikes = await prisma.productLike.findMany()
     * 
     * // Get first 10 ProductLikes
     * const productLikes = await prisma.productLike.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const productLikeWithIdOnly = await prisma.productLike.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProductLikeFindManyArgs>(args?: SelectSubset<T, ProductLikeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductLikePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ProductLike.
     * @param {ProductLikeCreateArgs} args - Arguments to create a ProductLike.
     * @example
     * // Create one ProductLike
     * const ProductLike = await prisma.productLike.create({
     *   data: {
     *     // ... data to create a ProductLike
     *   }
     * })
     * 
     */
    create<T extends ProductLikeCreateArgs>(args: SelectSubset<T, ProductLikeCreateArgs<ExtArgs>>): Prisma__ProductLikeClient<$Result.GetResult<Prisma.$ProductLikePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ProductLikes.
     * @param {ProductLikeCreateManyArgs} args - Arguments to create many ProductLikes.
     * @example
     * // Create many ProductLikes
     * const productLike = await prisma.productLike.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProductLikeCreateManyArgs>(args?: SelectSubset<T, ProductLikeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ProductLikes and returns the data saved in the database.
     * @param {ProductLikeCreateManyAndReturnArgs} args - Arguments to create many ProductLikes.
     * @example
     * // Create many ProductLikes
     * const productLike = await prisma.productLike.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ProductLikes and only return the `id`
     * const productLikeWithIdOnly = await prisma.productLike.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProductLikeCreateManyAndReturnArgs>(args?: SelectSubset<T, ProductLikeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductLikePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ProductLike.
     * @param {ProductLikeDeleteArgs} args - Arguments to delete one ProductLike.
     * @example
     * // Delete one ProductLike
     * const ProductLike = await prisma.productLike.delete({
     *   where: {
     *     // ... filter to delete one ProductLike
     *   }
     * })
     * 
     */
    delete<T extends ProductLikeDeleteArgs>(args: SelectSubset<T, ProductLikeDeleteArgs<ExtArgs>>): Prisma__ProductLikeClient<$Result.GetResult<Prisma.$ProductLikePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ProductLike.
     * @param {ProductLikeUpdateArgs} args - Arguments to update one ProductLike.
     * @example
     * // Update one ProductLike
     * const productLike = await prisma.productLike.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProductLikeUpdateArgs>(args: SelectSubset<T, ProductLikeUpdateArgs<ExtArgs>>): Prisma__ProductLikeClient<$Result.GetResult<Prisma.$ProductLikePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ProductLikes.
     * @param {ProductLikeDeleteManyArgs} args - Arguments to filter ProductLikes to delete.
     * @example
     * // Delete a few ProductLikes
     * const { count } = await prisma.productLike.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProductLikeDeleteManyArgs>(args?: SelectSubset<T, ProductLikeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProductLikes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductLikeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProductLikes
     * const productLike = await prisma.productLike.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProductLikeUpdateManyArgs>(args: SelectSubset<T, ProductLikeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProductLikes and returns the data updated in the database.
     * @param {ProductLikeUpdateManyAndReturnArgs} args - Arguments to update many ProductLikes.
     * @example
     * // Update many ProductLikes
     * const productLike = await prisma.productLike.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ProductLikes and only return the `id`
     * const productLikeWithIdOnly = await prisma.productLike.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProductLikeUpdateManyAndReturnArgs>(args: SelectSubset<T, ProductLikeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductLikePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ProductLike.
     * @param {ProductLikeUpsertArgs} args - Arguments to update or create a ProductLike.
     * @example
     * // Update or create a ProductLike
     * const productLike = await prisma.productLike.upsert({
     *   create: {
     *     // ... data to create a ProductLike
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProductLike we want to update
     *   }
     * })
     */
    upsert<T extends ProductLikeUpsertArgs>(args: SelectSubset<T, ProductLikeUpsertArgs<ExtArgs>>): Prisma__ProductLikeClient<$Result.GetResult<Prisma.$ProductLikePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ProductLikes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductLikeCountArgs} args - Arguments to filter ProductLikes to count.
     * @example
     * // Count the number of ProductLikes
     * const count = await prisma.productLike.count({
     *   where: {
     *     // ... the filter for the ProductLikes we want to count
     *   }
     * })
    **/
    count<T extends ProductLikeCountArgs>(
      args?: Subset<T, ProductLikeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProductLikeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProductLike.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductLikeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProductLikeAggregateArgs>(args: Subset<T, ProductLikeAggregateArgs>): Prisma.PrismaPromise<GetProductLikeAggregateType<T>>

    /**
     * Group by ProductLike.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductLikeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProductLikeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProductLikeGroupByArgs['orderBy'] }
        : { orderBy?: ProductLikeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProductLikeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProductLikeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProductLike model
   */
  readonly fields: ProductLikeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProductLike.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProductLikeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    product<T extends ProductDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProductDefaultArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ProductLike model
   */
  interface ProductLikeFieldRefs {
    readonly id: FieldRef<"ProductLike", 'String'>
    readonly userId: FieldRef<"ProductLike", 'String'>
    readonly productId: FieldRef<"ProductLike", 'String'>
    readonly createdAt: FieldRef<"ProductLike", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ProductLike findUnique
   */
  export type ProductLikeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductLike
     */
    select?: ProductLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductLike
     */
    omit?: ProductLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductLikeInclude<ExtArgs> | null
    /**
     * Filter, which ProductLike to fetch.
     */
    where: ProductLikeWhereUniqueInput
  }

  /**
   * ProductLike findUniqueOrThrow
   */
  export type ProductLikeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductLike
     */
    select?: ProductLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductLike
     */
    omit?: ProductLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductLikeInclude<ExtArgs> | null
    /**
     * Filter, which ProductLike to fetch.
     */
    where: ProductLikeWhereUniqueInput
  }

  /**
   * ProductLike findFirst
   */
  export type ProductLikeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductLike
     */
    select?: ProductLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductLike
     */
    omit?: ProductLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductLikeInclude<ExtArgs> | null
    /**
     * Filter, which ProductLike to fetch.
     */
    where?: ProductLikeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductLikes to fetch.
     */
    orderBy?: ProductLikeOrderByWithRelationInput | ProductLikeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProductLikes.
     */
    cursor?: ProductLikeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductLikes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductLikes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProductLikes.
     */
    distinct?: ProductLikeScalarFieldEnum | ProductLikeScalarFieldEnum[]
  }

  /**
   * ProductLike findFirstOrThrow
   */
  export type ProductLikeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductLike
     */
    select?: ProductLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductLike
     */
    omit?: ProductLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductLikeInclude<ExtArgs> | null
    /**
     * Filter, which ProductLike to fetch.
     */
    where?: ProductLikeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductLikes to fetch.
     */
    orderBy?: ProductLikeOrderByWithRelationInput | ProductLikeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProductLikes.
     */
    cursor?: ProductLikeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductLikes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductLikes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProductLikes.
     */
    distinct?: ProductLikeScalarFieldEnum | ProductLikeScalarFieldEnum[]
  }

  /**
   * ProductLike findMany
   */
  export type ProductLikeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductLike
     */
    select?: ProductLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductLike
     */
    omit?: ProductLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductLikeInclude<ExtArgs> | null
    /**
     * Filter, which ProductLikes to fetch.
     */
    where?: ProductLikeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductLikes to fetch.
     */
    orderBy?: ProductLikeOrderByWithRelationInput | ProductLikeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProductLikes.
     */
    cursor?: ProductLikeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductLikes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductLikes.
     */
    skip?: number
    distinct?: ProductLikeScalarFieldEnum | ProductLikeScalarFieldEnum[]
  }

  /**
   * ProductLike create
   */
  export type ProductLikeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductLike
     */
    select?: ProductLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductLike
     */
    omit?: ProductLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductLikeInclude<ExtArgs> | null
    /**
     * The data needed to create a ProductLike.
     */
    data: XOR<ProductLikeCreateInput, ProductLikeUncheckedCreateInput>
  }

  /**
   * ProductLike createMany
   */
  export type ProductLikeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProductLikes.
     */
    data: ProductLikeCreateManyInput | ProductLikeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProductLike createManyAndReturn
   */
  export type ProductLikeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductLike
     */
    select?: ProductLikeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProductLike
     */
    omit?: ProductLikeOmit<ExtArgs> | null
    /**
     * The data used to create many ProductLikes.
     */
    data: ProductLikeCreateManyInput | ProductLikeCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductLikeIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProductLike update
   */
  export type ProductLikeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductLike
     */
    select?: ProductLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductLike
     */
    omit?: ProductLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductLikeInclude<ExtArgs> | null
    /**
     * The data needed to update a ProductLike.
     */
    data: XOR<ProductLikeUpdateInput, ProductLikeUncheckedUpdateInput>
    /**
     * Choose, which ProductLike to update.
     */
    where: ProductLikeWhereUniqueInput
  }

  /**
   * ProductLike updateMany
   */
  export type ProductLikeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProductLikes.
     */
    data: XOR<ProductLikeUpdateManyMutationInput, ProductLikeUncheckedUpdateManyInput>
    /**
     * Filter which ProductLikes to update
     */
    where?: ProductLikeWhereInput
    /**
     * Limit how many ProductLikes to update.
     */
    limit?: number
  }

  /**
   * ProductLike updateManyAndReturn
   */
  export type ProductLikeUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductLike
     */
    select?: ProductLikeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProductLike
     */
    omit?: ProductLikeOmit<ExtArgs> | null
    /**
     * The data used to update ProductLikes.
     */
    data: XOR<ProductLikeUpdateManyMutationInput, ProductLikeUncheckedUpdateManyInput>
    /**
     * Filter which ProductLikes to update
     */
    where?: ProductLikeWhereInput
    /**
     * Limit how many ProductLikes to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductLikeIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProductLike upsert
   */
  export type ProductLikeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductLike
     */
    select?: ProductLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductLike
     */
    omit?: ProductLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductLikeInclude<ExtArgs> | null
    /**
     * The filter to search for the ProductLike to update in case it exists.
     */
    where: ProductLikeWhereUniqueInput
    /**
     * In case the ProductLike found by the `where` argument doesn't exist, create a new ProductLike with this data.
     */
    create: XOR<ProductLikeCreateInput, ProductLikeUncheckedCreateInput>
    /**
     * In case the ProductLike was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProductLikeUpdateInput, ProductLikeUncheckedUpdateInput>
  }

  /**
   * ProductLike delete
   */
  export type ProductLikeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductLike
     */
    select?: ProductLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductLike
     */
    omit?: ProductLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductLikeInclude<ExtArgs> | null
    /**
     * Filter which ProductLike to delete.
     */
    where: ProductLikeWhereUniqueInput
  }

  /**
   * ProductLike deleteMany
   */
  export type ProductLikeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProductLikes to delete
     */
    where?: ProductLikeWhereInput
    /**
     * Limit how many ProductLikes to delete.
     */
    limit?: number
  }

  /**
   * ProductLike without action
   */
  export type ProductLikeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductLike
     */
    select?: ProductLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductLike
     */
    omit?: ProductLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductLikeInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    phone: 'phone',
    passwordHash: 'passwordHash',
    name: 'name',
    nickname: 'nickname',
    email: 'email',
    profileImageUrl: 'profileImageUrl',
    isPhoneVerified: 'isPhoneVerified',
    isActive: 'isActive',
    userId: 'userId',
    googleId: 'googleId',
    googleEmail: 'googleEmail',
    createdAt: 'createdAt',
    lastLoginAt: 'lastLoginAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const PhoneVerificationScalarFieldEnum: {
    id: 'id',
    phone: 'phone',
    verificationCode: 'verificationCode',
    expiresAt: 'expiresAt',
    isVerified: 'isVerified',
    purpose: 'purpose',
    userId: 'userId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PhoneVerificationScalarFieldEnum = (typeof PhoneVerificationScalarFieldEnum)[keyof typeof PhoneVerificationScalarFieldEnum]


  export const ProductScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    originalPrice: 'originalPrice',
    salePrice: 'salePrice',
    notice: 'notice',
    caution: 'caution',
    basicIncluded: 'basicIncluded',
    location: 'location',
    likeCount: 'likeCount',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    orderFormSchema: 'orderFormSchema',
    detailDescription: 'detailDescription',
    productNumber: 'productNumber',
    foodType: 'foodType',
    producer: 'producer',
    manufactureDate: 'manufactureDate',
    packageInfo: 'packageInfo',
    calories: 'calories',
    ingredients: 'ingredients',
    origin: 'origin',
    customerService: 'customerService',
    mainCategory: 'mainCategory',
    subCategory: 'subCategory',
    targetAudience: 'targetAudience',
    sizeRange: 'sizeRange',
    deliveryMethod: 'deliveryMethod',
    deliveryDays: 'deliveryDays',
    hashtags: 'hashtags',
    status: 'status'
  };

  export type ProductScalarFieldEnum = (typeof ProductScalarFieldEnum)[keyof typeof ProductScalarFieldEnum]


  export const ProductImageScalarFieldEnum: {
    id: 'id',
    url: 'url',
    alt: 'alt',
    order: 'order',
    productId: 'productId',
    createdAt: 'createdAt'
  };

  export type ProductImageScalarFieldEnum = (typeof ProductImageScalarFieldEnum)[keyof typeof ProductImageScalarFieldEnum]


  export const ProductLikeScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    productId: 'productId',
    createdAt: 'createdAt'
  };

  export type ProductLikeScalarFieldEnum = (typeof ProductLikeScalarFieldEnum)[keyof typeof ProductLikeScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'MainCategory[]'
   */
  export type ListEnumMainCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MainCategory[]'>
    


  /**
   * Reference to a field of type 'MainCategory'
   */
  export type EnumMainCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MainCategory'>
    


  /**
   * Reference to a field of type 'SubCategory[]'
   */
  export type ListEnumSubCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SubCategory[]'>
    


  /**
   * Reference to a field of type 'SubCategory'
   */
  export type EnumSubCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SubCategory'>
    


  /**
   * Reference to a field of type 'TargetAudience[]'
   */
  export type ListEnumTargetAudienceFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TargetAudience[]'>
    


  /**
   * Reference to a field of type 'TargetAudience'
   */
  export type EnumTargetAudienceFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TargetAudience'>
    


  /**
   * Reference to a field of type 'SizeRange[]'
   */
  export type ListEnumSizeRangeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SizeRange[]'>
    


  /**
   * Reference to a field of type 'SizeRange'
   */
  export type EnumSizeRangeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SizeRange'>
    


  /**
   * Reference to a field of type 'DeliveryMethod[]'
   */
  export type ListEnumDeliveryMethodFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DeliveryMethod[]'>
    


  /**
   * Reference to a field of type 'DeliveryMethod'
   */
  export type EnumDeliveryMethodFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DeliveryMethod'>
    


  /**
   * Reference to a field of type 'DeliveryDays[]'
   */
  export type ListEnumDeliveryDaysFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DeliveryDays[]'>
    


  /**
   * Reference to a field of type 'DeliveryDays'
   */
  export type EnumDeliveryDaysFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DeliveryDays'>
    


  /**
   * Reference to a field of type 'ProductStatus'
   */
  export type EnumProductStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ProductStatus'>
    


  /**
   * Reference to a field of type 'ProductStatus[]'
   */
  export type ListEnumProductStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ProductStatus[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    phone?: StringFilter<"User"> | string
    passwordHash?: StringNullableFilter<"User"> | string | null
    name?: StringNullableFilter<"User"> | string | null
    nickname?: StringNullableFilter<"User"> | string | null
    email?: StringNullableFilter<"User"> | string | null
    profileImageUrl?: StringNullableFilter<"User"> | string | null
    isPhoneVerified?: BoolFilter<"User"> | boolean
    isActive?: BoolFilter<"User"> | boolean
    userId?: StringNullableFilter<"User"> | string | null
    googleId?: StringNullableFilter<"User"> | string | null
    googleEmail?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    lastLoginAt?: DateTimeNullableFilter<"User"> | Date | string | null
    productLikes?: ProductLikeListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    phone?: SortOrder
    passwordHash?: SortOrderInput | SortOrder
    name?: SortOrderInput | SortOrder
    nickname?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    profileImageUrl?: SortOrderInput | SortOrder
    isPhoneVerified?: SortOrder
    isActive?: SortOrder
    userId?: SortOrderInput | SortOrder
    googleId?: SortOrderInput | SortOrder
    googleEmail?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    lastLoginAt?: SortOrderInput | SortOrder
    productLikes?: ProductLikeOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    phone?: string
    userId?: string
    googleId?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    passwordHash?: StringNullableFilter<"User"> | string | null
    name?: StringNullableFilter<"User"> | string | null
    nickname?: StringNullableFilter<"User"> | string | null
    email?: StringNullableFilter<"User"> | string | null
    profileImageUrl?: StringNullableFilter<"User"> | string | null
    isPhoneVerified?: BoolFilter<"User"> | boolean
    isActive?: BoolFilter<"User"> | boolean
    googleEmail?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    lastLoginAt?: DateTimeNullableFilter<"User"> | Date | string | null
    productLikes?: ProductLikeListRelationFilter
  }, "id" | "phone" | "userId" | "googleId">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    phone?: SortOrder
    passwordHash?: SortOrderInput | SortOrder
    name?: SortOrderInput | SortOrder
    nickname?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    profileImageUrl?: SortOrderInput | SortOrder
    isPhoneVerified?: SortOrder
    isActive?: SortOrder
    userId?: SortOrderInput | SortOrder
    googleId?: SortOrderInput | SortOrder
    googleEmail?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    lastLoginAt?: SortOrderInput | SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    phone?: StringWithAggregatesFilter<"User"> | string
    passwordHash?: StringNullableWithAggregatesFilter<"User"> | string | null
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    nickname?: StringNullableWithAggregatesFilter<"User"> | string | null
    email?: StringNullableWithAggregatesFilter<"User"> | string | null
    profileImageUrl?: StringNullableWithAggregatesFilter<"User"> | string | null
    isPhoneVerified?: BoolWithAggregatesFilter<"User"> | boolean
    isActive?: BoolWithAggregatesFilter<"User"> | boolean
    userId?: StringNullableWithAggregatesFilter<"User"> | string | null
    googleId?: StringNullableWithAggregatesFilter<"User"> | string | null
    googleEmail?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    lastLoginAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
  }

  export type PhoneVerificationWhereInput = {
    AND?: PhoneVerificationWhereInput | PhoneVerificationWhereInput[]
    OR?: PhoneVerificationWhereInput[]
    NOT?: PhoneVerificationWhereInput | PhoneVerificationWhereInput[]
    id?: StringFilter<"PhoneVerification"> | string
    phone?: StringFilter<"PhoneVerification"> | string
    verificationCode?: StringFilter<"PhoneVerification"> | string
    expiresAt?: DateTimeFilter<"PhoneVerification"> | Date | string
    isVerified?: BoolFilter<"PhoneVerification"> | boolean
    purpose?: StringFilter<"PhoneVerification"> | string
    userId?: StringNullableFilter<"PhoneVerification"> | string | null
    createdAt?: DateTimeFilter<"PhoneVerification"> | Date | string
    updatedAt?: DateTimeFilter<"PhoneVerification"> | Date | string
  }

  export type PhoneVerificationOrderByWithRelationInput = {
    id?: SortOrder
    phone?: SortOrder
    verificationCode?: SortOrder
    expiresAt?: SortOrder
    isVerified?: SortOrder
    purpose?: SortOrder
    userId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PhoneVerificationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    phone_verificationCode?: PhoneVerificationPhoneVerificationCodeCompoundUniqueInput
    AND?: PhoneVerificationWhereInput | PhoneVerificationWhereInput[]
    OR?: PhoneVerificationWhereInput[]
    NOT?: PhoneVerificationWhereInput | PhoneVerificationWhereInput[]
    phone?: StringFilter<"PhoneVerification"> | string
    verificationCode?: StringFilter<"PhoneVerification"> | string
    expiresAt?: DateTimeFilter<"PhoneVerification"> | Date | string
    isVerified?: BoolFilter<"PhoneVerification"> | boolean
    purpose?: StringFilter<"PhoneVerification"> | string
    userId?: StringNullableFilter<"PhoneVerification"> | string | null
    createdAt?: DateTimeFilter<"PhoneVerification"> | Date | string
    updatedAt?: DateTimeFilter<"PhoneVerification"> | Date | string
  }, "id" | "phone_verificationCode">

  export type PhoneVerificationOrderByWithAggregationInput = {
    id?: SortOrder
    phone?: SortOrder
    verificationCode?: SortOrder
    expiresAt?: SortOrder
    isVerified?: SortOrder
    purpose?: SortOrder
    userId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PhoneVerificationCountOrderByAggregateInput
    _max?: PhoneVerificationMaxOrderByAggregateInput
    _min?: PhoneVerificationMinOrderByAggregateInput
  }

  export type PhoneVerificationScalarWhereWithAggregatesInput = {
    AND?: PhoneVerificationScalarWhereWithAggregatesInput | PhoneVerificationScalarWhereWithAggregatesInput[]
    OR?: PhoneVerificationScalarWhereWithAggregatesInput[]
    NOT?: PhoneVerificationScalarWhereWithAggregatesInput | PhoneVerificationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PhoneVerification"> | string
    phone?: StringWithAggregatesFilter<"PhoneVerification"> | string
    verificationCode?: StringWithAggregatesFilter<"PhoneVerification"> | string
    expiresAt?: DateTimeWithAggregatesFilter<"PhoneVerification"> | Date | string
    isVerified?: BoolWithAggregatesFilter<"PhoneVerification"> | boolean
    purpose?: StringWithAggregatesFilter<"PhoneVerification"> | string
    userId?: StringNullableWithAggregatesFilter<"PhoneVerification"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"PhoneVerification"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"PhoneVerification"> | Date | string
  }

  export type ProductWhereInput = {
    AND?: ProductWhereInput | ProductWhereInput[]
    OR?: ProductWhereInput[]
    NOT?: ProductWhereInput | ProductWhereInput[]
    id?: StringFilter<"Product"> | string
    name?: StringFilter<"Product"> | string
    description?: StringNullableFilter<"Product"> | string | null
    originalPrice?: IntFilter<"Product"> | number
    salePrice?: IntFilter<"Product"> | number
    notice?: StringNullableFilter<"Product"> | string | null
    caution?: StringNullableFilter<"Product"> | string | null
    basicIncluded?: StringNullableFilter<"Product"> | string | null
    location?: StringNullableFilter<"Product"> | string | null
    likeCount?: IntFilter<"Product"> | number
    createdAt?: DateTimeFilter<"Product"> | Date | string
    updatedAt?: DateTimeFilter<"Product"> | Date | string
    orderFormSchema?: JsonNullableFilter<"Product">
    detailDescription?: StringNullableFilter<"Product"> | string | null
    productNumber?: StringFilter<"Product"> | string
    foodType?: StringFilter<"Product"> | string
    producer?: StringFilter<"Product"> | string
    manufactureDate?: StringFilter<"Product"> | string
    packageInfo?: StringFilter<"Product"> | string
    calories?: StringFilter<"Product"> | string
    ingredients?: StringFilter<"Product"> | string
    origin?: StringFilter<"Product"> | string
    customerService?: StringFilter<"Product"> | string
    mainCategory?: EnumMainCategoryNullableListFilter<"Product">
    subCategory?: EnumSubCategoryNullableListFilter<"Product">
    targetAudience?: EnumTargetAudienceNullableListFilter<"Product">
    sizeRange?: EnumSizeRangeNullableListFilter<"Product">
    deliveryMethod?: EnumDeliveryMethodNullableListFilter<"Product">
    deliveryDays?: EnumDeliveryDaysNullableListFilter<"Product">
    hashtags?: StringNullableListFilter<"Product">
    status?: EnumProductStatusFilter<"Product"> | $Enums.ProductStatus
    images?: ProductImageListRelationFilter
    likes?: ProductLikeListRelationFilter
  }

  export type ProductOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    originalPrice?: SortOrder
    salePrice?: SortOrder
    notice?: SortOrderInput | SortOrder
    caution?: SortOrderInput | SortOrder
    basicIncluded?: SortOrderInput | SortOrder
    location?: SortOrderInput | SortOrder
    likeCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    orderFormSchema?: SortOrderInput | SortOrder
    detailDescription?: SortOrderInput | SortOrder
    productNumber?: SortOrder
    foodType?: SortOrder
    producer?: SortOrder
    manufactureDate?: SortOrder
    packageInfo?: SortOrder
    calories?: SortOrder
    ingredients?: SortOrder
    origin?: SortOrder
    customerService?: SortOrder
    mainCategory?: SortOrder
    subCategory?: SortOrder
    targetAudience?: SortOrder
    sizeRange?: SortOrder
    deliveryMethod?: SortOrder
    deliveryDays?: SortOrder
    hashtags?: SortOrder
    status?: SortOrder
    images?: ProductImageOrderByRelationAggregateInput
    likes?: ProductLikeOrderByRelationAggregateInput
  }

  export type ProductWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ProductWhereInput | ProductWhereInput[]
    OR?: ProductWhereInput[]
    NOT?: ProductWhereInput | ProductWhereInput[]
    name?: StringFilter<"Product"> | string
    description?: StringNullableFilter<"Product"> | string | null
    originalPrice?: IntFilter<"Product"> | number
    salePrice?: IntFilter<"Product"> | number
    notice?: StringNullableFilter<"Product"> | string | null
    caution?: StringNullableFilter<"Product"> | string | null
    basicIncluded?: StringNullableFilter<"Product"> | string | null
    location?: StringNullableFilter<"Product"> | string | null
    likeCount?: IntFilter<"Product"> | number
    createdAt?: DateTimeFilter<"Product"> | Date | string
    updatedAt?: DateTimeFilter<"Product"> | Date | string
    orderFormSchema?: JsonNullableFilter<"Product">
    detailDescription?: StringNullableFilter<"Product"> | string | null
    productNumber?: StringFilter<"Product"> | string
    foodType?: StringFilter<"Product"> | string
    producer?: StringFilter<"Product"> | string
    manufactureDate?: StringFilter<"Product"> | string
    packageInfo?: StringFilter<"Product"> | string
    calories?: StringFilter<"Product"> | string
    ingredients?: StringFilter<"Product"> | string
    origin?: StringFilter<"Product"> | string
    customerService?: StringFilter<"Product"> | string
    mainCategory?: EnumMainCategoryNullableListFilter<"Product">
    subCategory?: EnumSubCategoryNullableListFilter<"Product">
    targetAudience?: EnumTargetAudienceNullableListFilter<"Product">
    sizeRange?: EnumSizeRangeNullableListFilter<"Product">
    deliveryMethod?: EnumDeliveryMethodNullableListFilter<"Product">
    deliveryDays?: EnumDeliveryDaysNullableListFilter<"Product">
    hashtags?: StringNullableListFilter<"Product">
    status?: EnumProductStatusFilter<"Product"> | $Enums.ProductStatus
    images?: ProductImageListRelationFilter
    likes?: ProductLikeListRelationFilter
  }, "id">

  export type ProductOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    originalPrice?: SortOrder
    salePrice?: SortOrder
    notice?: SortOrderInput | SortOrder
    caution?: SortOrderInput | SortOrder
    basicIncluded?: SortOrderInput | SortOrder
    location?: SortOrderInput | SortOrder
    likeCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    orderFormSchema?: SortOrderInput | SortOrder
    detailDescription?: SortOrderInput | SortOrder
    productNumber?: SortOrder
    foodType?: SortOrder
    producer?: SortOrder
    manufactureDate?: SortOrder
    packageInfo?: SortOrder
    calories?: SortOrder
    ingredients?: SortOrder
    origin?: SortOrder
    customerService?: SortOrder
    mainCategory?: SortOrder
    subCategory?: SortOrder
    targetAudience?: SortOrder
    sizeRange?: SortOrder
    deliveryMethod?: SortOrder
    deliveryDays?: SortOrder
    hashtags?: SortOrder
    status?: SortOrder
    _count?: ProductCountOrderByAggregateInput
    _avg?: ProductAvgOrderByAggregateInput
    _max?: ProductMaxOrderByAggregateInput
    _min?: ProductMinOrderByAggregateInput
    _sum?: ProductSumOrderByAggregateInput
  }

  export type ProductScalarWhereWithAggregatesInput = {
    AND?: ProductScalarWhereWithAggregatesInput | ProductScalarWhereWithAggregatesInput[]
    OR?: ProductScalarWhereWithAggregatesInput[]
    NOT?: ProductScalarWhereWithAggregatesInput | ProductScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Product"> | string
    name?: StringWithAggregatesFilter<"Product"> | string
    description?: StringNullableWithAggregatesFilter<"Product"> | string | null
    originalPrice?: IntWithAggregatesFilter<"Product"> | number
    salePrice?: IntWithAggregatesFilter<"Product"> | number
    notice?: StringNullableWithAggregatesFilter<"Product"> | string | null
    caution?: StringNullableWithAggregatesFilter<"Product"> | string | null
    basicIncluded?: StringNullableWithAggregatesFilter<"Product"> | string | null
    location?: StringNullableWithAggregatesFilter<"Product"> | string | null
    likeCount?: IntWithAggregatesFilter<"Product"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Product"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Product"> | Date | string
    orderFormSchema?: JsonNullableWithAggregatesFilter<"Product">
    detailDescription?: StringNullableWithAggregatesFilter<"Product"> | string | null
    productNumber?: StringWithAggregatesFilter<"Product"> | string
    foodType?: StringWithAggregatesFilter<"Product"> | string
    producer?: StringWithAggregatesFilter<"Product"> | string
    manufactureDate?: StringWithAggregatesFilter<"Product"> | string
    packageInfo?: StringWithAggregatesFilter<"Product"> | string
    calories?: StringWithAggregatesFilter<"Product"> | string
    ingredients?: StringWithAggregatesFilter<"Product"> | string
    origin?: StringWithAggregatesFilter<"Product"> | string
    customerService?: StringWithAggregatesFilter<"Product"> | string
    mainCategory?: EnumMainCategoryNullableListFilter<"Product">
    subCategory?: EnumSubCategoryNullableListFilter<"Product">
    targetAudience?: EnumTargetAudienceNullableListFilter<"Product">
    sizeRange?: EnumSizeRangeNullableListFilter<"Product">
    deliveryMethod?: EnumDeliveryMethodNullableListFilter<"Product">
    deliveryDays?: EnumDeliveryDaysNullableListFilter<"Product">
    hashtags?: StringNullableListFilter<"Product">
    status?: EnumProductStatusWithAggregatesFilter<"Product"> | $Enums.ProductStatus
  }

  export type ProductImageWhereInput = {
    AND?: ProductImageWhereInput | ProductImageWhereInput[]
    OR?: ProductImageWhereInput[]
    NOT?: ProductImageWhereInput | ProductImageWhereInput[]
    id?: StringFilter<"ProductImage"> | string
    url?: StringFilter<"ProductImage"> | string
    alt?: StringNullableFilter<"ProductImage"> | string | null
    order?: IntFilter<"ProductImage"> | number
    productId?: StringFilter<"ProductImage"> | string
    createdAt?: DateTimeFilter<"ProductImage"> | Date | string
    product?: XOR<ProductScalarRelationFilter, ProductWhereInput>
  }

  export type ProductImageOrderByWithRelationInput = {
    id?: SortOrder
    url?: SortOrder
    alt?: SortOrderInput | SortOrder
    order?: SortOrder
    productId?: SortOrder
    createdAt?: SortOrder
    product?: ProductOrderByWithRelationInput
  }

  export type ProductImageWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ProductImageWhereInput | ProductImageWhereInput[]
    OR?: ProductImageWhereInput[]
    NOT?: ProductImageWhereInput | ProductImageWhereInput[]
    url?: StringFilter<"ProductImage"> | string
    alt?: StringNullableFilter<"ProductImage"> | string | null
    order?: IntFilter<"ProductImage"> | number
    productId?: StringFilter<"ProductImage"> | string
    createdAt?: DateTimeFilter<"ProductImage"> | Date | string
    product?: XOR<ProductScalarRelationFilter, ProductWhereInput>
  }, "id">

  export type ProductImageOrderByWithAggregationInput = {
    id?: SortOrder
    url?: SortOrder
    alt?: SortOrderInput | SortOrder
    order?: SortOrder
    productId?: SortOrder
    createdAt?: SortOrder
    _count?: ProductImageCountOrderByAggregateInput
    _avg?: ProductImageAvgOrderByAggregateInput
    _max?: ProductImageMaxOrderByAggregateInput
    _min?: ProductImageMinOrderByAggregateInput
    _sum?: ProductImageSumOrderByAggregateInput
  }

  export type ProductImageScalarWhereWithAggregatesInput = {
    AND?: ProductImageScalarWhereWithAggregatesInput | ProductImageScalarWhereWithAggregatesInput[]
    OR?: ProductImageScalarWhereWithAggregatesInput[]
    NOT?: ProductImageScalarWhereWithAggregatesInput | ProductImageScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ProductImage"> | string
    url?: StringWithAggregatesFilter<"ProductImage"> | string
    alt?: StringNullableWithAggregatesFilter<"ProductImage"> | string | null
    order?: IntWithAggregatesFilter<"ProductImage"> | number
    productId?: StringWithAggregatesFilter<"ProductImage"> | string
    createdAt?: DateTimeWithAggregatesFilter<"ProductImage"> | Date | string
  }

  export type ProductLikeWhereInput = {
    AND?: ProductLikeWhereInput | ProductLikeWhereInput[]
    OR?: ProductLikeWhereInput[]
    NOT?: ProductLikeWhereInput | ProductLikeWhereInput[]
    id?: StringFilter<"ProductLike"> | string
    userId?: StringFilter<"ProductLike"> | string
    productId?: StringFilter<"ProductLike"> | string
    createdAt?: DateTimeFilter<"ProductLike"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    product?: XOR<ProductScalarRelationFilter, ProductWhereInput>
  }

  export type ProductLikeOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    productId?: SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
    product?: ProductOrderByWithRelationInput
  }

  export type ProductLikeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_productId?: ProductLikeUserIdProductIdCompoundUniqueInput
    AND?: ProductLikeWhereInput | ProductLikeWhereInput[]
    OR?: ProductLikeWhereInput[]
    NOT?: ProductLikeWhereInput | ProductLikeWhereInput[]
    userId?: StringFilter<"ProductLike"> | string
    productId?: StringFilter<"ProductLike"> | string
    createdAt?: DateTimeFilter<"ProductLike"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    product?: XOR<ProductScalarRelationFilter, ProductWhereInput>
  }, "id" | "userId_productId">

  export type ProductLikeOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    productId?: SortOrder
    createdAt?: SortOrder
    _count?: ProductLikeCountOrderByAggregateInput
    _max?: ProductLikeMaxOrderByAggregateInput
    _min?: ProductLikeMinOrderByAggregateInput
  }

  export type ProductLikeScalarWhereWithAggregatesInput = {
    AND?: ProductLikeScalarWhereWithAggregatesInput | ProductLikeScalarWhereWithAggregatesInput[]
    OR?: ProductLikeScalarWhereWithAggregatesInput[]
    NOT?: ProductLikeScalarWhereWithAggregatesInput | ProductLikeScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ProductLike"> | string
    userId?: StringWithAggregatesFilter<"ProductLike"> | string
    productId?: StringWithAggregatesFilter<"ProductLike"> | string
    createdAt?: DateTimeWithAggregatesFilter<"ProductLike"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    phone: string
    passwordHash?: string | null
    name?: string | null
    nickname?: string | null
    email?: string | null
    profileImageUrl?: string | null
    isPhoneVerified?: boolean
    isActive?: boolean
    userId?: string | null
    googleId?: string | null
    googleEmail?: string | null
    createdAt?: Date | string
    lastLoginAt?: Date | string | null
    productLikes?: ProductLikeCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    phone: string
    passwordHash?: string | null
    name?: string | null
    nickname?: string | null
    email?: string | null
    profileImageUrl?: string | null
    isPhoneVerified?: boolean
    isActive?: boolean
    userId?: string | null
    googleId?: string | null
    googleEmail?: string | null
    createdAt?: Date | string
    lastLoginAt?: Date | string | null
    productLikes?: ProductLikeUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    profileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isPhoneVerified?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    googleId?: NullableStringFieldUpdateOperationsInput | string | null
    googleEmail?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    productLikes?: ProductLikeUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    profileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isPhoneVerified?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    googleId?: NullableStringFieldUpdateOperationsInput | string | null
    googleEmail?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    productLikes?: ProductLikeUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    phone: string
    passwordHash?: string | null
    name?: string | null
    nickname?: string | null
    email?: string | null
    profileImageUrl?: string | null
    isPhoneVerified?: boolean
    isActive?: boolean
    userId?: string | null
    googleId?: string | null
    googleEmail?: string | null
    createdAt?: Date | string
    lastLoginAt?: Date | string | null
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    profileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isPhoneVerified?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    googleId?: NullableStringFieldUpdateOperationsInput | string | null
    googleEmail?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    profileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isPhoneVerified?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    googleId?: NullableStringFieldUpdateOperationsInput | string | null
    googleEmail?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PhoneVerificationCreateInput = {
    id?: string
    phone: string
    verificationCode: string
    expiresAt: Date | string
    isVerified?: boolean
    purpose?: string
    userId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PhoneVerificationUncheckedCreateInput = {
    id?: string
    phone: string
    verificationCode: string
    expiresAt: Date | string
    isVerified?: boolean
    purpose?: string
    userId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PhoneVerificationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    verificationCode?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    purpose?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PhoneVerificationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    verificationCode?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    purpose?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PhoneVerificationCreateManyInput = {
    id?: string
    phone: string
    verificationCode: string
    expiresAt: Date | string
    isVerified?: boolean
    purpose?: string
    userId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PhoneVerificationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    verificationCode?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    purpose?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PhoneVerificationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    verificationCode?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    purpose?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductCreateInput = {
    id?: string
    name: string
    description?: string | null
    originalPrice: number
    salePrice: number
    notice?: string | null
    caution?: string | null
    basicIncluded?: string | null
    location?: string | null
    likeCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    orderFormSchema?: NullableJsonNullValueInput | InputJsonValue
    detailDescription?: string | null
    productNumber: string
    foodType: string
    producer: string
    manufactureDate: string
    packageInfo: string
    calories: string
    ingredients: string
    origin: string
    customerService: string
    mainCategory?: ProductCreatemainCategoryInput | $Enums.MainCategory[]
    subCategory?: ProductCreatesubCategoryInput | $Enums.SubCategory[]
    targetAudience?: ProductCreatetargetAudienceInput | $Enums.TargetAudience[]
    sizeRange?: ProductCreatesizeRangeInput | $Enums.SizeRange[]
    deliveryMethod?: ProductCreatedeliveryMethodInput | $Enums.DeliveryMethod[]
    deliveryDays?: ProductCreatedeliveryDaysInput | $Enums.DeliveryDays[]
    hashtags?: ProductCreatehashtagsInput | string[]
    status?: $Enums.ProductStatus
    images?: ProductImageCreateNestedManyWithoutProductInput
    likes?: ProductLikeCreateNestedManyWithoutProductInput
  }

  export type ProductUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    originalPrice: number
    salePrice: number
    notice?: string | null
    caution?: string | null
    basicIncluded?: string | null
    location?: string | null
    likeCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    orderFormSchema?: NullableJsonNullValueInput | InputJsonValue
    detailDescription?: string | null
    productNumber: string
    foodType: string
    producer: string
    manufactureDate: string
    packageInfo: string
    calories: string
    ingredients: string
    origin: string
    customerService: string
    mainCategory?: ProductCreatemainCategoryInput | $Enums.MainCategory[]
    subCategory?: ProductCreatesubCategoryInput | $Enums.SubCategory[]
    targetAudience?: ProductCreatetargetAudienceInput | $Enums.TargetAudience[]
    sizeRange?: ProductCreatesizeRangeInput | $Enums.SizeRange[]
    deliveryMethod?: ProductCreatedeliveryMethodInput | $Enums.DeliveryMethod[]
    deliveryDays?: ProductCreatedeliveryDaysInput | $Enums.DeliveryDays[]
    hashtags?: ProductCreatehashtagsInput | string[]
    status?: $Enums.ProductStatus
    images?: ProductImageUncheckedCreateNestedManyWithoutProductInput
    likes?: ProductLikeUncheckedCreateNestedManyWithoutProductInput
  }

  export type ProductUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    originalPrice?: IntFieldUpdateOperationsInput | number
    salePrice?: IntFieldUpdateOperationsInput | number
    notice?: NullableStringFieldUpdateOperationsInput | string | null
    caution?: NullableStringFieldUpdateOperationsInput | string | null
    basicIncluded?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    likeCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    orderFormSchema?: NullableJsonNullValueInput | InputJsonValue
    detailDescription?: NullableStringFieldUpdateOperationsInput | string | null
    productNumber?: StringFieldUpdateOperationsInput | string
    foodType?: StringFieldUpdateOperationsInput | string
    producer?: StringFieldUpdateOperationsInput | string
    manufactureDate?: StringFieldUpdateOperationsInput | string
    packageInfo?: StringFieldUpdateOperationsInput | string
    calories?: StringFieldUpdateOperationsInput | string
    ingredients?: StringFieldUpdateOperationsInput | string
    origin?: StringFieldUpdateOperationsInput | string
    customerService?: StringFieldUpdateOperationsInput | string
    mainCategory?: ProductUpdatemainCategoryInput | $Enums.MainCategory[]
    subCategory?: ProductUpdatesubCategoryInput | $Enums.SubCategory[]
    targetAudience?: ProductUpdatetargetAudienceInput | $Enums.TargetAudience[]
    sizeRange?: ProductUpdatesizeRangeInput | $Enums.SizeRange[]
    deliveryMethod?: ProductUpdatedeliveryMethodInput | $Enums.DeliveryMethod[]
    deliveryDays?: ProductUpdatedeliveryDaysInput | $Enums.DeliveryDays[]
    hashtags?: ProductUpdatehashtagsInput | string[]
    status?: EnumProductStatusFieldUpdateOperationsInput | $Enums.ProductStatus
    images?: ProductImageUpdateManyWithoutProductNestedInput
    likes?: ProductLikeUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    originalPrice?: IntFieldUpdateOperationsInput | number
    salePrice?: IntFieldUpdateOperationsInput | number
    notice?: NullableStringFieldUpdateOperationsInput | string | null
    caution?: NullableStringFieldUpdateOperationsInput | string | null
    basicIncluded?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    likeCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    orderFormSchema?: NullableJsonNullValueInput | InputJsonValue
    detailDescription?: NullableStringFieldUpdateOperationsInput | string | null
    productNumber?: StringFieldUpdateOperationsInput | string
    foodType?: StringFieldUpdateOperationsInput | string
    producer?: StringFieldUpdateOperationsInput | string
    manufactureDate?: StringFieldUpdateOperationsInput | string
    packageInfo?: StringFieldUpdateOperationsInput | string
    calories?: StringFieldUpdateOperationsInput | string
    ingredients?: StringFieldUpdateOperationsInput | string
    origin?: StringFieldUpdateOperationsInput | string
    customerService?: StringFieldUpdateOperationsInput | string
    mainCategory?: ProductUpdatemainCategoryInput | $Enums.MainCategory[]
    subCategory?: ProductUpdatesubCategoryInput | $Enums.SubCategory[]
    targetAudience?: ProductUpdatetargetAudienceInput | $Enums.TargetAudience[]
    sizeRange?: ProductUpdatesizeRangeInput | $Enums.SizeRange[]
    deliveryMethod?: ProductUpdatedeliveryMethodInput | $Enums.DeliveryMethod[]
    deliveryDays?: ProductUpdatedeliveryDaysInput | $Enums.DeliveryDays[]
    hashtags?: ProductUpdatehashtagsInput | string[]
    status?: EnumProductStatusFieldUpdateOperationsInput | $Enums.ProductStatus
    images?: ProductImageUncheckedUpdateManyWithoutProductNestedInput
    likes?: ProductLikeUncheckedUpdateManyWithoutProductNestedInput
  }

  export type ProductCreateManyInput = {
    id?: string
    name: string
    description?: string | null
    originalPrice: number
    salePrice: number
    notice?: string | null
    caution?: string | null
    basicIncluded?: string | null
    location?: string | null
    likeCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    orderFormSchema?: NullableJsonNullValueInput | InputJsonValue
    detailDescription?: string | null
    productNumber: string
    foodType: string
    producer: string
    manufactureDate: string
    packageInfo: string
    calories: string
    ingredients: string
    origin: string
    customerService: string
    mainCategory?: ProductCreatemainCategoryInput | $Enums.MainCategory[]
    subCategory?: ProductCreatesubCategoryInput | $Enums.SubCategory[]
    targetAudience?: ProductCreatetargetAudienceInput | $Enums.TargetAudience[]
    sizeRange?: ProductCreatesizeRangeInput | $Enums.SizeRange[]
    deliveryMethod?: ProductCreatedeliveryMethodInput | $Enums.DeliveryMethod[]
    deliveryDays?: ProductCreatedeliveryDaysInput | $Enums.DeliveryDays[]
    hashtags?: ProductCreatehashtagsInput | string[]
    status?: $Enums.ProductStatus
  }

  export type ProductUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    originalPrice?: IntFieldUpdateOperationsInput | number
    salePrice?: IntFieldUpdateOperationsInput | number
    notice?: NullableStringFieldUpdateOperationsInput | string | null
    caution?: NullableStringFieldUpdateOperationsInput | string | null
    basicIncluded?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    likeCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    orderFormSchema?: NullableJsonNullValueInput | InputJsonValue
    detailDescription?: NullableStringFieldUpdateOperationsInput | string | null
    productNumber?: StringFieldUpdateOperationsInput | string
    foodType?: StringFieldUpdateOperationsInput | string
    producer?: StringFieldUpdateOperationsInput | string
    manufactureDate?: StringFieldUpdateOperationsInput | string
    packageInfo?: StringFieldUpdateOperationsInput | string
    calories?: StringFieldUpdateOperationsInput | string
    ingredients?: StringFieldUpdateOperationsInput | string
    origin?: StringFieldUpdateOperationsInput | string
    customerService?: StringFieldUpdateOperationsInput | string
    mainCategory?: ProductUpdatemainCategoryInput | $Enums.MainCategory[]
    subCategory?: ProductUpdatesubCategoryInput | $Enums.SubCategory[]
    targetAudience?: ProductUpdatetargetAudienceInput | $Enums.TargetAudience[]
    sizeRange?: ProductUpdatesizeRangeInput | $Enums.SizeRange[]
    deliveryMethod?: ProductUpdatedeliveryMethodInput | $Enums.DeliveryMethod[]
    deliveryDays?: ProductUpdatedeliveryDaysInput | $Enums.DeliveryDays[]
    hashtags?: ProductUpdatehashtagsInput | string[]
    status?: EnumProductStatusFieldUpdateOperationsInput | $Enums.ProductStatus
  }

  export type ProductUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    originalPrice?: IntFieldUpdateOperationsInput | number
    salePrice?: IntFieldUpdateOperationsInput | number
    notice?: NullableStringFieldUpdateOperationsInput | string | null
    caution?: NullableStringFieldUpdateOperationsInput | string | null
    basicIncluded?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    likeCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    orderFormSchema?: NullableJsonNullValueInput | InputJsonValue
    detailDescription?: NullableStringFieldUpdateOperationsInput | string | null
    productNumber?: StringFieldUpdateOperationsInput | string
    foodType?: StringFieldUpdateOperationsInput | string
    producer?: StringFieldUpdateOperationsInput | string
    manufactureDate?: StringFieldUpdateOperationsInput | string
    packageInfo?: StringFieldUpdateOperationsInput | string
    calories?: StringFieldUpdateOperationsInput | string
    ingredients?: StringFieldUpdateOperationsInput | string
    origin?: StringFieldUpdateOperationsInput | string
    customerService?: StringFieldUpdateOperationsInput | string
    mainCategory?: ProductUpdatemainCategoryInput | $Enums.MainCategory[]
    subCategory?: ProductUpdatesubCategoryInput | $Enums.SubCategory[]
    targetAudience?: ProductUpdatetargetAudienceInput | $Enums.TargetAudience[]
    sizeRange?: ProductUpdatesizeRangeInput | $Enums.SizeRange[]
    deliveryMethod?: ProductUpdatedeliveryMethodInput | $Enums.DeliveryMethod[]
    deliveryDays?: ProductUpdatedeliveryDaysInput | $Enums.DeliveryDays[]
    hashtags?: ProductUpdatehashtagsInput | string[]
    status?: EnumProductStatusFieldUpdateOperationsInput | $Enums.ProductStatus
  }

  export type ProductImageCreateInput = {
    id?: string
    url: string
    alt?: string | null
    order?: number
    createdAt?: Date | string
    product: ProductCreateNestedOneWithoutImagesInput
  }

  export type ProductImageUncheckedCreateInput = {
    id?: string
    url: string
    alt?: string | null
    order?: number
    productId: string
    createdAt?: Date | string
  }

  export type ProductImageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    alt?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    product?: ProductUpdateOneRequiredWithoutImagesNestedInput
  }

  export type ProductImageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    alt?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    productId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductImageCreateManyInput = {
    id?: string
    url: string
    alt?: string | null
    order?: number
    productId: string
    createdAt?: Date | string
  }

  export type ProductImageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    alt?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductImageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    alt?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    productId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductLikeCreateInput = {
    id?: string
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutProductLikesInput
    product: ProductCreateNestedOneWithoutLikesInput
  }

  export type ProductLikeUncheckedCreateInput = {
    id?: string
    userId: string
    productId: string
    createdAt?: Date | string
  }

  export type ProductLikeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutProductLikesNestedInput
    product?: ProductUpdateOneRequiredWithoutLikesNestedInput
  }

  export type ProductLikeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductLikeCreateManyInput = {
    id?: string
    userId: string
    productId: string
    createdAt?: Date | string
  }

  export type ProductLikeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductLikeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type ProductLikeListRelationFilter = {
    every?: ProductLikeWhereInput
    some?: ProductLikeWhereInput
    none?: ProductLikeWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ProductLikeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    phone?: SortOrder
    passwordHash?: SortOrder
    name?: SortOrder
    nickname?: SortOrder
    email?: SortOrder
    profileImageUrl?: SortOrder
    isPhoneVerified?: SortOrder
    isActive?: SortOrder
    userId?: SortOrder
    googleId?: SortOrder
    googleEmail?: SortOrder
    createdAt?: SortOrder
    lastLoginAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    phone?: SortOrder
    passwordHash?: SortOrder
    name?: SortOrder
    nickname?: SortOrder
    email?: SortOrder
    profileImageUrl?: SortOrder
    isPhoneVerified?: SortOrder
    isActive?: SortOrder
    userId?: SortOrder
    googleId?: SortOrder
    googleEmail?: SortOrder
    createdAt?: SortOrder
    lastLoginAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    phone?: SortOrder
    passwordHash?: SortOrder
    name?: SortOrder
    nickname?: SortOrder
    email?: SortOrder
    profileImageUrl?: SortOrder
    isPhoneVerified?: SortOrder
    isActive?: SortOrder
    userId?: SortOrder
    googleId?: SortOrder
    googleEmail?: SortOrder
    createdAt?: SortOrder
    lastLoginAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type PhoneVerificationPhoneVerificationCodeCompoundUniqueInput = {
    phone: string
    verificationCode: string
  }

  export type PhoneVerificationCountOrderByAggregateInput = {
    id?: SortOrder
    phone?: SortOrder
    verificationCode?: SortOrder
    expiresAt?: SortOrder
    isVerified?: SortOrder
    purpose?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PhoneVerificationMaxOrderByAggregateInput = {
    id?: SortOrder
    phone?: SortOrder
    verificationCode?: SortOrder
    expiresAt?: SortOrder
    isVerified?: SortOrder
    purpose?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PhoneVerificationMinOrderByAggregateInput = {
    id?: SortOrder
    phone?: SortOrder
    verificationCode?: SortOrder
    expiresAt?: SortOrder
    isVerified?: SortOrder
    purpose?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type EnumMainCategoryNullableListFilter<$PrismaModel = never> = {
    equals?: $Enums.MainCategory[] | ListEnumMainCategoryFieldRefInput<$PrismaModel> | null
    has?: $Enums.MainCategory | EnumMainCategoryFieldRefInput<$PrismaModel> | null
    hasEvery?: $Enums.MainCategory[] | ListEnumMainCategoryFieldRefInput<$PrismaModel>
    hasSome?: $Enums.MainCategory[] | ListEnumMainCategoryFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type EnumSubCategoryNullableListFilter<$PrismaModel = never> = {
    equals?: $Enums.SubCategory[] | ListEnumSubCategoryFieldRefInput<$PrismaModel> | null
    has?: $Enums.SubCategory | EnumSubCategoryFieldRefInput<$PrismaModel> | null
    hasEvery?: $Enums.SubCategory[] | ListEnumSubCategoryFieldRefInput<$PrismaModel>
    hasSome?: $Enums.SubCategory[] | ListEnumSubCategoryFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type EnumTargetAudienceNullableListFilter<$PrismaModel = never> = {
    equals?: $Enums.TargetAudience[] | ListEnumTargetAudienceFieldRefInput<$PrismaModel> | null
    has?: $Enums.TargetAudience | EnumTargetAudienceFieldRefInput<$PrismaModel> | null
    hasEvery?: $Enums.TargetAudience[] | ListEnumTargetAudienceFieldRefInput<$PrismaModel>
    hasSome?: $Enums.TargetAudience[] | ListEnumTargetAudienceFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type EnumSizeRangeNullableListFilter<$PrismaModel = never> = {
    equals?: $Enums.SizeRange[] | ListEnumSizeRangeFieldRefInput<$PrismaModel> | null
    has?: $Enums.SizeRange | EnumSizeRangeFieldRefInput<$PrismaModel> | null
    hasEvery?: $Enums.SizeRange[] | ListEnumSizeRangeFieldRefInput<$PrismaModel>
    hasSome?: $Enums.SizeRange[] | ListEnumSizeRangeFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type EnumDeliveryMethodNullableListFilter<$PrismaModel = never> = {
    equals?: $Enums.DeliveryMethod[] | ListEnumDeliveryMethodFieldRefInput<$PrismaModel> | null
    has?: $Enums.DeliveryMethod | EnumDeliveryMethodFieldRefInput<$PrismaModel> | null
    hasEvery?: $Enums.DeliveryMethod[] | ListEnumDeliveryMethodFieldRefInput<$PrismaModel>
    hasSome?: $Enums.DeliveryMethod[] | ListEnumDeliveryMethodFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type EnumDeliveryDaysNullableListFilter<$PrismaModel = never> = {
    equals?: $Enums.DeliveryDays[] | ListEnumDeliveryDaysFieldRefInput<$PrismaModel> | null
    has?: $Enums.DeliveryDays | EnumDeliveryDaysFieldRefInput<$PrismaModel> | null
    hasEvery?: $Enums.DeliveryDays[] | ListEnumDeliveryDaysFieldRefInput<$PrismaModel>
    hasSome?: $Enums.DeliveryDays[] | ListEnumDeliveryDaysFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type EnumProductStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ProductStatus | EnumProductStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ProductStatus[] | ListEnumProductStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProductStatus[] | ListEnumProductStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumProductStatusFilter<$PrismaModel> | $Enums.ProductStatus
  }

  export type ProductImageListRelationFilter = {
    every?: ProductImageWhereInput
    some?: ProductImageWhereInput
    none?: ProductImageWhereInput
  }

  export type ProductImageOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProductCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    originalPrice?: SortOrder
    salePrice?: SortOrder
    notice?: SortOrder
    caution?: SortOrder
    basicIncluded?: SortOrder
    location?: SortOrder
    likeCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    orderFormSchema?: SortOrder
    detailDescription?: SortOrder
    productNumber?: SortOrder
    foodType?: SortOrder
    producer?: SortOrder
    manufactureDate?: SortOrder
    packageInfo?: SortOrder
    calories?: SortOrder
    ingredients?: SortOrder
    origin?: SortOrder
    customerService?: SortOrder
    mainCategory?: SortOrder
    subCategory?: SortOrder
    targetAudience?: SortOrder
    sizeRange?: SortOrder
    deliveryMethod?: SortOrder
    deliveryDays?: SortOrder
    hashtags?: SortOrder
    status?: SortOrder
  }

  export type ProductAvgOrderByAggregateInput = {
    originalPrice?: SortOrder
    salePrice?: SortOrder
    likeCount?: SortOrder
  }

  export type ProductMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    originalPrice?: SortOrder
    salePrice?: SortOrder
    notice?: SortOrder
    caution?: SortOrder
    basicIncluded?: SortOrder
    location?: SortOrder
    likeCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    detailDescription?: SortOrder
    productNumber?: SortOrder
    foodType?: SortOrder
    producer?: SortOrder
    manufactureDate?: SortOrder
    packageInfo?: SortOrder
    calories?: SortOrder
    ingredients?: SortOrder
    origin?: SortOrder
    customerService?: SortOrder
    status?: SortOrder
  }

  export type ProductMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    originalPrice?: SortOrder
    salePrice?: SortOrder
    notice?: SortOrder
    caution?: SortOrder
    basicIncluded?: SortOrder
    location?: SortOrder
    likeCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    detailDescription?: SortOrder
    productNumber?: SortOrder
    foodType?: SortOrder
    producer?: SortOrder
    manufactureDate?: SortOrder
    packageInfo?: SortOrder
    calories?: SortOrder
    ingredients?: SortOrder
    origin?: SortOrder
    customerService?: SortOrder
    status?: SortOrder
  }

  export type ProductSumOrderByAggregateInput = {
    originalPrice?: SortOrder
    salePrice?: SortOrder
    likeCount?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type EnumProductStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ProductStatus | EnumProductStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ProductStatus[] | ListEnumProductStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProductStatus[] | ListEnumProductStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumProductStatusWithAggregatesFilter<$PrismaModel> | $Enums.ProductStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumProductStatusFilter<$PrismaModel>
    _max?: NestedEnumProductStatusFilter<$PrismaModel>
  }

  export type ProductScalarRelationFilter = {
    is?: ProductWhereInput
    isNot?: ProductWhereInput
  }

  export type ProductImageCountOrderByAggregateInput = {
    id?: SortOrder
    url?: SortOrder
    alt?: SortOrder
    order?: SortOrder
    productId?: SortOrder
    createdAt?: SortOrder
  }

  export type ProductImageAvgOrderByAggregateInput = {
    order?: SortOrder
  }

  export type ProductImageMaxOrderByAggregateInput = {
    id?: SortOrder
    url?: SortOrder
    alt?: SortOrder
    order?: SortOrder
    productId?: SortOrder
    createdAt?: SortOrder
  }

  export type ProductImageMinOrderByAggregateInput = {
    id?: SortOrder
    url?: SortOrder
    alt?: SortOrder
    order?: SortOrder
    productId?: SortOrder
    createdAt?: SortOrder
  }

  export type ProductImageSumOrderByAggregateInput = {
    order?: SortOrder
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type ProductLikeUserIdProductIdCompoundUniqueInput = {
    userId: string
    productId: string
  }

  export type ProductLikeCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    productId?: SortOrder
    createdAt?: SortOrder
  }

  export type ProductLikeMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    productId?: SortOrder
    createdAt?: SortOrder
  }

  export type ProductLikeMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    productId?: SortOrder
    createdAt?: SortOrder
  }

  export type ProductLikeCreateNestedManyWithoutUserInput = {
    create?: XOR<ProductLikeCreateWithoutUserInput, ProductLikeUncheckedCreateWithoutUserInput> | ProductLikeCreateWithoutUserInput[] | ProductLikeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ProductLikeCreateOrConnectWithoutUserInput | ProductLikeCreateOrConnectWithoutUserInput[]
    createMany?: ProductLikeCreateManyUserInputEnvelope
    connect?: ProductLikeWhereUniqueInput | ProductLikeWhereUniqueInput[]
  }

  export type ProductLikeUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ProductLikeCreateWithoutUserInput, ProductLikeUncheckedCreateWithoutUserInput> | ProductLikeCreateWithoutUserInput[] | ProductLikeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ProductLikeCreateOrConnectWithoutUserInput | ProductLikeCreateOrConnectWithoutUserInput[]
    createMany?: ProductLikeCreateManyUserInputEnvelope
    connect?: ProductLikeWhereUniqueInput | ProductLikeWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type ProductLikeUpdateManyWithoutUserNestedInput = {
    create?: XOR<ProductLikeCreateWithoutUserInput, ProductLikeUncheckedCreateWithoutUserInput> | ProductLikeCreateWithoutUserInput[] | ProductLikeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ProductLikeCreateOrConnectWithoutUserInput | ProductLikeCreateOrConnectWithoutUserInput[]
    upsert?: ProductLikeUpsertWithWhereUniqueWithoutUserInput | ProductLikeUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ProductLikeCreateManyUserInputEnvelope
    set?: ProductLikeWhereUniqueInput | ProductLikeWhereUniqueInput[]
    disconnect?: ProductLikeWhereUniqueInput | ProductLikeWhereUniqueInput[]
    delete?: ProductLikeWhereUniqueInput | ProductLikeWhereUniqueInput[]
    connect?: ProductLikeWhereUniqueInput | ProductLikeWhereUniqueInput[]
    update?: ProductLikeUpdateWithWhereUniqueWithoutUserInput | ProductLikeUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ProductLikeUpdateManyWithWhereWithoutUserInput | ProductLikeUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ProductLikeScalarWhereInput | ProductLikeScalarWhereInput[]
  }

  export type ProductLikeUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ProductLikeCreateWithoutUserInput, ProductLikeUncheckedCreateWithoutUserInput> | ProductLikeCreateWithoutUserInput[] | ProductLikeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ProductLikeCreateOrConnectWithoutUserInput | ProductLikeCreateOrConnectWithoutUserInput[]
    upsert?: ProductLikeUpsertWithWhereUniqueWithoutUserInput | ProductLikeUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ProductLikeCreateManyUserInputEnvelope
    set?: ProductLikeWhereUniqueInput | ProductLikeWhereUniqueInput[]
    disconnect?: ProductLikeWhereUniqueInput | ProductLikeWhereUniqueInput[]
    delete?: ProductLikeWhereUniqueInput | ProductLikeWhereUniqueInput[]
    connect?: ProductLikeWhereUniqueInput | ProductLikeWhereUniqueInput[]
    update?: ProductLikeUpdateWithWhereUniqueWithoutUserInput | ProductLikeUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ProductLikeUpdateManyWithWhereWithoutUserInput | ProductLikeUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ProductLikeScalarWhereInput | ProductLikeScalarWhereInput[]
  }

  export type ProductCreatemainCategoryInput = {
    set: $Enums.MainCategory[]
  }

  export type ProductCreatesubCategoryInput = {
    set: $Enums.SubCategory[]
  }

  export type ProductCreatetargetAudienceInput = {
    set: $Enums.TargetAudience[]
  }

  export type ProductCreatesizeRangeInput = {
    set: $Enums.SizeRange[]
  }

  export type ProductCreatedeliveryMethodInput = {
    set: $Enums.DeliveryMethod[]
  }

  export type ProductCreatedeliveryDaysInput = {
    set: $Enums.DeliveryDays[]
  }

  export type ProductCreatehashtagsInput = {
    set: string[]
  }

  export type ProductImageCreateNestedManyWithoutProductInput = {
    create?: XOR<ProductImageCreateWithoutProductInput, ProductImageUncheckedCreateWithoutProductInput> | ProductImageCreateWithoutProductInput[] | ProductImageUncheckedCreateWithoutProductInput[]
    connectOrCreate?: ProductImageCreateOrConnectWithoutProductInput | ProductImageCreateOrConnectWithoutProductInput[]
    createMany?: ProductImageCreateManyProductInputEnvelope
    connect?: ProductImageWhereUniqueInput | ProductImageWhereUniqueInput[]
  }

  export type ProductLikeCreateNestedManyWithoutProductInput = {
    create?: XOR<ProductLikeCreateWithoutProductInput, ProductLikeUncheckedCreateWithoutProductInput> | ProductLikeCreateWithoutProductInput[] | ProductLikeUncheckedCreateWithoutProductInput[]
    connectOrCreate?: ProductLikeCreateOrConnectWithoutProductInput | ProductLikeCreateOrConnectWithoutProductInput[]
    createMany?: ProductLikeCreateManyProductInputEnvelope
    connect?: ProductLikeWhereUniqueInput | ProductLikeWhereUniqueInput[]
  }

  export type ProductImageUncheckedCreateNestedManyWithoutProductInput = {
    create?: XOR<ProductImageCreateWithoutProductInput, ProductImageUncheckedCreateWithoutProductInput> | ProductImageCreateWithoutProductInput[] | ProductImageUncheckedCreateWithoutProductInput[]
    connectOrCreate?: ProductImageCreateOrConnectWithoutProductInput | ProductImageCreateOrConnectWithoutProductInput[]
    createMany?: ProductImageCreateManyProductInputEnvelope
    connect?: ProductImageWhereUniqueInput | ProductImageWhereUniqueInput[]
  }

  export type ProductLikeUncheckedCreateNestedManyWithoutProductInput = {
    create?: XOR<ProductLikeCreateWithoutProductInput, ProductLikeUncheckedCreateWithoutProductInput> | ProductLikeCreateWithoutProductInput[] | ProductLikeUncheckedCreateWithoutProductInput[]
    connectOrCreate?: ProductLikeCreateOrConnectWithoutProductInput | ProductLikeCreateOrConnectWithoutProductInput[]
    createMany?: ProductLikeCreateManyProductInputEnvelope
    connect?: ProductLikeWhereUniqueInput | ProductLikeWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ProductUpdatemainCategoryInput = {
    set?: $Enums.MainCategory[]
    push?: $Enums.MainCategory | $Enums.MainCategory[]
  }

  export type ProductUpdatesubCategoryInput = {
    set?: $Enums.SubCategory[]
    push?: $Enums.SubCategory | $Enums.SubCategory[]
  }

  export type ProductUpdatetargetAudienceInput = {
    set?: $Enums.TargetAudience[]
    push?: $Enums.TargetAudience | $Enums.TargetAudience[]
  }

  export type ProductUpdatesizeRangeInput = {
    set?: $Enums.SizeRange[]
    push?: $Enums.SizeRange | $Enums.SizeRange[]
  }

  export type ProductUpdatedeliveryMethodInput = {
    set?: $Enums.DeliveryMethod[]
    push?: $Enums.DeliveryMethod | $Enums.DeliveryMethod[]
  }

  export type ProductUpdatedeliveryDaysInput = {
    set?: $Enums.DeliveryDays[]
    push?: $Enums.DeliveryDays | $Enums.DeliveryDays[]
  }

  export type ProductUpdatehashtagsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type EnumProductStatusFieldUpdateOperationsInput = {
    set?: $Enums.ProductStatus
  }

  export type ProductImageUpdateManyWithoutProductNestedInput = {
    create?: XOR<ProductImageCreateWithoutProductInput, ProductImageUncheckedCreateWithoutProductInput> | ProductImageCreateWithoutProductInput[] | ProductImageUncheckedCreateWithoutProductInput[]
    connectOrCreate?: ProductImageCreateOrConnectWithoutProductInput | ProductImageCreateOrConnectWithoutProductInput[]
    upsert?: ProductImageUpsertWithWhereUniqueWithoutProductInput | ProductImageUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: ProductImageCreateManyProductInputEnvelope
    set?: ProductImageWhereUniqueInput | ProductImageWhereUniqueInput[]
    disconnect?: ProductImageWhereUniqueInput | ProductImageWhereUniqueInput[]
    delete?: ProductImageWhereUniqueInput | ProductImageWhereUniqueInput[]
    connect?: ProductImageWhereUniqueInput | ProductImageWhereUniqueInput[]
    update?: ProductImageUpdateWithWhereUniqueWithoutProductInput | ProductImageUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: ProductImageUpdateManyWithWhereWithoutProductInput | ProductImageUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: ProductImageScalarWhereInput | ProductImageScalarWhereInput[]
  }

  export type ProductLikeUpdateManyWithoutProductNestedInput = {
    create?: XOR<ProductLikeCreateWithoutProductInput, ProductLikeUncheckedCreateWithoutProductInput> | ProductLikeCreateWithoutProductInput[] | ProductLikeUncheckedCreateWithoutProductInput[]
    connectOrCreate?: ProductLikeCreateOrConnectWithoutProductInput | ProductLikeCreateOrConnectWithoutProductInput[]
    upsert?: ProductLikeUpsertWithWhereUniqueWithoutProductInput | ProductLikeUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: ProductLikeCreateManyProductInputEnvelope
    set?: ProductLikeWhereUniqueInput | ProductLikeWhereUniqueInput[]
    disconnect?: ProductLikeWhereUniqueInput | ProductLikeWhereUniqueInput[]
    delete?: ProductLikeWhereUniqueInput | ProductLikeWhereUniqueInput[]
    connect?: ProductLikeWhereUniqueInput | ProductLikeWhereUniqueInput[]
    update?: ProductLikeUpdateWithWhereUniqueWithoutProductInput | ProductLikeUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: ProductLikeUpdateManyWithWhereWithoutProductInput | ProductLikeUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: ProductLikeScalarWhereInput | ProductLikeScalarWhereInput[]
  }

  export type ProductImageUncheckedUpdateManyWithoutProductNestedInput = {
    create?: XOR<ProductImageCreateWithoutProductInput, ProductImageUncheckedCreateWithoutProductInput> | ProductImageCreateWithoutProductInput[] | ProductImageUncheckedCreateWithoutProductInput[]
    connectOrCreate?: ProductImageCreateOrConnectWithoutProductInput | ProductImageCreateOrConnectWithoutProductInput[]
    upsert?: ProductImageUpsertWithWhereUniqueWithoutProductInput | ProductImageUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: ProductImageCreateManyProductInputEnvelope
    set?: ProductImageWhereUniqueInput | ProductImageWhereUniqueInput[]
    disconnect?: ProductImageWhereUniqueInput | ProductImageWhereUniqueInput[]
    delete?: ProductImageWhereUniqueInput | ProductImageWhereUniqueInput[]
    connect?: ProductImageWhereUniqueInput | ProductImageWhereUniqueInput[]
    update?: ProductImageUpdateWithWhereUniqueWithoutProductInput | ProductImageUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: ProductImageUpdateManyWithWhereWithoutProductInput | ProductImageUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: ProductImageScalarWhereInput | ProductImageScalarWhereInput[]
  }

  export type ProductLikeUncheckedUpdateManyWithoutProductNestedInput = {
    create?: XOR<ProductLikeCreateWithoutProductInput, ProductLikeUncheckedCreateWithoutProductInput> | ProductLikeCreateWithoutProductInput[] | ProductLikeUncheckedCreateWithoutProductInput[]
    connectOrCreate?: ProductLikeCreateOrConnectWithoutProductInput | ProductLikeCreateOrConnectWithoutProductInput[]
    upsert?: ProductLikeUpsertWithWhereUniqueWithoutProductInput | ProductLikeUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: ProductLikeCreateManyProductInputEnvelope
    set?: ProductLikeWhereUniqueInput | ProductLikeWhereUniqueInput[]
    disconnect?: ProductLikeWhereUniqueInput | ProductLikeWhereUniqueInput[]
    delete?: ProductLikeWhereUniqueInput | ProductLikeWhereUniqueInput[]
    connect?: ProductLikeWhereUniqueInput | ProductLikeWhereUniqueInput[]
    update?: ProductLikeUpdateWithWhereUniqueWithoutProductInput | ProductLikeUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: ProductLikeUpdateManyWithWhereWithoutProductInput | ProductLikeUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: ProductLikeScalarWhereInput | ProductLikeScalarWhereInput[]
  }

  export type ProductCreateNestedOneWithoutImagesInput = {
    create?: XOR<ProductCreateWithoutImagesInput, ProductUncheckedCreateWithoutImagesInput>
    connectOrCreate?: ProductCreateOrConnectWithoutImagesInput
    connect?: ProductWhereUniqueInput
  }

  export type ProductUpdateOneRequiredWithoutImagesNestedInput = {
    create?: XOR<ProductCreateWithoutImagesInput, ProductUncheckedCreateWithoutImagesInput>
    connectOrCreate?: ProductCreateOrConnectWithoutImagesInput
    upsert?: ProductUpsertWithoutImagesInput
    connect?: ProductWhereUniqueInput
    update?: XOR<XOR<ProductUpdateToOneWithWhereWithoutImagesInput, ProductUpdateWithoutImagesInput>, ProductUncheckedUpdateWithoutImagesInput>
  }

  export type UserCreateNestedOneWithoutProductLikesInput = {
    create?: XOR<UserCreateWithoutProductLikesInput, UserUncheckedCreateWithoutProductLikesInput>
    connectOrCreate?: UserCreateOrConnectWithoutProductLikesInput
    connect?: UserWhereUniqueInput
  }

  export type ProductCreateNestedOneWithoutLikesInput = {
    create?: XOR<ProductCreateWithoutLikesInput, ProductUncheckedCreateWithoutLikesInput>
    connectOrCreate?: ProductCreateOrConnectWithoutLikesInput
    connect?: ProductWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutProductLikesNestedInput = {
    create?: XOR<UserCreateWithoutProductLikesInput, UserUncheckedCreateWithoutProductLikesInput>
    connectOrCreate?: UserCreateOrConnectWithoutProductLikesInput
    upsert?: UserUpsertWithoutProductLikesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutProductLikesInput, UserUpdateWithoutProductLikesInput>, UserUncheckedUpdateWithoutProductLikesInput>
  }

  export type ProductUpdateOneRequiredWithoutLikesNestedInput = {
    create?: XOR<ProductCreateWithoutLikesInput, ProductUncheckedCreateWithoutLikesInput>
    connectOrCreate?: ProductCreateOrConnectWithoutLikesInput
    upsert?: ProductUpsertWithoutLikesInput
    connect?: ProductWhereUniqueInput
    update?: XOR<XOR<ProductUpdateToOneWithWhereWithoutLikesInput, ProductUpdateWithoutLikesInput>, ProductUncheckedUpdateWithoutLikesInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedEnumProductStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ProductStatus | EnumProductStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ProductStatus[] | ListEnumProductStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProductStatus[] | ListEnumProductStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumProductStatusFilter<$PrismaModel> | $Enums.ProductStatus
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumProductStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ProductStatus | EnumProductStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ProductStatus[] | ListEnumProductStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProductStatus[] | ListEnumProductStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumProductStatusWithAggregatesFilter<$PrismaModel> | $Enums.ProductStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumProductStatusFilter<$PrismaModel>
    _max?: NestedEnumProductStatusFilter<$PrismaModel>
  }

  export type ProductLikeCreateWithoutUserInput = {
    id?: string
    createdAt?: Date | string
    product: ProductCreateNestedOneWithoutLikesInput
  }

  export type ProductLikeUncheckedCreateWithoutUserInput = {
    id?: string
    productId: string
    createdAt?: Date | string
  }

  export type ProductLikeCreateOrConnectWithoutUserInput = {
    where: ProductLikeWhereUniqueInput
    create: XOR<ProductLikeCreateWithoutUserInput, ProductLikeUncheckedCreateWithoutUserInput>
  }

  export type ProductLikeCreateManyUserInputEnvelope = {
    data: ProductLikeCreateManyUserInput | ProductLikeCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ProductLikeUpsertWithWhereUniqueWithoutUserInput = {
    where: ProductLikeWhereUniqueInput
    update: XOR<ProductLikeUpdateWithoutUserInput, ProductLikeUncheckedUpdateWithoutUserInput>
    create: XOR<ProductLikeCreateWithoutUserInput, ProductLikeUncheckedCreateWithoutUserInput>
  }

  export type ProductLikeUpdateWithWhereUniqueWithoutUserInput = {
    where: ProductLikeWhereUniqueInput
    data: XOR<ProductLikeUpdateWithoutUserInput, ProductLikeUncheckedUpdateWithoutUserInput>
  }

  export type ProductLikeUpdateManyWithWhereWithoutUserInput = {
    where: ProductLikeScalarWhereInput
    data: XOR<ProductLikeUpdateManyMutationInput, ProductLikeUncheckedUpdateManyWithoutUserInput>
  }

  export type ProductLikeScalarWhereInput = {
    AND?: ProductLikeScalarWhereInput | ProductLikeScalarWhereInput[]
    OR?: ProductLikeScalarWhereInput[]
    NOT?: ProductLikeScalarWhereInput | ProductLikeScalarWhereInput[]
    id?: StringFilter<"ProductLike"> | string
    userId?: StringFilter<"ProductLike"> | string
    productId?: StringFilter<"ProductLike"> | string
    createdAt?: DateTimeFilter<"ProductLike"> | Date | string
  }

  export type ProductImageCreateWithoutProductInput = {
    id?: string
    url: string
    alt?: string | null
    order?: number
    createdAt?: Date | string
  }

  export type ProductImageUncheckedCreateWithoutProductInput = {
    id?: string
    url: string
    alt?: string | null
    order?: number
    createdAt?: Date | string
  }

  export type ProductImageCreateOrConnectWithoutProductInput = {
    where: ProductImageWhereUniqueInput
    create: XOR<ProductImageCreateWithoutProductInput, ProductImageUncheckedCreateWithoutProductInput>
  }

  export type ProductImageCreateManyProductInputEnvelope = {
    data: ProductImageCreateManyProductInput | ProductImageCreateManyProductInput[]
    skipDuplicates?: boolean
  }

  export type ProductLikeCreateWithoutProductInput = {
    id?: string
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutProductLikesInput
  }

  export type ProductLikeUncheckedCreateWithoutProductInput = {
    id?: string
    userId: string
    createdAt?: Date | string
  }

  export type ProductLikeCreateOrConnectWithoutProductInput = {
    where: ProductLikeWhereUniqueInput
    create: XOR<ProductLikeCreateWithoutProductInput, ProductLikeUncheckedCreateWithoutProductInput>
  }

  export type ProductLikeCreateManyProductInputEnvelope = {
    data: ProductLikeCreateManyProductInput | ProductLikeCreateManyProductInput[]
    skipDuplicates?: boolean
  }

  export type ProductImageUpsertWithWhereUniqueWithoutProductInput = {
    where: ProductImageWhereUniqueInput
    update: XOR<ProductImageUpdateWithoutProductInput, ProductImageUncheckedUpdateWithoutProductInput>
    create: XOR<ProductImageCreateWithoutProductInput, ProductImageUncheckedCreateWithoutProductInput>
  }

  export type ProductImageUpdateWithWhereUniqueWithoutProductInput = {
    where: ProductImageWhereUniqueInput
    data: XOR<ProductImageUpdateWithoutProductInput, ProductImageUncheckedUpdateWithoutProductInput>
  }

  export type ProductImageUpdateManyWithWhereWithoutProductInput = {
    where: ProductImageScalarWhereInput
    data: XOR<ProductImageUpdateManyMutationInput, ProductImageUncheckedUpdateManyWithoutProductInput>
  }

  export type ProductImageScalarWhereInput = {
    AND?: ProductImageScalarWhereInput | ProductImageScalarWhereInput[]
    OR?: ProductImageScalarWhereInput[]
    NOT?: ProductImageScalarWhereInput | ProductImageScalarWhereInput[]
    id?: StringFilter<"ProductImage"> | string
    url?: StringFilter<"ProductImage"> | string
    alt?: StringNullableFilter<"ProductImage"> | string | null
    order?: IntFilter<"ProductImage"> | number
    productId?: StringFilter<"ProductImage"> | string
    createdAt?: DateTimeFilter<"ProductImage"> | Date | string
  }

  export type ProductLikeUpsertWithWhereUniqueWithoutProductInput = {
    where: ProductLikeWhereUniqueInput
    update: XOR<ProductLikeUpdateWithoutProductInput, ProductLikeUncheckedUpdateWithoutProductInput>
    create: XOR<ProductLikeCreateWithoutProductInput, ProductLikeUncheckedCreateWithoutProductInput>
  }

  export type ProductLikeUpdateWithWhereUniqueWithoutProductInput = {
    where: ProductLikeWhereUniqueInput
    data: XOR<ProductLikeUpdateWithoutProductInput, ProductLikeUncheckedUpdateWithoutProductInput>
  }

  export type ProductLikeUpdateManyWithWhereWithoutProductInput = {
    where: ProductLikeScalarWhereInput
    data: XOR<ProductLikeUpdateManyMutationInput, ProductLikeUncheckedUpdateManyWithoutProductInput>
  }

  export type ProductCreateWithoutImagesInput = {
    id?: string
    name: string
    description?: string | null
    originalPrice: number
    salePrice: number
    notice?: string | null
    caution?: string | null
    basicIncluded?: string | null
    location?: string | null
    likeCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    orderFormSchema?: NullableJsonNullValueInput | InputJsonValue
    detailDescription?: string | null
    productNumber: string
    foodType: string
    producer: string
    manufactureDate: string
    packageInfo: string
    calories: string
    ingredients: string
    origin: string
    customerService: string
    mainCategory?: ProductCreatemainCategoryInput | $Enums.MainCategory[]
    subCategory?: ProductCreatesubCategoryInput | $Enums.SubCategory[]
    targetAudience?: ProductCreatetargetAudienceInput | $Enums.TargetAudience[]
    sizeRange?: ProductCreatesizeRangeInput | $Enums.SizeRange[]
    deliveryMethod?: ProductCreatedeliveryMethodInput | $Enums.DeliveryMethod[]
    deliveryDays?: ProductCreatedeliveryDaysInput | $Enums.DeliveryDays[]
    hashtags?: ProductCreatehashtagsInput | string[]
    status?: $Enums.ProductStatus
    likes?: ProductLikeCreateNestedManyWithoutProductInput
  }

  export type ProductUncheckedCreateWithoutImagesInput = {
    id?: string
    name: string
    description?: string | null
    originalPrice: number
    salePrice: number
    notice?: string | null
    caution?: string | null
    basicIncluded?: string | null
    location?: string | null
    likeCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    orderFormSchema?: NullableJsonNullValueInput | InputJsonValue
    detailDescription?: string | null
    productNumber: string
    foodType: string
    producer: string
    manufactureDate: string
    packageInfo: string
    calories: string
    ingredients: string
    origin: string
    customerService: string
    mainCategory?: ProductCreatemainCategoryInput | $Enums.MainCategory[]
    subCategory?: ProductCreatesubCategoryInput | $Enums.SubCategory[]
    targetAudience?: ProductCreatetargetAudienceInput | $Enums.TargetAudience[]
    sizeRange?: ProductCreatesizeRangeInput | $Enums.SizeRange[]
    deliveryMethod?: ProductCreatedeliveryMethodInput | $Enums.DeliveryMethod[]
    deliveryDays?: ProductCreatedeliveryDaysInput | $Enums.DeliveryDays[]
    hashtags?: ProductCreatehashtagsInput | string[]
    status?: $Enums.ProductStatus
    likes?: ProductLikeUncheckedCreateNestedManyWithoutProductInput
  }

  export type ProductCreateOrConnectWithoutImagesInput = {
    where: ProductWhereUniqueInput
    create: XOR<ProductCreateWithoutImagesInput, ProductUncheckedCreateWithoutImagesInput>
  }

  export type ProductUpsertWithoutImagesInput = {
    update: XOR<ProductUpdateWithoutImagesInput, ProductUncheckedUpdateWithoutImagesInput>
    create: XOR<ProductCreateWithoutImagesInput, ProductUncheckedCreateWithoutImagesInput>
    where?: ProductWhereInput
  }

  export type ProductUpdateToOneWithWhereWithoutImagesInput = {
    where?: ProductWhereInput
    data: XOR<ProductUpdateWithoutImagesInput, ProductUncheckedUpdateWithoutImagesInput>
  }

  export type ProductUpdateWithoutImagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    originalPrice?: IntFieldUpdateOperationsInput | number
    salePrice?: IntFieldUpdateOperationsInput | number
    notice?: NullableStringFieldUpdateOperationsInput | string | null
    caution?: NullableStringFieldUpdateOperationsInput | string | null
    basicIncluded?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    likeCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    orderFormSchema?: NullableJsonNullValueInput | InputJsonValue
    detailDescription?: NullableStringFieldUpdateOperationsInput | string | null
    productNumber?: StringFieldUpdateOperationsInput | string
    foodType?: StringFieldUpdateOperationsInput | string
    producer?: StringFieldUpdateOperationsInput | string
    manufactureDate?: StringFieldUpdateOperationsInput | string
    packageInfo?: StringFieldUpdateOperationsInput | string
    calories?: StringFieldUpdateOperationsInput | string
    ingredients?: StringFieldUpdateOperationsInput | string
    origin?: StringFieldUpdateOperationsInput | string
    customerService?: StringFieldUpdateOperationsInput | string
    mainCategory?: ProductUpdatemainCategoryInput | $Enums.MainCategory[]
    subCategory?: ProductUpdatesubCategoryInput | $Enums.SubCategory[]
    targetAudience?: ProductUpdatetargetAudienceInput | $Enums.TargetAudience[]
    sizeRange?: ProductUpdatesizeRangeInput | $Enums.SizeRange[]
    deliveryMethod?: ProductUpdatedeliveryMethodInput | $Enums.DeliveryMethod[]
    deliveryDays?: ProductUpdatedeliveryDaysInput | $Enums.DeliveryDays[]
    hashtags?: ProductUpdatehashtagsInput | string[]
    status?: EnumProductStatusFieldUpdateOperationsInput | $Enums.ProductStatus
    likes?: ProductLikeUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateWithoutImagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    originalPrice?: IntFieldUpdateOperationsInput | number
    salePrice?: IntFieldUpdateOperationsInput | number
    notice?: NullableStringFieldUpdateOperationsInput | string | null
    caution?: NullableStringFieldUpdateOperationsInput | string | null
    basicIncluded?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    likeCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    orderFormSchema?: NullableJsonNullValueInput | InputJsonValue
    detailDescription?: NullableStringFieldUpdateOperationsInput | string | null
    productNumber?: StringFieldUpdateOperationsInput | string
    foodType?: StringFieldUpdateOperationsInput | string
    producer?: StringFieldUpdateOperationsInput | string
    manufactureDate?: StringFieldUpdateOperationsInput | string
    packageInfo?: StringFieldUpdateOperationsInput | string
    calories?: StringFieldUpdateOperationsInput | string
    ingredients?: StringFieldUpdateOperationsInput | string
    origin?: StringFieldUpdateOperationsInput | string
    customerService?: StringFieldUpdateOperationsInput | string
    mainCategory?: ProductUpdatemainCategoryInput | $Enums.MainCategory[]
    subCategory?: ProductUpdatesubCategoryInput | $Enums.SubCategory[]
    targetAudience?: ProductUpdatetargetAudienceInput | $Enums.TargetAudience[]
    sizeRange?: ProductUpdatesizeRangeInput | $Enums.SizeRange[]
    deliveryMethod?: ProductUpdatedeliveryMethodInput | $Enums.DeliveryMethod[]
    deliveryDays?: ProductUpdatedeliveryDaysInput | $Enums.DeliveryDays[]
    hashtags?: ProductUpdatehashtagsInput | string[]
    status?: EnumProductStatusFieldUpdateOperationsInput | $Enums.ProductStatus
    likes?: ProductLikeUncheckedUpdateManyWithoutProductNestedInput
  }

  export type UserCreateWithoutProductLikesInput = {
    id?: string
    phone: string
    passwordHash?: string | null
    name?: string | null
    nickname?: string | null
    email?: string | null
    profileImageUrl?: string | null
    isPhoneVerified?: boolean
    isActive?: boolean
    userId?: string | null
    googleId?: string | null
    googleEmail?: string | null
    createdAt?: Date | string
    lastLoginAt?: Date | string | null
  }

  export type UserUncheckedCreateWithoutProductLikesInput = {
    id?: string
    phone: string
    passwordHash?: string | null
    name?: string | null
    nickname?: string | null
    email?: string | null
    profileImageUrl?: string | null
    isPhoneVerified?: boolean
    isActive?: boolean
    userId?: string | null
    googleId?: string | null
    googleEmail?: string | null
    createdAt?: Date | string
    lastLoginAt?: Date | string | null
  }

  export type UserCreateOrConnectWithoutProductLikesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutProductLikesInput, UserUncheckedCreateWithoutProductLikesInput>
  }

  export type ProductCreateWithoutLikesInput = {
    id?: string
    name: string
    description?: string | null
    originalPrice: number
    salePrice: number
    notice?: string | null
    caution?: string | null
    basicIncluded?: string | null
    location?: string | null
    likeCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    orderFormSchema?: NullableJsonNullValueInput | InputJsonValue
    detailDescription?: string | null
    productNumber: string
    foodType: string
    producer: string
    manufactureDate: string
    packageInfo: string
    calories: string
    ingredients: string
    origin: string
    customerService: string
    mainCategory?: ProductCreatemainCategoryInput | $Enums.MainCategory[]
    subCategory?: ProductCreatesubCategoryInput | $Enums.SubCategory[]
    targetAudience?: ProductCreatetargetAudienceInput | $Enums.TargetAudience[]
    sizeRange?: ProductCreatesizeRangeInput | $Enums.SizeRange[]
    deliveryMethod?: ProductCreatedeliveryMethodInput | $Enums.DeliveryMethod[]
    deliveryDays?: ProductCreatedeliveryDaysInput | $Enums.DeliveryDays[]
    hashtags?: ProductCreatehashtagsInput | string[]
    status?: $Enums.ProductStatus
    images?: ProductImageCreateNestedManyWithoutProductInput
  }

  export type ProductUncheckedCreateWithoutLikesInput = {
    id?: string
    name: string
    description?: string | null
    originalPrice: number
    salePrice: number
    notice?: string | null
    caution?: string | null
    basicIncluded?: string | null
    location?: string | null
    likeCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    orderFormSchema?: NullableJsonNullValueInput | InputJsonValue
    detailDescription?: string | null
    productNumber: string
    foodType: string
    producer: string
    manufactureDate: string
    packageInfo: string
    calories: string
    ingredients: string
    origin: string
    customerService: string
    mainCategory?: ProductCreatemainCategoryInput | $Enums.MainCategory[]
    subCategory?: ProductCreatesubCategoryInput | $Enums.SubCategory[]
    targetAudience?: ProductCreatetargetAudienceInput | $Enums.TargetAudience[]
    sizeRange?: ProductCreatesizeRangeInput | $Enums.SizeRange[]
    deliveryMethod?: ProductCreatedeliveryMethodInput | $Enums.DeliveryMethod[]
    deliveryDays?: ProductCreatedeliveryDaysInput | $Enums.DeliveryDays[]
    hashtags?: ProductCreatehashtagsInput | string[]
    status?: $Enums.ProductStatus
    images?: ProductImageUncheckedCreateNestedManyWithoutProductInput
  }

  export type ProductCreateOrConnectWithoutLikesInput = {
    where: ProductWhereUniqueInput
    create: XOR<ProductCreateWithoutLikesInput, ProductUncheckedCreateWithoutLikesInput>
  }

  export type UserUpsertWithoutProductLikesInput = {
    update: XOR<UserUpdateWithoutProductLikesInput, UserUncheckedUpdateWithoutProductLikesInput>
    create: XOR<UserCreateWithoutProductLikesInput, UserUncheckedCreateWithoutProductLikesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutProductLikesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutProductLikesInput, UserUncheckedUpdateWithoutProductLikesInput>
  }

  export type UserUpdateWithoutProductLikesInput = {
    id?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    profileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isPhoneVerified?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    googleId?: NullableStringFieldUpdateOperationsInput | string | null
    googleEmail?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserUncheckedUpdateWithoutProductLikesInput = {
    id?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    profileImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isPhoneVerified?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    googleId?: NullableStringFieldUpdateOperationsInput | string | null
    googleEmail?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ProductUpsertWithoutLikesInput = {
    update: XOR<ProductUpdateWithoutLikesInput, ProductUncheckedUpdateWithoutLikesInput>
    create: XOR<ProductCreateWithoutLikesInput, ProductUncheckedCreateWithoutLikesInput>
    where?: ProductWhereInput
  }

  export type ProductUpdateToOneWithWhereWithoutLikesInput = {
    where?: ProductWhereInput
    data: XOR<ProductUpdateWithoutLikesInput, ProductUncheckedUpdateWithoutLikesInput>
  }

  export type ProductUpdateWithoutLikesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    originalPrice?: IntFieldUpdateOperationsInput | number
    salePrice?: IntFieldUpdateOperationsInput | number
    notice?: NullableStringFieldUpdateOperationsInput | string | null
    caution?: NullableStringFieldUpdateOperationsInput | string | null
    basicIncluded?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    likeCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    orderFormSchema?: NullableJsonNullValueInput | InputJsonValue
    detailDescription?: NullableStringFieldUpdateOperationsInput | string | null
    productNumber?: StringFieldUpdateOperationsInput | string
    foodType?: StringFieldUpdateOperationsInput | string
    producer?: StringFieldUpdateOperationsInput | string
    manufactureDate?: StringFieldUpdateOperationsInput | string
    packageInfo?: StringFieldUpdateOperationsInput | string
    calories?: StringFieldUpdateOperationsInput | string
    ingredients?: StringFieldUpdateOperationsInput | string
    origin?: StringFieldUpdateOperationsInput | string
    customerService?: StringFieldUpdateOperationsInput | string
    mainCategory?: ProductUpdatemainCategoryInput | $Enums.MainCategory[]
    subCategory?: ProductUpdatesubCategoryInput | $Enums.SubCategory[]
    targetAudience?: ProductUpdatetargetAudienceInput | $Enums.TargetAudience[]
    sizeRange?: ProductUpdatesizeRangeInput | $Enums.SizeRange[]
    deliveryMethod?: ProductUpdatedeliveryMethodInput | $Enums.DeliveryMethod[]
    deliveryDays?: ProductUpdatedeliveryDaysInput | $Enums.DeliveryDays[]
    hashtags?: ProductUpdatehashtagsInput | string[]
    status?: EnumProductStatusFieldUpdateOperationsInput | $Enums.ProductStatus
    images?: ProductImageUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateWithoutLikesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    originalPrice?: IntFieldUpdateOperationsInput | number
    salePrice?: IntFieldUpdateOperationsInput | number
    notice?: NullableStringFieldUpdateOperationsInput | string | null
    caution?: NullableStringFieldUpdateOperationsInput | string | null
    basicIncluded?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    likeCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    orderFormSchema?: NullableJsonNullValueInput | InputJsonValue
    detailDescription?: NullableStringFieldUpdateOperationsInput | string | null
    productNumber?: StringFieldUpdateOperationsInput | string
    foodType?: StringFieldUpdateOperationsInput | string
    producer?: StringFieldUpdateOperationsInput | string
    manufactureDate?: StringFieldUpdateOperationsInput | string
    packageInfo?: StringFieldUpdateOperationsInput | string
    calories?: StringFieldUpdateOperationsInput | string
    ingredients?: StringFieldUpdateOperationsInput | string
    origin?: StringFieldUpdateOperationsInput | string
    customerService?: StringFieldUpdateOperationsInput | string
    mainCategory?: ProductUpdatemainCategoryInput | $Enums.MainCategory[]
    subCategory?: ProductUpdatesubCategoryInput | $Enums.SubCategory[]
    targetAudience?: ProductUpdatetargetAudienceInput | $Enums.TargetAudience[]
    sizeRange?: ProductUpdatesizeRangeInput | $Enums.SizeRange[]
    deliveryMethod?: ProductUpdatedeliveryMethodInput | $Enums.DeliveryMethod[]
    deliveryDays?: ProductUpdatedeliveryDaysInput | $Enums.DeliveryDays[]
    hashtags?: ProductUpdatehashtagsInput | string[]
    status?: EnumProductStatusFieldUpdateOperationsInput | $Enums.ProductStatus
    images?: ProductImageUncheckedUpdateManyWithoutProductNestedInput
  }

  export type ProductLikeCreateManyUserInput = {
    id?: string
    productId: string
    createdAt?: Date | string
  }

  export type ProductLikeUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    product?: ProductUpdateOneRequiredWithoutLikesNestedInput
  }

  export type ProductLikeUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductLikeUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductImageCreateManyProductInput = {
    id?: string
    url: string
    alt?: string | null
    order?: number
    createdAt?: Date | string
  }

  export type ProductLikeCreateManyProductInput = {
    id?: string
    userId: string
    createdAt?: Date | string
  }

  export type ProductImageUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    alt?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductImageUncheckedUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    alt?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductImageUncheckedUpdateManyWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    alt?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductLikeUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutProductLikesNestedInput
  }

  export type ProductLikeUncheckedUpdateWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductLikeUncheckedUpdateManyWithoutProductInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}