export interface User {
  Id: string;
  FirstName: string;
  LastName: string;
  MiddleName?: string;
  FullName?: string;
  BirthDate?: string;
  Address?: string;
  City?: string;
  State?: string;
  Phone?: string;
  Mobile?: string;
  Email: string;
  Gender?: string;
  PictureUri?: string;
  CustomId?: string;
  CustomField1?: string;
  CustomField2?: string;
  CustomField3?: string;
  CustomField4?: string;
  CustomField5?: string;
  CustomField6?: string;
  CustomField7?: string;
  CustomField8?: string;
  CustomField9?: string;
  CustomField10?: string;
  IsTimeAttendanceUser: boolean;
  IsArchived: boolean;
  HasUserAccount: boolean;
  UserAccountId?: string;
  UserName?: string;
  CalculationStartDate?: string;
  CalculationStopDate?: string;
  HasAssignedPin: boolean;
  SendInvite: boolean;
}

export interface UsersResponse {
  records: User[];
  totalCount: number;
}

export interface NewUserRequest {
  FirstName: string;
  LastName: string;
  Email: string;
}
