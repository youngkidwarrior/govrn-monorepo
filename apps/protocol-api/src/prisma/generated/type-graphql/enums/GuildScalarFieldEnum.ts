import * as TypeGraphQL from "type-graphql";

export enum GuildScalarFieldEnum {
  id = "id",
  createdAt = "createdAt",
  updatedAt = "updatedAt",
  discord_id = "discord_id",
  name = "name",
  congrats_channel = "congrats_channel",
  logo = "logo"
}
TypeGraphQL.registerEnumType(GuildScalarFieldEnum, {
  name: "GuildScalarFieldEnum",
  description: undefined,
});
