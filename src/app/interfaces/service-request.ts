import { User } from "./user";

export interface ServiceRequest {
  id?: number,
  user?: User,
  userId?: string,
  unit: string,
  contact: string,
  subject: string,
  description: string,
  open?: boolean,
  admin_notes?: string,
  expanded?: boolean,
  last?: string,
  email?: string
}
