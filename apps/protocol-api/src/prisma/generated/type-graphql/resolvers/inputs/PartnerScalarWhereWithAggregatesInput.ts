import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { DateTimeWithAggregatesFilter } from "../inputs/DateTimeWithAggregatesFilter";
import { IntWithAggregatesFilter } from "../inputs/IntWithAggregatesFilter";

@TypeGraphQL.InputType("PartnerScalarWhereWithAggregatesInput", {
  isAbstract: true
})
export class PartnerScalarWhereWithAggregatesInput {
  @TypeGraphQL.Field(_type => [PartnerScalarWhereWithAggregatesInput], {
    nullable: true
  })
  AND?: PartnerScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => [PartnerScalarWhereWithAggregatesInput], {
    nullable: true
  })
  OR?: PartnerScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => [PartnerScalarWhereWithAggregatesInput], {
    nullable: true
  })
  NOT?: PartnerScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => IntWithAggregatesFilter, {
    nullable: true
  })
  id?: IntWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => DateTimeWithAggregatesFilter, {
    nullable: true
  })
  createdAt?: DateTimeWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => DateTimeWithAggregatesFilter, {
    nullable: true
  })
  updatedAt?: DateTimeWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => IntWithAggregatesFilter, {
    nullable: true
  })
  user_id?: IntWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => IntWithAggregatesFilter, {
    nullable: true
  })
  contribution_id?: IntWithAggregatesFilter | undefined;
}
