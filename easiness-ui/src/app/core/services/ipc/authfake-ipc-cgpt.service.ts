import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../../models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthfakeauthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient) {
        // Initialize the currentUserSubject with the user stored in localStorage
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(email: string, password: string) {
        return this.http.post<any>(`/users/authenticate`, { email, password })
            .pipe(map(user => {
                // Login successful if there's a jwt token in the response
                if (user && user.token) {
                    // Store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);

                    // Optionally, broadcast the login event to the main process via IPC
                    this.broadcastLoginEvent(user);
                }
                return user;
            }));
    }

    logout() {
        // Remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);

        // Optionally, broadcast the logout event to the main process via IPC
        this.broadcastLogoutEvent();
    }

    private broadcastLoginEvent(user: User) {
        (window as any).electronAPI.broadcastEvent({ type: 'userLoggedIn', payload: user })
            .catch(error => console.error('Failed to broadcast login event to IPC', error));
    }

    private broadcastLogoutEvent() {
        (window as any).electronAPI.broadcastEvent({ type: 'userLoggedOut' })
            .catch(error => console.error('Failed to broadcast logout event to IPC', error));
    }
}
