import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { AttestationUpdateManyWithoutContributionInput } from "../inputs/AttestationUpdateManyWithoutContributionInput";
import { ContributionStatusUpdateOneRequiredWithoutContributionsInput } from "../inputs/ContributionStatusUpdateOneRequiredWithoutContributionsInput";
import { DateTimeFieldUpdateOperationsInput } from "../inputs/DateTimeFieldUpdateOperationsInput";
import { GuildContributionUpdateManyWithoutContributionInput } from "../inputs/GuildContributionUpdateManyWithoutContributionInput";
import { NullableStringFieldUpdateOperationsInput } from "../inputs/NullableStringFieldUpdateOperationsInput";
import { PartnerUpdateManyWithoutContributionInput } from "../inputs/PartnerUpdateManyWithoutContributionInput";
import { UserUpdateOneRequiredWithoutContributionsInput } from "../inputs/UserUpdateOneRequiredWithoutContributionsInput";

@TypeGraphQL.InputType("ContributionUpdateWithoutActivity_typeInput", {
  isAbstract: true
})
export class ContributionUpdateWithoutActivity_typeInput {
  @TypeGraphQL.Field(_type => DateTimeFieldUpdateOperationsInput, {
    nullable: true
  })
  updatedAt?: DateTimeFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => ContributionStatusUpdateOneRequiredWithoutContributionsInput, {
    nullable: true
  })
  status?: ContributionStatusUpdateOneRequiredWithoutContributionsInput | undefined;

  @TypeGraphQL.Field(_type => UserUpdateOneRequiredWithoutContributionsInput, {
    nullable: true
  })
  user?: UserUpdateOneRequiredWithoutContributionsInput | undefined;

  @TypeGraphQL.Field(_type => DateTimeFieldUpdateOperationsInput, {
    nullable: true
  })
  date_of_submission?: DateTimeFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => DateTimeFieldUpdateOperationsInput, {
    nullable: true
  })
  date_of_engagement?: DateTimeFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => NullableStringFieldUpdateOperationsInput, {
    nullable: true
  })
  details?: NullableStringFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => NullableStringFieldUpdateOperationsInput, {
    nullable: true
  })
  proof?: NullableStringFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => AttestationUpdateManyWithoutContributionInput, {
    nullable: true
  })
  attestations?: AttestationUpdateManyWithoutContributionInput | undefined;

  @TypeGraphQL.Field(_type => PartnerUpdateManyWithoutContributionInput, {
    nullable: true
  })
  partners?: PartnerUpdateManyWithoutContributionInput | undefined;

  @TypeGraphQL.Field(_type => GuildContributionUpdateManyWithoutContributionInput, {
    nullable: true
  })
  guilds?: GuildContributionUpdateManyWithoutContributionInput | undefined;
}
