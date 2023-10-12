export interface Tiket {
  camira_code_id: number,
  camira_image_path: string,
  camira_npc_code_id: number,
  camira_npr_image_path: string,
  car_class_id: {
    car_classe_Name_Ar: string
    car_classe_Name_En: string

    car_class_id: number
  },
  created_at: string,
  creation_user: number,
  gate_arm_code_id: number,
  lane_id: {
    lane_id: number,
    directions_id: {
      directions_name_ar: string,
      gate_id: {
        gate_name_ar: string,
        road_id: {
          road_name_ar: string,
        }
      }
    }
  },
  modified_at: string,
  price: string,
  shift_id: number,
  ticket_number_id: string,
  transaction_status: number,
}
