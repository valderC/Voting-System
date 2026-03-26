import { Routes } from '@angular/router';
import { PollListComponent } from './components/poll-list/poll-list.component';
import { CreatePollComponent } from './components/create-poll/create-poll.component';
import { PollDetailComponent } from './components/poll-detail/poll-detail.component';
import { LoginComponent } from './components/login/login.component';
import { EditPollComponent } from './components/edit-poll/edit-poll.component';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', component: PollListComponent },
  { path: 'login', component: LoginComponent },
  { path: 'create', component: CreatePollComponent, canActivate: [adminGuard] },
  { path: 'polls/:id', component: PollDetailComponent },
  { path: 'polls/:id/edit', component: EditPollComponent, canActivate: [adminGuard] },
];
