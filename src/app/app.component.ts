import {  Component, computed, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Renderer2, signal, ViewChild} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { DateRange } from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {  DatePipe } from '@angular/common';
import {  SelectedDateEvent } from 'ng-material-date-range-picker';
import { CdkConnectedOverlay, OverlayModule } from '@angular/cdk/overlay';
import { InputsModule, SharedModule } from '@triparc/nexus';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { DataRangeViewComponent } from './calendar/data-range-view/data-range-view.component';
import { DataMonthViewComponent } from './calendar/data-month-view/data-month-view.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ReactiveFormsModule,
    MatButtonModule,
    FormsModule,
    DataRangeViewComponent,
    OverlayModule,
    InputsModule,
    SharedModule,
    MatButtonToggleModule,
    DataMonthViewComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [DatePipe]
})

export class AppComponent {
  title = 'datepickerdemo';

  isCustomRange = signal<boolean>(false);
  selectedDates = signal<DateRange<Date> | null>(null);

  //maybe model
  selectedValue: string = 'dateRange';
  prefixIconName = signal<string>('search');
  sideBySide = signal<boolean>(true);
  datesSelected = computed(() => !!this.selectedDates()?.start && !!this.selectedDates()?.end);

  formGroup = new FormGroup({
    datesInput: new FormControl('', [Validators.required])
  });
 
  @ViewChild(CdkConnectedOverlay) overlay: CdkConnectedOverlay | undefined;
  
  constructor(private el: ElementRef, private renderer: Renderer2) {
  }

  /**
   * This method updates the date range on button click.
   *
   * @param input HTMLInputElement
   * @param selectedDates DateRange<Date>
   */
  updateSelectedDates(): void {
    this.prefixIconName.set("date_range");
    const selectedDates = this.selectedDates();
    const start = selectedDates?.start ? this.getDateString(selectedDates.start) : '';
    const end = selectedDates?.end ? this.getDateString(selectedDates.end) : '';
    if (start && end) {
      this.formGroup.setValue({
        datesInput: `${start} - ${end}`
      });
    } else {
      this.formGroup.setValue({
        datesInput: ''
      });
    }
    
    this.isCustomRange.set(false);
  }

  /**
   * This method toggles the custom date range selection view.
   */
  toggleCustomDateRangeView(): void {
    this.isCustomRange.update(isCustomRange => !isCustomRange);
  }

  /**
   * Clears the selected dates and resets date-related properties.
   *
   * @param event - The mouse event that triggered the clear action.
   */
  clearSelection(event: MouseEvent): void {
    event.stopImmediatePropagation();
    this.selectedDates.set(null);
    this.formGroup.setValue({
      datesInput: ''
    });
  }

  /**
   * This method converts the given date into specified string format.
   *
   * @param date Date
   * @returns formatted date.
   */
  private getDateString(date: Date): string {
    const datePipe = new DatePipe('en');
    return datePipe.transform(date, 'dd/MM/yyyy') ?? '';
  }

  cleanDates(): void{
    this.prefixIconName.set('search');
    this.isCustomRange.set(false);
    this.formGroup.patchValue({
      datesInput: ''
    });
  }

  onToggleChanged(): void {
    this.sideBySide.update(sideBySide => !sideBySide);
    this.setOverlayClass();
  }

  setOverlayClass() {
    if (this.overlay && this.overlay.overlayRef) {
      const overlayPane = this.overlay.overlayRef.overlayElement;
      if (this.sideBySide()) {
        this.renderer.addClass(overlayPane, 'side-by-side');
        this.renderer.removeClass(overlayPane, 'one-side');
      } else {
        this.renderer.addClass(overlayPane, 'one-side');
        this.renderer.removeClass(overlayPane, 'side-by-side');
      }
    }
  }

  onSelectedDatesChange(dates: DateRange<Date> | null): void {
    this.selectedDates.set(dates);
    if (dates) {
      if(dates.start && dates.end) {        
        this.formGroup.patchValue({
          datesInput: `${this.getDateString(dates.start)} - ${this.getDateString(dates.end)}`
        });
      }
      else if(dates.start){
        this.formGroup.patchValue({
          datesInput: `${this.getDateString(dates.start)}`
        });
      }
    } else {
      this.formGroup.patchValue({
        datesInput: ''
      });
    }
  }

  onMonthSelected(selectedMonth : any): void {
    var today = new Date();

    const currentDate = new Date();
    var dateSelected = new Date(currentDate.getFullYear(), selectedMonth, 1);
    var startDate = null;
    var endDate = null;
    if (today <= dateSelected){
      startDate = new Date(dateSelected.getFullYear(), dateSelected.getMonth(), 1);
      endDate = new Date(dateSelected.getFullYear(), dateSelected.getMonth() + 1, 0);
    }
    else{
      startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    }
    this.selectedDates.set(new DateRange<Date>(startDate, endDate));

    this.formGroup.patchValue({
      datesInput: `${this.getDateString(startDate)} - ${this.getDateString(endDate)}`
    });
  }

}