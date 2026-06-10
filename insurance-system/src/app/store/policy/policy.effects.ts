import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { PolicyCatalogService } from '../../services/policy-catalog';
import {
  loadPolicies,
  loadPoliciesSuccess,
  loadPoliciesFailure
} from './policy.actions';

@Injectable()
export class PolicyEffects {

  private actions$ = inject(Actions);
  private policyCatalogService = inject(PolicyCatalogService);

  loadPolicies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadPolicies),
      switchMap(() =>
        this.policyCatalogService.getActivePolicies().pipe(
          map(policies => loadPoliciesSuccess({ policies })),
          catchError(error => of(loadPoliciesFailure({ error: error.message })))
        )
      )
    )
  );
}