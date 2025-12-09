import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { EmployeeService } from '../../services/employee-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee-form',
  imports: [FormsModule],
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

  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.params['id'];

    if (this.employeeId) {
      this.isEdit = true;
      this.loadEmployee();
    }
  }

  loadEmployee() {
    this.employeeService.getEmployee(this.employeeId).subscribe({
      next: (res: any) => {
        this.employee = res;
      },
      error: (err) => console.error('Error loading employee:', err)
    });
  }

  submitForm() {
    if (this.isEdit) {
      this.updateEmployee();
    } else {
      this.addEmployee();
    }
  }

  addEmployee() {
    this.employeeService.addEmployee(this.employee).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => console.error('Error adding employee:', err)
    });
  }

  updateEmployee() {
    this.employeeService.updateEmployee(this.employeeId, this.employee).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => console.error('Error updating employee:', err)
    });
  }
}
