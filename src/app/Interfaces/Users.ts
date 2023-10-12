import { Groups } from "./Groups";
import { Permission } from "./Permission";

export interface Users {
  id?: number,
  user_permissions: Permission,
  created_at?: string,
  modified_at?: string,
  last_login: string,
  is_superuser?: boolean,
  is_active?: boolean,
  is_staff?: boolean,
  is_admin?: boolean,
  username?: string,
  email: string,
  first_name: string,
  last_name: string,
  middle_name: string,
  gender: string,
  number_of_identification?: string,
  home_address?: string,
  mobile?: string,
  groups?: Groups[],
}
