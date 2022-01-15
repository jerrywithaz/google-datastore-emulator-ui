import { Field, Float, InputType, Int, ObjectType, registerEnumType } from "type-graphql";
import { GraphQLJSONObject } from "graphql-type-json";
import { FilterScalar, OperatorType, OperatorScalar, FilterType } from "./scalars";

export enum OperatorEnum {
  "=" = "=",
  "<" = "<",
  ">" = ">",
  "<=" = "<=",
  ">=" = ">=",
  "HAS_ANCESTOR" = "HAS_ANCESTOR",
}

export enum MoreResultsEnum {
  "MORE_RESULTS_TYPE_UNSPECIFIED" = "MORE_RESULTS_TYPE_UNSPECIFIED",
  "NOT_FINISHED" = "NOT_FINISHED",
  "MORE_RESULTS_AFTER_LIMIT" = "MORE_RESULTS_AFTER_LIMIT",
  "MORE_RESULTS_AFTER_CURSOR" = "MORE_RESULTS_AFTER_CURSOR",
  "NO_MORE_RESULTS" = "NO_MORE_RESULTS",
}

registerEnumType(OperatorEnum, {
  name: "OperatorEnum", // this one is mandatory
  description: "The supported operators by google datastore", // this one is optional
});

registerEnumType(MoreResultsEnum, {
  name: "MoreResultsEnum", // this one is mandatory
  description: "The list of more results values from google datastore", // this one is optional
});

@ObjectType()
export class RunQueryInfo {
  @Field({ nullable: true }) // and explicitly use it
  endCursor?: string;

  @Field(() => MoreResultsEnum, { nullable: true })
  moreResults?: MoreResultsEnum;
}

@ObjectType()
export class Entity {
  @Field(() => GraphQLJSONObject) // and explicitly use it
  readonly entity!: Record<string, any>;

  @Field()
  key!: string;
}

@ObjectType()
export class EntitiesResult {
  @Field(() => [Entity]) // and explicitly use it
  entities!: Entity[];

  @Field(() => RunQueryInfo)
  info!: RunQueryInfo;
}

@InputType()
export class FilterModel {
  @Field()
  property!: string;

  @Field(() => OperatorScalar)
  operator!: OperatorType;

  @Field(() => FilterScalar)
  readonly value!: FilterType;
}

@InputType()
export class SortModel {
  @Field()
  field!: string;

  @Field()
  sort!: string;
}

@InputType()
export class GetEntitiesInput {
  @Field()
  kind!: string;

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  page!: number;

  @Field(() => Int, { nullable: true, defaultValue: 25 })
  pageSize!: number;

  @Field(() => [FilterModel], { nullable: true, defaultValue: [] })
  filters!: FilterModel[];

  @Field(() => [SortModel], { nullable: true, defaultValue: [] })
  sortModel!: SortModel[];
}

