import { Permission } from './Permission';
export interface Groups {
  name: string;
  permission?: Permission[];
  id: number;
}
