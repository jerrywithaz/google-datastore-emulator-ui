import type { Operator } from '@google-cloud/datastore/build/src/query'
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** Google datastore data type scalar type */
  DataTypeMapScalar: Record<string, DataTypeEnum>;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
  /** Google datastore query filter scalar type */
  FilterScalar: Scalars['String'] | Scalars['Int'];
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: Record<string, any>;
  /** Google datastore operator value scalar type */
  OperatorScalar: Operator;
  /** Google datastore key path scalar type */
  PathArrayScalar: (Scalars['String'] | Scalars['Int'])[];
};

/** The list of available datatypes returned from the google datastore */
export enum DataTypeEnum {
  Array = 'array',
  Boolean = 'boolean',
  Buffer = 'buffer',
  Date = 'date',
  Nullish = 'nullish',
  Number = 'number',
  Object = 'object',
  String = 'string',
  Undefined = 'undefined'
}

export type DatastoreBackup = {
  __typename?: 'DatastoreBackup';
  date: Scalars['DateTime'];
  exists: Scalars['Boolean'];
  id: Scalars['ID'];
  name: Scalars['String'];
  path?: Maybe<Scalars['String']>;
};

export type EntitiesResult = {
  __typename?: 'EntitiesResult';
  availableTypes: Array<DataTypeEnum>;
  columns: Array<Scalars['String']>;
  entities: Array<Entity>;
  info: RunQueryInfo;
  /** The data types for each key in an entity. */
  typesMap: Scalars['DataTypeMapScalar'];
};

export type Entity = {
  __typename?: 'Entity';
  entity: Scalars['JSONObject'];
  key: Scalars['ID'];
  path: Scalars['PathArrayScalar'];
};

export type FilterModel = {
  operator: Scalars['OperatorScalar'];
  property: Scalars['String'];
  value: Scalars['FilterScalar'];
};

export type GetEntitiesInput = {
  filters?: InputMaybe<Array<FilterModel>>;
  kind: Scalars['String'];
  page?: InputMaybe<Scalars['Int']>;
  pageSize?: InputMaybe<Scalars['Int']>;
  sortModel?: InputMaybe<Array<SortModel>>;
};

/** The list of more results values from google datastore */
export enum MoreResultsEnum {
  MoreResultsAfterCursor = 'MORE_RESULTS_AFTER_CURSOR',
  MoreResultsAfterLimit = 'MORE_RESULTS_AFTER_LIMIT',
  MoreResultsTypeUnspecified = 'MORE_RESULTS_TYPE_UNSPECIFIED',
  NotFinished = 'NOT_FINISHED',
  NoMoreResults = 'NO_MORE_RESULTS'
}

export type Mutation = {
  __typename?: 'Mutation';
  updateEntity: Entity;
};


export type MutationUpdateEntityArgs = {
  input: UpdateEntityInput;
};

/** The supported operators by google datastore */
export enum OperatorEnum {
  Equals = 'equals',
  GreaterThan = 'greater_than',
  GreaterThanOrEqual = 'greater_than_or_equal',
  HasAncestor = 'has_ancestor',
  LessThan = 'less_than',
  LessThanOrEqual = 'less_than_or_equal'
}

export type Query = {
  __typename?: 'Query';
  getBackups: Array<DatastoreBackup>;
  getDataTypes: Array<DataTypeEnum>;
  getEntities: EntitiesResult;
  getKinds: Array<Scalars['String']>;
  getNamespaces: Array<Scalars['String']>;
  getOperators: Array<OperatorEnum>;
};


export type QueryGetEntitiesArgs = {
  input: GetEntitiesInput;
};

export type RunQueryInfo = {
  __typename?: 'RunQueryInfo';
  endCursor?: Maybe<Scalars['String']>;
  moreResults?: Maybe<MoreResultsEnum>;
};

export type SortModel = {
  field: Scalars['String'];
  sort: Scalars['String'];
};

export type UpdateEntityInput = {
  path: Scalars['PathArrayScalar'];
  updates: Scalars['JSONObject'];
};
