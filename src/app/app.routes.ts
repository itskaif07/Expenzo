import { Routes } from '@angular/router';
import { SignUpComponent } from './components/auth/sign-up/sign-up.component';
import { EmailVerificationComponent } from './components/auth/email-verification/email-verification.component';
import { LogInComponent } from './components/auth/log-in/log-in.component';
import { HomeComponent } from './components/home/home.component';
import { AddExpenseComponent } from './components/expense/add-expense/add-expense.component';
import { ExpenseListComponent } from './components/expense/expense-list/expense-list.component';
import { ExpenseDetailsComponent } from './components/expense/expense-details/expense-details.component';
import { DeleteExpenseComponent } from './components/expense/delete-expense/delete-expense.component';
import { MonthlyDataComponent } from './components/expense/monthly-data/monthly-data.component';
import { MonthlyListComponent } from './components/expense/monthly-list/monthly-list.component';


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
        path: 'delete-expense/:id',
        component: DeleteExpenseComponent
    },

    {
        path: 'monthly-expense/:date',
        component: MonthlyDataComponent
    },

    {
        path:'monthly-list/:date',
        component:MonthlyListComponent
    },


];
