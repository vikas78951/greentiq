
export type CustomerStatus = "active" | "inactive";
export type CustomerGender = "male" | "female"


export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  company: string
  status: CustomerStatus
  gender: CustomerGender
  avatar?: string
  lastContactDate: string
  notes: string
  createdAt: string
  updatedAt: string
}


export interface CustomerQuery {
  search?: string;
  filters: FilterState;
  sortBy?: "name" | "email" | "lastContactDate";
  sortOrder?: "asc" | "desc";
  page: number;
  pageSize: 10 | 25 | 50;
}

export interface FilterState {
  status: CustomerStatus[]
  companies: string[]
  dateFrom?: string
  dateTo?: string
  phone?: string
  email?: string
}
 