import { User } from "./user";

export interface Payment {
  id: number,
  user: User,
  amount: number,
  submittedOn: Date
}
