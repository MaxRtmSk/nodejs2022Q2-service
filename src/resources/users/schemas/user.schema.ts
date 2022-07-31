import { Exclude, Transform } from 'class-transformer';
export class User {
  id: string;
  login: string;

  @Exclude()
  password: string;

  version?: number;

  @Transform(({ value }) => {
    let n = +value 
    const r = n.toString().substring(0, n.toString().length - 1);
    return +r
  })
  createdAt?: Date;

  @Transform(({ value }) => {
    let n = +value 
    const r = n.toString().substring(0, n.toString().length - 1);
    return +r
  })
  updatedAt?: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
