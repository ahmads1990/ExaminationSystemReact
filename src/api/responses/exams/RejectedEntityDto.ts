import { RejectionReason } from "../../../enums";

export interface RejectedEntityDto {
    id: number;
    reason: RejectionReason;
}
