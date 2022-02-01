import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaxRatesInterface } from 'src/app/models/tax-rates.model';

@Injectable({
  providedIn: 'root'
})
export class TaxCalculatorService {
  readonly ENDPOINT = 'http://localhost:8080/tax-calculator/brackets';

  constructor(private http: HttpClient, public snackBar: MatSnackBar) {}

  getTaxBrackets(year?: any) {
    const endpoint = year ? `${this.ENDPOINT}/${year}` : this.ENDPOINT;
    return this.http.get(endpoint).pipe(
      map((response: any) => response['tax_brackets']),
      catchError((error) => {
        if (error.status == 500) {
          this.snackBar.open('Error message: Server Error ', 'Try Again !', {
            duration: 5000
          });
        }
        return of([]);
      })
    ) as Observable<TaxRatesInterface[]>;
  }
}
