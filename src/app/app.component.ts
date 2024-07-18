import {  ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, EventEmitter, Input, Output, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DateRange, MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule, DatePipe } from '@angular/common';
import { NgDatePickerModule, SelectedDateEvent } from 'ng-material-date-range-picker';
import { LibCalendarComponent } from './lib-calendar/lib-calendar.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ISelectDateOption } from './model/select-date-option';
import { InputsModule, SharedModule, SwitchesModule } from '@triparc/nexus';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ReactiveFormsModule,
    MatButtonModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    NgDatePickerModule,
    LibCalendarComponent,
    OverlayModule,
    MatIconModule,
    MatTooltipModule,
    SwitchesModule,
    InputsModule,
    SharedModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent {
  title = 'datepickerdemo';

  isCustomRange: boolean = false;
  selectedDates!: DateRange<Date> | null;
  dateFormat: string = 'dd/MM/yyyy';
  hideDefaultOptions: boolean = true;
  cdkConnectedOverlayOffsetX = 0;
  cdkConnectedOverlayOffsetY = 0;

  inputLabel: string = 'Date Range';
  calendarId: string = 'custom-calendar';
  sideBySide: boolean = true;
  viewLabel: string = 'Date Range';

  formGroup = new FormGroup({
    datesInput: new FormControl('', [Validators.required])
  });

   // default min date is current date - 10 years.
   @Input() minDate = new Date(
    new Date().setFullYear(new Date().getFullYear() - 10)
  );

  // default max date is current date + 10 years.
  @Input() maxDate = new Date(
    new Date().setFullYear(new Date().getFullYear() + 10)
  );

  @Output() onDateSelectionChanged: EventEmitter<SelectedDateEvent>;

  constructor(private cdref: ChangeDetectorRef, private el: ElementRef) {
    this.onDateSelectionChanged = new EventEmitter<SelectedDateEvent>();
  }

  private _dateDropDownOptions: ISelectDateOption[] = [];
  isDateOptionList: boolean = false;

  ngOnInit(): void {
    this.updateDefaultDatesValues();
  }

  ngAfterViewInit(): void {
    this.updateDefaultDatesValues();
  }

  /**
   * This method updates the date range on button click.
   *
   * @param input HTMLInputElement
   * @param selectedDates DateRange<Date>
   */
  updateCustomRange(selectedDates: DateRange<Date> | null): void {
    this.updateSelectedDates(selectedDates?.start ?? new Date(), selectedDates?.end ?? new Date());
  }

  /**
   * This method toggles the custom date range selection view.
   */
  toggleCustomDateRangeView(): void {
    this.isCustomRange = !this.isCustomRange;
  }

  /**
   * Clears the selected dates and resets date-related properties.
   *
   * @param event - The mouse event that triggered the clear action.
   */
  clearSelection(event: MouseEvent): void {
    event.stopImmediatePropagation();
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    this.minDate = new Date(currentDate.setFullYear(year - 10));
    this.maxDate = new Date(currentDate.setFullYear(year + 10));
    this.selectedDates = null;

    const dateInputField =
      this.el.nativeElement.querySelector('#date-input-field');
    if (dateInputField) {
      dateInputField.value = '';
    }
    this.cdref.markForCheck();
    const selectedDateEventData: SelectedDateEvent = {
      range: null,
      selectedOption: null,
    };
    this.onDateSelectionChanged.emit(selectedDateEventData);
  }

  /**
   * This method updates dates on selection.
   *
   * @param input HTMLInputElement
   * @param startDate Date
   * @param endDate Date
   */
  private updateSelectedDates(startDate: Date, endDate: Date): void {
    this.selectedDates = new DateRange<Date>(startDate, endDate);
    // input.value =
    //   this.getDateString(startDate) + ' - ' + this.getDateString(endDate);

    this.formGroup.setValue({
      datesInput: this.getDateString(startDate) + ' - ' + this.getDateString(endDate)
    });


    const selectedDateEventData: SelectedDateEvent = {
      range: this.selectedDates,
      selectedOption: null,
    };
    this.onDateSelectionChanged.emit(selectedDateEventData);
    this.cdref.markForCheck();
  }

  /**
   * This method converts the given date into specified string format.
   *
   * @param date Date
   * @returns formatted date.
   */
  private getDateString(date: Date): string {
    const datePipe = new DatePipe('en');
    return datePipe.transform(date, this.dateFormat) ?? '';
  }

  /**
   * This method update the default date values on init.
   */
  private updateDefaultDatesValues(): void {
    const input: HTMLInputElement =
      this.el.nativeElement.querySelector('#date-input-field');
    if (
      this.selectedDates &&
      this.selectedDates.start &&
      this.selectedDates.end
    ) {
      input.value =
        this.getDateString(this.selectedDates.start) +
        ' - ' +
        this.getDateString(this.selectedDates.end);
    }
    this.cdref.detectChanges();
  }

  onToggleChanged(event: any): void {
    this.sideBySide = event;
    this.isCustomRange = !this.isCustomRange;
    this.viewLabel = event ? "Data Range" : "Month"
  }
  
 
}