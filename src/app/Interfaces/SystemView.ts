import { Direction } from "./Direction";
import { Gates } from "./Gates";
import { Lane } from "./Lane";
import { RoadStatus } from "./RoadStatus";
import { ShiftInfo } from "./shiftInfo";
import { SystemDetials } from "./SystemDetials";
import { User } from "./User";

export interface SystemView {
  lane: {
    lane_code: number,
    status_direction?: string;
    directions_name?: string,
    directions_id: Direction,
    shift_id: ShiftInfo,
    gate_id: Gates,
    user_id: User
    status_id: RoadStatus,
    created_at: string,
    created_Custom?: string,
  },
  detials: SystemDetials[]

}
