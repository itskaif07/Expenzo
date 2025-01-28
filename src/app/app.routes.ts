import { Routes } from '@angular/router';
import { SignUpComponent } from './components/auth/sign-up/sign-up.component';
import { EmailVerificationComponent } from './components/auth/email-verification/email-verification.component';
import { LogInComponent } from './components/auth/log-in/log-in.component';
import { HomeComponent } from './components/home/home.component';
import { AddExpenseComponent } from './components/expense/add-expense/add-expense.component';
import { ExpenseListComponent } from './components/expense/expense-list/expense-list.component';
import { UpdateExpenseComponent } from './components/expense/update-expense/update-expense.component';
import { ExpenseDetailsComponent } from './components/expense/expense-details/expense-details.component';
import { DeleteExpenseComponent } from './components/expense/delete-expense/delete-expense.component';


export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },

    {
        path: 'home',
        component: HomeComponent
    },

    //Authentication

    {
        path: 'sign-up',
        component: SignUpComponent
    },

    {
        path: 'email-verification',
        component: EmailVerificationComponent
    },

    {
        path: 'log-in',
        component: LogInComponent
    },

    //Expense

    {
        path: 'add-expense',
        component: AddExpenseComponent
    },

    {
        path: 'expenses-list',
        component: ExpenseListComponent
    },

    {
        path: 'expense-details/:id',
        component: ExpenseDetailsComponent
    },

    {
        path: 'update-expense',
        component: UpdateExpenseComponent
    },

    {
        path: 'delete-expense/:id',
        component: DeleteExpenseComponent
    },

];
