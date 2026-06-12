import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar';
import { ClaimService } from '../../services/claim/claim.service';
import { LoginService } from '../../services/auth/login-service';
import { Claim } from '../../models/claim.model';

@Component({
  selector: 'app-claims-page',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    RouterLink
  ],
  templateUrl: './claims.html',
  styleUrl: './claims.css'
})
export class ClaimsPageComponent implements OnInit {

  private claimService = inject(ClaimService);
  private loginService = inject(LoginService);

  claims = signal<Claim[]>([]);
  loading = signal(true);

  ngOnInit(): void {

    const user = this.loginService.currentUser();

    if (!user) {
      this.loading.set(false);
      return;
    }

    this.claimService
      .getClaimsForCustomer(user.id)
      .subscribe({

        next: (claims) => {
          this.claims.set(claims);
          this.loading.set(false);
        },

        error: (err) => {
          console.error(err);
          this.loading.set(false);
        }

      });

  }

  getStatusLabel(status: string): string {
    return status.replaceAll('_', ' ');
  }
}