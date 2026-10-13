export type EmployeeStatus = "Active" | "Inactive" | "On Leave";

export interface Company {
  name: string;
  title: string;
  department: string;
}

export interface Address {
  address: string;
  city: string;
  state: string;
  postalCode: string;
}

/** Core enterprise employee entity model */
export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  username: string;
  image: string;
  company: Company;
  address: Address;
  status: EmployeeStatus;
}

export interface FetchEmployeesResponse {
  users: Employee[];
  total: number;
}

/** Structured payload for employee performance feedback */
export interface FeedbackData {
  employeeId: number;
  rating: number;
  comments: string;
}
