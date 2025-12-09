import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private API_URL = `${environment.BACKEND_URL}/api/employees`;

  constructor(private http: HttpClient) {}

  getEmployees() { return this.http.get(this.API_URL); }
  getEmployee(id: string) { return this.http.get(`${this.API_URL}/${id}`); }
  addEmployee(data: any) { return this.http.post(this.API_URL, data); }
  updateEmployee(id: string, data: any) { return this.http.put(`${this.API_URL}/${id}`, data); }
  deleteEmployee(id: string) { return this.http.delete(`${this.API_URL}/${id}`); }
}
