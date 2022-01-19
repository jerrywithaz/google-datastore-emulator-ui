import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class DatastoreBackup {
  @Field(() => ID)
  readonly id!: string;

  @Field()
  readonly name!: string;

  @Field()
  readonly date!: Date;

  @Field()
  readonly exists!: boolean;

  @Field({ nullable: true })
  readonly path?: string;
}
