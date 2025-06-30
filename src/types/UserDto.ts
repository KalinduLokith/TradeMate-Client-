export interface UserDto {
  id?: number;
  email: string;
  firstName?: string;
  lastName?: string;
  mobile: string;
  dateOfBirth?: Date | null;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  gender?: string;
  initial_capital?: number;
}
