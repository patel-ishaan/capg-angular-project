import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { LoginService } from '../../services/auth/login-service';
import { ProfileService } from '../../services/profile/profile-service';
import { NavbarComponent } from '../navbar/navbar';
import { User, CustomerProfile } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class ProfileComponent implements OnInit {

  private loginService = inject(LoginService);
  private profileService = inject(ProfileService);
  private cdr = inject(ChangeDetectorRef);

  user: User | null = null;
  profile: CustomerProfile | null = null;
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.user = this.loginService.currentUser();

    if (!this.user) {
      this.loading = false;
      this.error = 'You are not logged in.';
      this.cdr.detectChanges();
      return;
    }

    this.profileService.getCustomerProfile(this.user.id).subscribe({
      next: (data) => {
        this.profile = data[0] ?? null;
        this.loading = false;
        if (!this.profile) {
          this.error = 'No profile data found for your account.';
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Profile fetch error:', err);
        this.loading = false;
        this.error = 'Failed to load profile. Please try again.';
        this.cdr.detectChanges();
      }
    });
  }
}
