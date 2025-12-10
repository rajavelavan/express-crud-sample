import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, shareReplay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private API_URL = `${environment.BACKEND_URL}/api/employees`;
  private employeesCache$ = new BehaviorSubject<any[]>([]);
  private employeeCacheMap = new Map<string, any>();
  private cacheTime = new Map<string, number>();
  private CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<any[]> {
    const now = Date.now();
    const cachedTime = this.cacheTime.get('employees') || 0;

    if (
      this.employeesCache$.value.length > 0 &&
      now - cachedTime < this.CACHE_DURATION
    ) {
      return of(this.employeesCache$.value);
    }

    return this.http.get<any[]>(`${this.API_URL}/all/deleted-users`).pipe(
      tap((data) => {
        this.employeesCache$.next(data);
        this.cacheTime.set('employees', now);
      }),
      catchError((err) => {
        console.error('Error fetching employees:', err);
        return of(this.employeesCache$.value);
      }),
      shareReplay(1)
    );
  }

  getEmployee(id: string): Observable<any> {
    const now = Date.now();
    const cachedTime = this.cacheTime.get(`employee-${id}`) || 0;

    if (
      this.employeeCacheMap.has(id) &&
      now - cachedTime < this.CACHE_DURATION
    ) {
      return of(this.employeeCacheMap.get(id));
    }

    return this.http.get(`${this.API_URL}/${id}`).pipe(
      tap((data) => {
        this.employeeCacheMap.set(id, data);
        this.cacheTime.set(`employee-${id}`, now);
      }),
      catchError((err) => {
        console.error('Error fetching employee:', err);
        return of(this.employeeCacheMap.get(id) || {});
      })
    );
  }

  getAllEmployeesWithDeleted(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/all/users`).pipe(
      catchError((err) => {
        console.error('Error fetching all employees:', err);
        return of([]);
      })
    );
  }

  getDeletedEmployees(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/deleted/list`).pipe(
      catchError((err) => {
        console.error('Error fetching deleted employees:', err);
        return of([]);
      })
    );
  }

  addEmployee(data: any): Observable<any> {
    return this.http.post(`${this.API_URL}/add-user`, data).pipe(
      tap(() => this.invalidateCache()),
      catchError((err) => {
        console.error('Error adding employee:', err);
        throw err;
      })
    );
  }

  updateEmployee(id: string, data: any): Observable<any> {
    return this.http.put(`${this.API_URL}/${id}`, data).pipe(
      tap(() => this.invalidateCache()),
      catchError((err) => {
        console.error('Error updating employee:', err);
        throw err;
      })
    );
  }

  // Soft delete
  softDeleteEmployee(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`).pipe(
      tap(() => this.invalidateCache()),
      catchError((err) => {
        console.error('Error deleting employee:', err);
        throw err;
      })
    );
  }

  // Hard delete (permanent)
  permanentDeleteEmployee(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}/permanent-delete`).pipe(
      tap(() => this.invalidateCache()),
      catchError((err) => {
        console.error('Error permanently deleting employee:', err);
        throw err;
      })
    );
  }

  // Restore soft deleted employee
  restoreEmployee(id: string): Observable<any> {
    return this.http.patch(`${this.API_URL}/${id}/restore-user`, {}).pipe(
      tap(() => this.invalidateCache()),
      catchError((err) => {
        console.error('Error restoring employee:', err);
        throw err;
      })
    );
  }

  private invalidateCache() {
    this.employeesCache$.next([]);
    this.employeeCacheMap.clear();
    this.cacheTime.clear();
  }
}
