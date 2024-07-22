import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  OnInit,
  output,
  Renderer2,
  signal,
  ViewChild,
} from '@angular/core';
import { DateRange, MatCalendar, MatDatepickerModule } from '@angular/material/datepicker';
import { CalendarViewData } from '../../model/calendar-view-data';
import { DataMonthViewComponent } from '../data-month-view/data-month-view.component';

@Component({
  selector: 'app-data-range-view',
  standalone: true,
  imports: [
    MatDatepickerModule,
    DataMonthViewComponent
  ],
  templateUrl: './data-range-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush, 
  styleUrls: ['./data-range-view.component.scss'],

})
export class DataRangeViewComponent implements OnInit, AfterViewInit{
  firstCalendarViewData!: CalendarViewData;
  secondCalendarViewData!: CalendarViewData;

  selectedDates = signal<DateRange<Date> | null>(null);
  // default min date is current date - 10 years.
  minDate = input<Date>(
    new Date(new Date().setFullYear(new Date().getFullYear() - 10))
  );
  // default max date is current date + 10 years.
  maxDate = input<Date>(
    new Date(new Date().setFullYear(new Date().getFullYear() + 10))
  );

  selectedDatesChange = output<DateRange<Date> | null>();

  private isAllowHoverEvent: boolean = false;

  @ViewChild('firstCalendarView') firstCalendarView!: MatCalendar<Date>;
  @ViewChild('secondCalendarView') secondCalendarView!: MatCalendar<Date>;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.initFirstCalendar();
    this.initSecondCalendar();
  }

  ngAfterViewInit(): void {
    this.addFirstCalendarButtonEvents();
    this.attachHoverEventOnFirstViewDates();
    this.attachHoverEventOnSecondViewDates();
    this.addSecondCalendarButtonEvents();
  }

  /**
   * This method gets all eligible cells on second view for hover event.
   */
  attachHoverEventOnSecondViewDates() {
    const nodes = this.el.nativeElement.querySelectorAll('#secondCalendarView .mat-calendar-body-cell');
    setTimeout(() => this.addHoverEvents(nodes), 200);
  }

  /**
   * This method handles second calendar view month selection.
   *
   * @param event Date
   */
  secondViewMonthSelected(event: Date) {
    this.removeDefaultFocus(this);
    setTimeout(() => {
      this.attachHoverEventOnSecondViewDates();
    }, 300);
  }

  /**
   * This method handles first calendar view month selection.
   *
   * @param event Date
   */
  monthSelected(event: Date) {
    this.secondCalendarView._goToDateInView(event, 'year');
    setTimeout(() => this.handleFirstCalendarNextEvent(this, true), 1);
  }

  /**
   * This method updates the date selection range.
   *
   * @param date Date
   */
  updateDateRangeSelection(date: Date | null): void {
    const selectedDates = this.selectedDates();
    if (!selectedDates ||
      (selectedDates.start && selectedDates.end) ||
      (selectedDates.start && date && selectedDates.start > date)
    ) {
      this.selectedDates.set(new DateRange<Date>(date, null));
      this.isAllowHoverEvent = true;
    } else {
      this.isAllowHoverEvent = false;
      this.selectedDates.set(new DateRange<Date>(selectedDates.start, date));
    }
    this.selectedDatesChange.emit(this.selectedDates());
  }

  /**
   * This method handles First calendar prev button event.
   * @param classRef CalendarComponent
   */
  private handleFirstCallDatePrevEvent(classRef: DataRangeViewComponent): void {
    const leftDateCalender = classRef.firstCalendarView;
    if (leftDateCalender.currentView.toLocaleLowerCase() === 'month') {
      const date: Date = new Date(leftDateCalender['_clampedActiveDate']);
      const nextMonthDate = classRef.getFirstDateOfNextMonth(date);
      classRef.secondCalendarView.minDate = nextMonthDate;
      classRef.secondCalendarView._goToDateInView(nextMonthDate, 'month');
      classRef.removeDefaultFocus(classRef);
    }
    classRef.attachHoverEventOnFirstViewDates();
  }

  /**
 * This method handles First calendar prev button event.
 * @param classRef CalendarComponent
 */
//TODO need to confirm will be necessary
  private handleSecondCallDatePrevEvent(classRef: DataRangeViewComponent): void {
    debugger;
    const rightDateCalender = classRef.secondCalendarView;
    if (rightDateCalender.currentView.toLocaleLowerCase() === 'month') {
      const date: Date = new Date(rightDateCalender['_clampedActiveDate']);
      const previousMonthDate = classRef.getFirstDateOfPreviousMonth(date);
      classRef.firstCalendarView.maxDate = previousMonthDate;
      classRef.firstCalendarView._goToDateInView(previousMonthDate, 'month');
      classRef.removeDefaultFocus(classRef);
    }
    classRef.attachHoverEventOnFirstViewDates();
  }
  /**
   * This method gets all eligible cells on first view for hover event.
   */
  private attachHoverEventOnFirstViewDates() {
    const nodes = this.el.nativeElement.querySelectorAll('#firstCalendarView .mat-calendar-body-cell');
    setTimeout(() => this.addHoverEvents(nodes), 200);
  }

  /**
   * This method handle the next button event.
   *
   * @param classRef CalendarComponent
   * @param isForced boolean
   */
  private handleFirstCalendarNextEvent(classRef: DataRangeViewComponent, isForced = false): void {
    const firstCalendar = classRef.firstCalendarView;
    if (firstCalendar.currentView.toLocaleLowerCase() === 'month' || isForced) {
      const date: Date = new Date(firstCalendar['_clampedActiveDate']);
      const nextMonthDate = classRef.getFirstDateOfNextMonth(date);
      classRef.secondCalendarView.minDate = nextMonthDate;
      classRef.secondCalendarView._goToDateInView(nextMonthDate, 'month');
      classRef.removeDefaultFocus(classRef);
    }
    setTimeout(() => {
      classRef.attachHoverEventOnFirstViewDates();
      classRef.attachHoverEventOnSecondViewDates();
    }, 300);
  }

  /**
   * This method remove active focus on second view.
   *
   * @param classRef CalendarComponent
   */
  removeDefaultFocus(classRef: DataRangeViewComponent): void {
    setTimeout(() => {
      const btn: HTMLButtonElement[] = classRef.el.nativeElement.querySelectorAll('#secondCalendarView button.mat-calendar-body-active');
      if (btn?.length) {
        btn[0].blur();
      }
    }, 1);
  }

  /**
   * This method attaches next and prev events on buttons.
   *
   */
  private addFirstCalendarButtonEvents(): void {
    const monthPrevBtn = this.el.nativeElement.querySelectorAll('#firstCalendarView .mat-calendar-previous-button');
    const monthNextBtn = this.el.nativeElement.querySelectorAll('#firstCalendarView .mat-calendar-next-button');
    this.attachClickEvent(monthPrevBtn, this.handleFirstCallDatePrevEvent);
    this.attachClickEvent(monthNextBtn, this.handleFirstCalendarNextEvent);
  }

  /**
   * This method attaches next and prev events on buttons.
   *
   */
  private addSecondCalendarButtonEvents(): void {
    const monthPrevBtn: any[] = this.el.nativeElement.querySelectorAll('#secondCalendarView .mat-calendar-previous-button');
    const monthNextBtn: any[] = this.el.nativeElement.querySelectorAll('#secondCalendarView .mat-calendar-next-button');
    if (!monthPrevBtn || !monthNextBtn) {
      return;
    }
    // this.attachClickEvent(monthPrevBtn, this.handleSecondCallDatePrevEvent);
    this.attachSecondViewClickEvent(monthPrevBtn);
    this.attachSecondViewClickEvent(monthNextBtn);
  }

  /**
   * This method attach click event of next and prev button on second view.
   *
   */
  private attachSecondViewClickEvent(nodes: any): void {
    Array.from(nodes).forEach((button) => {
      this.renderer.listen(button, 'click', () => {
        this.attachHoverEventOnSecondViewDates();
      });
    });
  }

  /**
   * This method will update the range selection on mouse hover event.
   *
   * @param date Date
   */
  private updateSelectionOnMouseHover(date: Date): void {
    const selectedDates = this.selectedDates();
    if (selectedDates?.start && date && selectedDates.start < date) {
      const dateRange: DateRange<Date> = new DateRange<Date>(selectedDates.start, date);
      this.firstCalendarView.selected = dateRange;
      this.secondCalendarView.selected = dateRange;
      this.firstCalendarView['_changeDetectorRef'].markForCheck();
      this.secondCalendarView['_changeDetectorRef'].markForCheck();
      this.isAllowHoverEvent = true;
    }
  }

  /**
   * This method attach hover event on specified nodes.
   *
   * @param nodes any
   */
  private addHoverEvents(nodes: any): void {
    if (!nodes) {
      return;
    }
    Array.from(nodes).forEach((button) => {
      this.renderer.listen(button, 'mouseover', (event) => {
        if (this.isAllowHoverEvent) {
          const date = new Date(event.target['ariaLabel']);
          this.updateSelectionOnMouseHover(date);
        }
      });
    });
  }

  /**
   * This method attach the next and prev events on specified nodes.
   *
   * @param nodes any
   * @param handler Function
   */
  private attachClickEvent(nodes: any, handler: Function): void {
    if (!nodes) {
      return;
    }
    Array.from(nodes).forEach((button) => {
      this.renderer.listen(button, 'click', () => {
        handler(this);
      });
    });
  }

  /**
   * This method initialize data for first calendar view.
   */
  private initFirstCalendar(): void {
    this.firstCalendarViewData = new CalendarViewData();
    this.firstCalendarViewData.startDate = new Date();
  }

  /**
   * This method initialize data for second calendar view.
   */
  private initSecondCalendar(): void {
    const currDate = new Date();
    this.secondCalendarViewData = new CalendarViewData();
    this.secondCalendarViewData.minDate = this.getFirstDateOfNextMonth(currDate);
    currDate.setMonth(currDate.getMonth() + 1);
    const selectedEndDate = this.selectedDates()?.end;
    this.secondCalendarViewData.startDate = selectedEndDate ? selectedEndDate : currDate;
  }

  /**
   * This method returns the next months first date.
   *
   * @param currDate Date
   * @returns Date
   */
  private getFirstDateOfNextMonth(currDate: Date): Date {
    return new Date(currDate.getFullYear(), currDate.getMonth() + 1, 1);
  }

   /**
   * This method returns the previous months first date.
   *
   * @param currDate Date
   * @returns Date
   */
   private getFirstDateOfPreviousMonth(currDate: Date): Date {
    return new Date(currDate.getFullYear(), currDate.getMonth() - 1, 1);
  }
}
