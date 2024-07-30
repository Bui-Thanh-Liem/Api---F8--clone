import { IUser } from "../models/user.model";

export interface IResponseLogin {
    user: Partial<IUser>
    token: string
}