import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";

@TypeGraphQL.ObjectType("ContributionMinAggregate", {
  isAbstract: true
})
export class ContributionMinAggregate {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  id!: number | null;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  updatedAt!: Date | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  status_id!: number | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  activity_type_id!: number | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  user_id!: number | null;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  date_of_submission!: Date | null;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  date_of_engagement!: Date | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  details!: string | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  proof!: string | null;
}
