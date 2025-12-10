import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { EmployeeService } from '../../services/employee-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-form',
  imports: [FormsModule, CommonModule],
  templateUrl: './employee-form.html',
  styleUrl: './employee-form.css',
})
export default class EmployeeForm {
  employee = {
    name: '',
    email: '',
    position: '',
    salary: null as number | null
  };

  isEdit = false;
  employeeId!: string;
  loading = false;
  errorMessage = '';

  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id') || '';

    if (this.employeeId) {
      this.isEdit = true;
      this.loadEmployee();
    }
  }

  loadEmployee() {
    this.loading = true;
    this.employeeService.getEmployee(this.employeeId).subscribe({
      next: (res: any) => {
        this.employee = { ...res };
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading employee:', err);
        this.errorMessage = 'Failed to load employee data';
        this.loading = false;
      }
    });
  }

  submitForm() {
    if (!this.validateForm()) {
      this.errorMessage = 'Please fill all fields correctly';
      return;
    }

    if (this.isEdit) {
      this.updateEmployee();
    } else {
      this.addEmployee();
    }
  }

  validateForm(): boolean {
    return !!(this.employee.name && this.employee.email && 
              this.employee.position && this.employee.salary);
  }

  addEmployee() {
    this.loading = true;
    this.employeeService.addEmployee(this.employee).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Error adding employee:', err);
        this.errorMessage = 'Failed to add employee';
        this.loading = false;
      }
    });
  }

  updateEmployee() {
    this.loading = true;
    this.employeeService.updateEmployee(this.employeeId, this.employee).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Error updating employee:', err);
        this.errorMessage = 'Failed to update employee';
        this.loading = false;
      }
    });
  }

  cancelForm() {
    this.router.navigate(['/']);
  }
}
