export interface Event extends Object {
  id: number,
  name: string,
  location: string,
  description?: string,
  start: Date,
  finish: Date
}
