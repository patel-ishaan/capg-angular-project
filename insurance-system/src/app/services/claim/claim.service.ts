import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, map } from 'rxjs';
import { Claim } from '../../models/claim.model';

@Injectable({
  providedIn: 'root'
})
export class ClaimService {

  private http = inject(HttpClient);

  private claimsUrl = 'http://localhost:3000/claims';
  private purchasesUrl = 'http://localhost:3000/purchases';
  private baseUrl = 'http://localhost:3000';

  getClaimsForCustomer(userId: string): Observable<Claim[]> {

    return this.http.get<any[]>(
      `${this.purchasesUrl}?customerId=${userId}`
    ).pipe(

      switchMap(purchases => {

        const purchaseIds = purchases.map(
          purchase => purchase.id
        );

        return this.http.get<Claim[]>(this.claimsUrl).pipe(

          map(claims =>
            claims.filter(claim =>
              purchaseIds.includes(claim.purchaseId)
            )
          )

        );

      })

    );
  }

  getClaim(id: string): Observable<Claim> {
    return this.http.get<Claim>(
      `${this.claimsUrl}/${id}`
    );
  }

  submitClaim(claim: Partial<Claim>): Observable<Claim> {
  return this.http.post<Claim>(this.claimsUrl, claim);
}
getAllClaims() {
  return this.http.get<Claim[]>(
    `${this.baseUrl}/claims`
  );
}

updateClaim(
  id: string,
  data: Partial<Claim>
) {
  return this.http.patch<Claim>(
    `${this.baseUrl}/claims/${id}`,
    data
  );
}
}
