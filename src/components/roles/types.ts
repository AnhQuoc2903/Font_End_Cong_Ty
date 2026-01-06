export type Permission = {
  _id: string;
  name: string;
  description?: string;
  group?: string;
};

export type RoleRow = {
  _id: string;
  name: string;
  description?: string;
  permissions?: Permission[];
  userCount?: number;
};
