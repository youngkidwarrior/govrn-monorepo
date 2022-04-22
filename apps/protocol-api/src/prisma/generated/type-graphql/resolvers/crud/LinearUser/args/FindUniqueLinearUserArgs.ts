import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { LinearUserWhereUniqueInput } from "../../../inputs/LinearUserWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class FindUniqueLinearUserArgs {
  @TypeGraphQL.Field(_type => LinearUserWhereUniqueInput, {
    nullable: false
  })
  where!: LinearUserWhereUniqueInput;
}
