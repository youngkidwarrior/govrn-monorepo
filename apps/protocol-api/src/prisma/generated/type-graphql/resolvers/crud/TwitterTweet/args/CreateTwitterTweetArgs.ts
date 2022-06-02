import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { TwitterTweetCreateInput } from "../../../inputs/TwitterTweetCreateInput";

@TypeGraphQL.ArgsType()
export class CreateTwitterTweetArgs {
  @TypeGraphQL.Field(_type => TwitterTweetCreateInput, {
    nullable: false
  })
  data!: TwitterTweetCreateInput;
}
