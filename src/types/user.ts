export interface User {
  num: number;
  username: string;
  act_date: string | null;
  photo: string | null;
  group_name: string;
  job_title: string | null;
  department: string | null;
}

export type UsersResponse = Record<string, User[]>;

export interface GroupedUsersResponse {
  users: UsersResponse;
}
