export interface AbsenceDefinition {
  Id: string;
  Name: string;
  Type: number;
  IntegrationId?: number;
  IsAvailableForAdminsOnly?: boolean;
  CategoryDefinitionId?: string;
  IsActive: boolean;
  RestrictionType?: number;
  TagId?: string;
}

export interface AbsenceDefinitionApiResponse {
  records: AbsenceDefinition[];
  totalCount: number;
}

export interface Absence {
  Id?: string;
  UserId: string;
  Timestamp: string;
  AbsenceDefinitionId: string;
  Origin?: number;
  Comment?: string;
  PartialTimeFrom?: string;
  PartialTimeTo?: string;
  PartialTimeDuration?: number;
  IsPartial: boolean;
  OverrideHolidayAbsence?: boolean;
}

export interface AbsenceApiResponse {
  records: Absence[];
  totalCount: number;
}

export interface NewAbsenceRequest {
  UserId: string;
  Timestamp: string;
  AbsenceDefinitionId: string;
  Comment?: string;
  IsPartial: boolean;
  PartialTimeFrom?: string;
  PartialTimeTo?: string;
}

export interface AbsenceWithUser extends Absence {
  userName: string;
  absenceDefinitionName: string;
}
