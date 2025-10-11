import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  username?: string;
  firstName?: string;
  lastName?: string;
}
export interface UserProfile {
  email: string;
  username: string;
  avatarUrl?: string;
  firstName?: string;
  lastName?: string;
  Credit?: number;
  freeSpin?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = environment.KEY_TO_READ;
  constructor(private http: HttpClient) { }
  login(data: LoginDto): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/auth/login`, data, { withCredentials: true });
  }
  register(data: RegisterDto): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/auth/register`, data, { withCredentials: true });
  }
  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.API_URL}/auth/check/me`, { withCredentials: true });
  }
  logout(): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/auth/logout`, {}, { withCredentials: true });
  }
}
