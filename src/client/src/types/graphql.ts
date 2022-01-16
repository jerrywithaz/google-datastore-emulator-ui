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
  /** Google datastore query filter scalar type */
  FilterScalar: Scalars['String'] | Scalars['Int'];
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: Record<string, any>;
  /** Google datastore operator value scalar type */
  OperatorScalar: Operator;
};

export type EntitiesResult = {
  __typename?: 'EntitiesResult';
  entities: Array<Entity>;
  info: RunQueryInfo;
  /** The data types for each key in an entity. */
  typesMap: Scalars['JSONObject'];
};

export type Entity = {
  __typename?: 'Entity';
  entity: Scalars['JSONObject'];
  id: Scalars['ID'];
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

export type Query = {
  __typename?: 'Query';
  getEntities: EntitiesResult;
  getKinds: Array<Scalars['String']>;
  getNamespaces: Array<Scalars['String']>;
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
  path: Array<Scalars['String']>;
  updates: Scalars['JSONObject'];
};
