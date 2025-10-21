import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import type { Location } from '../../../shared/interfaces';
import { apiUrl } from '../../../shared/config';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {}

  getAll(): Observable<Location[]> {
    return this.http.get<Location[]>(apiUrl.locations);
  }

  getById(id: number): Observable<Location> {
    return this.http.get<Location>(`${apiUrl.locations}/${id}`);
  }

  create(location: Omit<Location, 'id'>): Observable<Location[]> {
    return this.http.post<Location[]>(apiUrl.locations, location);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${apiUrl.locations}/${id}`);
  }

  generate(n: number): Observable<Location[]> {
    return this.http.post<Location[]>(apiUrl.generate, { n });
  }

  deleteAll(): Observable<{ message: string; count: number }> {
    return this.http.delete<{ message: string; count: number }>(apiUrl.locations);
  }

  selectLocation(id: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${apiUrl.locations}/select`, { id });
  }
}

