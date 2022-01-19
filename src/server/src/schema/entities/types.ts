import { Field, ID, InputType, Int, ObjectType } from "type-graphql";
import { GraphQLJSONObject } from "graphql-type-json";
import { FilterScalar, OperatorType, OperatorScalar, FilterType, PathArrayScalar, PathArrayType, DataTypeMap, DataTypeMapScalar } from "./scalars";
import { DataTypeEnum, MoreResultsEnum } from "./enums";

@ObjectType()
export class RunQueryInfo {
  @Field({ nullable: true })
  endCursor?: string;

  @Field(() => MoreResultsEnum, { nullable: true })
  moreResults?: MoreResultsEnum;
}

@ObjectType()
export class Entity {
  @Field(() => GraphQLJSONObject)
  readonly entity!: Record<string, any>;

  @Field(() => ID)
  readonly key!: string;

  @Field(() => PathArrayScalar)
  readonly path!: PathArrayType;
}

@ObjectType()
export class EntitiesResult {
  @Field(() => [Entity])
  entities!: Entity[];

  @Field(() => DataTypeMapScalar, { description: 'The data types for each key in an entity.'})
  readonly typesMap!: DataTypeMap;

  @Field(() => [String])
  columns!: string[];

  @Field(() => RunQueryInfo)
  info!: RunQueryInfo;

  @Field(() => [DataTypeEnum])
  availableTypes!: DataTypeEnum[];
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


@InputType()
export class UpdateEntityInput {
  @Field(() => PathArrayScalar)
  readonly path!: PathArrayType;

  @Field(() => GraphQLJSONObject)
  readonly updates!: Record<string, any>;
}
