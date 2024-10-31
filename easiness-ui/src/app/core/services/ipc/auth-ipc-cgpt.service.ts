import { Injectable } from "@angular/core";
import { Observable, from } from "rxjs";
import { map } from "rxjs/operators"; // Import map operator
import { User } from "../../models/auth.models";

@Injectable({ providedIn: "root" })
export class AuthenticationService {
  user: User;

  constructor() {
    // Initialization if needed
  }

  /**
   * Returns the current user
   */
  public currentUser(): Observable<User> {
    const res = (window as any).electronAPI.getAuthenticatedUser() as Promise<User>;
    return from(res);
  }

  /**
   * Performs the auth
   * @param email email of user
   * @param password password of user
   */
  login(email: string, password: string): Observable<User> {
    const res = (window as any).electronAPI.loginUser(email, password) as Promise<User>;
    return from(res);
  }

  /**
   * Performs the register
   * @param email email
   * @param password password
   */
  register(email: string, password: string): Observable<User> {
    const res = (window as any).electronAPI.registerUser(email, password) as Promise<User>;
    return from(res);
  }

  /**
   * Reset password
   * @param email email
   */
  resetPassword(email: string): Observable<string> {
    const res = (window as any).electronAPI.forgetPassword(email) as Promise<{ data: string }>;
    return from(res).pipe(map((response) => response.data));
  }

  /**
   * Logout the user
   */
  logout(): Observable<void> {
    const res = (window as any).electronAPI.logoutUser() as Promise<void>;
    return from(res);
  }
}
