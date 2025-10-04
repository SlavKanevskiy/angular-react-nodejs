import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import type { Location } from '../../../shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/api/locations';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Location[]> {
    return this.http.get<Location[]>(this.apiUrl);
  }

  getById(id: number): Observable<Location> {
    return this.http.get<Location>(`${this.apiUrl}/${id}`);
  }

  create(location: Omit<Location, 'id'>): Observable<Location> {
    return this.http.post<Location>(this.apiUrl, location);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  generate(n: number): Observable<{ created: number }> {
    return this.http.post<{ created: number }>(`${this.apiUrl}/generate`, { n });
  }

  deleteAll(): Observable<{ message: string; count: number }> {
    return this.http.delete<{ message: string; count: number }>(this.apiUrl);
  }
}

