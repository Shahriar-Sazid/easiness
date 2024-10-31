import { Injectable } from "@angular/core";
import { Observable, from } from "rxjs";
import { User } from "../../models/auth.models";

@Injectable({ providedIn: "root" })
export class UserProfileIPCService {
  constructor() {}

  getAll(): Observable<User[]> {
    const res = (window as any).electronAPI.getAllUsers() as Promise<User[]>;
    return from(res);
  }

  register(user: User): Observable<any> {
    const res = (window as any).electronAPI.registerUser(user) as Promise<any>;
    return from(res);
  }
}
