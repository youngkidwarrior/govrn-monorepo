import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { UserCreateOrConnectWithoutContributionsInput } from "../inputs/UserCreateOrConnectWithoutContributionsInput";
import { UserCreateWithoutContributionsInput } from "../inputs/UserCreateWithoutContributionsInput";
import { UserWhereUniqueInput } from "../inputs/UserWhereUniqueInput";

@TypeGraphQL.InputType("UserCreateNestedOneWithoutContributionsInput", {
  isAbstract: true
})
export class UserCreateNestedOneWithoutContributionsInput {
  @TypeGraphQL.Field(_type => UserCreateWithoutContributionsInput, {
    nullable: true
  })
  create?: UserCreateWithoutContributionsInput | undefined;

  @TypeGraphQL.Field(_type => UserCreateOrConnectWithoutContributionsInput, {
    nullable: true
  })
  connectOrCreate?: UserCreateOrConnectWithoutContributionsInput | undefined;

  @TypeGraphQL.Field(_type => UserWhereUniqueInput, {
    nullable: true
  })
  connect?: UserWhereUniqueInput | undefined;
}
