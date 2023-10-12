import { Lane } from "./Lane";
import { ShiftInfo } from "./shiftInfo";
import { User } from "./User";
import { Vehicle } from "./vehicle";

export interface ShitTransaction {
  ticket_number_id: number,
  car_classe_id: Vehicle,
  shift_id: ShiftInfo,
  lane_id: Lane,
  creation_user: User,
  created_at: string,
  modified_at: string,
  price: string,
  camira_image_path: string,
  camira_npr_image_path: string,
  transaction_status: number,
  camira_code_id: number,
  camira_npc_code_id: number,
  gate_arm_code_id: number
}
