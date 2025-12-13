import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { EmployeeService } from '../../services/employee-service';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-employee-list',
  imports: [RouterLink, CommonModule],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.css',
})
export default class EmployeeList implements OnInit {
    employees: any[] = [];
  loading = true;
  private destroy$ = new Subject<void>();

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees() {
    this.employeeService.getAllEmployees().subscribe({
      next: (res: any) => {
        this.employees = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching employee list:', err);
        this.loading = false;
      }
    });
  }

  deleteEmployee(id: string) {
    if (confirm('Delete this employee? You can restore it later.')) {
      this.employeeService.softDeleteEmployee(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.employees = this.employees.filter(emp => emp._id !== id);
          },
          error: (err) => console.error('Delete failed:', err)
        });
    }
  }

  permanentDeleteEmployee(id: string) {
    if (confirm('WARNING: Permanently delete this employee? This cannot be undone!')) {
      this.employeeService.permanentDeleteEmployee(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.employees = this.employees.filter(emp => emp._id !== id);
          },
          error: (err) => console.error('Permanent delete failed:', err)
        });
    }
  }

  restoreEmployee(id: string) {
    this.employeeService.restoreEmployee(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadEmployees();
        },
        error: (err) => console.error('Restore failed:', err)
      });
  }

  goToAdd() {
    this.router.navigate(['/add']);
  }
}
