import { CommonModule } from '@angular/common';
import { Component, output, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-custom-moth-picker',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatListModule],
  templateUrl: './custom-moth-picker.component.html',
  styleUrl: './custom-moth-picker.component.scss'
})

export class CustomMothPickerComponent {
  months = [
    { name: 'January', value: 0 },
    { name: 'February', value: 1 },
    { name: 'March', value: 2 },
    { name: 'April', value: 3 },
    { name: 'May', value: 4 },
    { name: 'June', value: 5 },
    { name: 'July', value: 6 },
    { name: 'August', value: 7 },
    { name: 'September', value: 8 },
    { name: 'October', value: 9 },
    { name: 'November', value: 10 },
    { name: 'December', value: 11 }
  ];

  currentMonth: string = '';
  currentYear: string = '';
  
  monthSelected = output<number>();

  ngOnInit() {
    this.adjustMonths();
    this.currentMonth = new Date().toLocaleString('default', { month: 'long' });
    this.currentYear = new Date().getFullYear().toString();

  }

  adjustMonths(): void {
    const currentMonthValue = new Date().getMonth();
    this.months = this.months.filter(month => month.value > currentMonthValue);
  }

  selectMonth(selectedOption: any) {
    const month = selectedOption.options[0].value;
    this.monthSelected.emit(month.value);
    this.currentMonth = month.name;
  }

}
