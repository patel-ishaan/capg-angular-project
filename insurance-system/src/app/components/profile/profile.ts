import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginService } from '../../services/auth/login-service';
import { ProfileService } from '../../services/profile/profile-service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class ProfileComponent implements OnInit {

  private loginService = inject(LoginService);
  private profileService = inject(ProfileService);

  user: any = null;
  profile: any = null;

  ngOnInit(): void {

  console.log('STEP 1');

  this.user = this.loginService.currentUser();

  console.log('STEP 2 USER:', this.user);

  if (!this.user) {
    console.log('STEP 3 NO USER');
    return;
  }

  console.log('STEP 4 BEFORE API');

  this.profileService.getCustomerProfile(this.user.id)
    .subscribe({
      next: (data) => {

        console.log('STEP 5 DATA:', data);

        this.profile = data[0];

        console.log('STEP 6 PROFILE:', this.profile);
      },
      error: (err) => {
        console.error('STEP ERROR:', err);
      }
    });
}
}