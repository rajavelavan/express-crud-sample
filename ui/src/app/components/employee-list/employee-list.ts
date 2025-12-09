import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { EmployeeService } from '../../services/employee-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-list',
  imports: [RouterLink, CommonModule],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.css',
})
export default class EmployeeList implements OnInit {
    employees: any[] = [];
  loading = true;

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees() {
    this.employeeService.getEmployees().subscribe({
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
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: () => {
          this.employees = this.employees.filter(emp => emp._id !== id);
        },
        error: (err) => console.error('Delete failed:', err)
      });
    }
  }

  goToAdd() {
    this.router.navigate(['/add']);
  }
}
