export type ParentModel = {
  // id: number;
  name: string;
  route?: string;
  children?: childrenModel[];
  isOuterLink?: boolean;
};
export type ParentSideModel = {
  id: number;
  name: string;
  active?: boolean;
  route?: string;
  linkName?: string;
  children?: childrenModel[];
  isOuterLink?: boolean;
  icon?: string;
};

export type childrenModel = {
  name: string;
  route?: string;
  subChildren?: subChildrenModel[];
  active?: boolean;
};

export type subChildrenModel = {
  name: string;
  route: string;
  active?: boolean;
};
