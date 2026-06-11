// src/app/pages/admin/users/users.ts
import { Component, computed, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../../models/user.model';
import { UserService } from '../../../services/admin/admin-user.service';

interface EnrichedUser extends User {
  profile?: any;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.html',
  styleUrls: ['./users.css'],
})
export class Users implements OnInit {
  users = signal<User[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  selectedUser = signal<EnrichedUser | null>(null);

  searchName = signal('');

  filteredUsers = computed(() => {
    let users = this.users();
    const nameFilter = this.searchName().toLowerCase().trim();

    if (nameFilter) {
      users = users.filter((user) => user.name.toLowerCase().includes(nameFilter));
    }

    return users;
  });

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading.set(true);
    this.error.set(null);
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load users. Please try again.');
        this.loading.set(false);
        console.error(err);
      },
    });
  }

  refreshUsers(): void {
    this.loadUsers();
  }

  viewDetails(user: User): void {
    this.selectedUser.set({ ...user, profile: null });

    if (user.role === 'customer') {
      this.userService.getCustomerProfileByUserId(user.id).subscribe({
        next: (profile) => {
          this.selectedUser.update((current) => (current ? { ...current, profile } : null));
        },
        error: (err) => {
          console.error('Failed to load customer profile', err);
        },
      });
    }
  }

  deleteUser(user: User): void {
    if (
      confirm(`Are you sure you want to delete user "${user.name}"? This action cannot be undone.`)
    ) {
      this.userService.deleteUser(user.id).subscribe({
        next: () => {
          this.users.update((prev) => prev.filter((u) => u.id !== user.id));
          alert('User deleted successfully');
        },
        error: (err) => {
          console.error('Delete failed', err);
          alert('Failed to delete user');
        },
      });
    }
  }

  closeModal(): void {
    this.selectedUser.set(null);
  }

  getNomineeCount(user: User | null): number {
    const enriched = user as EnrichedUser;
    return enriched?.profile?.nominees?.length ?? 0;
  }

  getAddress(user: EnrichedUser | null): any {
    return user?.profile?.address || null;
  }

  getCommunicationPref(user: EnrichedUser | null): any {
    return user?.profile?.communicationPref || null;
  }

  getNominees(user: EnrichedUser | null): any[] {
    return user?.profile?.nominees || [];
  }

  toggleRole(user: User): void {
    const newRole = user.role === 'customer' ? 'admin' : 'customer';
    if (confirm(`Change role of "${user.name}" from ${user.role} to ${newRole}?`)) {
      this.userService.toggleUserRole(user).subscribe({
        next: (updatedUser) => {
          this.users.update((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
          this.selectedUser.update((current) =>
            current?.id === updatedUser.id ? { ...current, role: updatedUser.role } : current,
          );
          alert('Role updated successfully');
        },
        error: (err) => {
          console.error('Failed to update role', err);
          alert('Failed to update role');
        },
      });
    }
  }
}
