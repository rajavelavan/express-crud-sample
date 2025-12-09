import { Routes } from '@angular/router';
import EmployeeListComponent from './components/employee-list/employee-list';
import EmployeeFormComponent from './components/employee-form/employee-form';

export const routes: Routes = [
    { path: '', component: EmployeeListComponent },
    { path: 'add', component: EmployeeFormComponent },
    { path: 'edit/:id', component: EmployeeFormComponent }
];
