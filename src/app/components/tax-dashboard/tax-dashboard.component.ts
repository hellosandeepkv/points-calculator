import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TaxCalculatorService } from 'src/app/services/tax-calculator-service/tax-calculator.service';
import { TaxRatesInterface } from '../../models/tax-rates.model';

@Component({
  selector: 'app-tax-dashboard',
  templateUrl: './tax-dashboard.component.html',
  styleUrls: ['./tax-dashboard.component.scss']
})
export class TaxDashboardComponent {
  readonly REQUIRED = [Validators.required];
  readonly YEARS = [2019, 2020];
  readonly displayedColumns: string[] = ['min', 'max', 'rate'];

  taxDue = 0;
  taxRate = 0;
  taxBracketMin = '';
  taxBracketMax = '';
  taxBracketApplied: TaxRatesInterface | null | undefined;

  dataSource = new MatTableDataSource([]);

  taxForm = new FormGroup({
    year: new FormControl('', this.REQUIRED),
    amount: new FormControl('', this.REQUIRED)
  });

  constructor(private taxAPIService: TaxCalculatorService) {}

  // This method will fetch tax rates from API based on year input
  fetchTaxBrackets(year?: any) {
    this.taxAPIService
      .getTaxBrackets(year)
      .subscribe((response: TaxRatesInterface[]) => {
        this.dataSource.data = response;
        if (response.length) {
          this.calulateRange(response);
        }
      });
  }
  // This method will determine the tax bracket based on input amount
  calulateRange(data: TaxRatesInterface[]) {
    const AMOUNT = parseInt(this.amount.value);
    if (AMOUNT > 0) {
      const RANGE = data.filter(
        (tax) => tax.min <= AMOUNT && AMOUNT <= tax.max
      );
      if (RANGE.length) {
        this.calculateRate(RANGE[0], AMOUNT);
        return;
      }
      this.calculateRate(data[data.length - 1], AMOUNT);
    }
  }
  // This method will calculate the tax rate based on range and amount
  calculateRate(range: TaxRatesInterface, amount: any) {
    this.taxBracketApplied = range;
    this.taxBracketMin = JSON.stringify(range.min);
    this.taxBracketMax = JSON.stringify(range.max);
    const TAXRATE = range.rate;
    const TAXAMT = amount * TAXRATE;
    this.taxDue = TAXAMT;
    this.taxRate = TAXRATE;
  }

  get year() {
    return this.taxForm.get('year');
  }
  get amount() {
    return this.taxForm.get('amount');
  }
}
