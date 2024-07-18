import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  input,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { DateRange, MatCalendar, MatDatepickerModule } from '@angular/material/datepicker';
import { CalendarViewData } from '../model/calendar-view-data';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CustomMothPickerComponent } from '../custom-moth-picker/custom-moth-picker.component';
import { SwitchesModule } from '@triparc/nexus';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lib-calendar',
  standalone: true,
  imports: [
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    CustomMothPickerComponent,
    SwitchesModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    FormsModule
  ],
  templateUrl: './lib-calendar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush, 
  styleUrls: ['./lib-calendar.component.scss'],

})
export class LibCalendarComponent implements OnInit, AfterViewInit{
  firstCalendarViewData!: CalendarViewData;
  secondCalendarViewData!: CalendarViewData;
  isCustomRange: boolean = false;
  sideBySide: boolean = true;

  @Input() selectedDates!: DateRange<Date> | null;

  public minDate = input<Date>();
  public maxDate = input<Date>();

  private isAllowHoverEvent: boolean = false;
  selectedValue: string = 'dateRange';

  @ViewChild('firstCalendarView') firstCalendarView!: MatCalendar<Date>;
  @ViewChild('secondCalendarView') secondCalendarView!: MatCalendar<Date>;

  constructor(
    private cdref: ChangeDetectorRef,
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

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
    const nodes = this.el.nativeElement.querySelectorAll(
      '#secondCalendarView .mat-calendar-body-cell'
    );
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
  
    this.selectedDates = new DateRange<Date>(startDate, endDate);

  }

  /**
   * This method updates the date selection range.
   *
   * @param date Date
   */
  updateDateRangeSelection(date: Date | null): void {
    const selectedDates = this.selectedDates;
    if (
      !selectedDates ||
      (selectedDates.start && selectedDates.end) ||
      (selectedDates.start && date && selectedDates.start > date)
    ) {
      this.selectedDates = new DateRange<Date>(date, null);
      this.isAllowHoverEvent = true;
    } else {
      this.isAllowHoverEvent = false;
      this.selectedDates = new DateRange<Date>(selectedDates.start, date);
    }
    debugger;
    this.cdref.markForCheck();
  }

  // updateDatemonthSelection(date: Date | null): void {
  //   const selectedDates = this.selectedDates;
  //   if (
  //     !selectedDates ||
  //     (selectedDates.start && selectedDates.end) ||
  //     (selectedDates.start && date && selectedDates.start > date)
  //   ) {
  //     this.selectedDates = new DateRange<Date>(date, null);
  //     this.isAllowHoverEvent = true;
  //   } else {
  //     this.isAllowHoverEvent = false;
  //     this.selectedDates = new DateRange<Date>(selectedDates.start, date);
  //   }
  //   this.cdref.markForCheck();
  // }

  /**
   * This method handles First calendar prev button event.
   * @param classRef CalendarComponent
   */
  private handleFirstCalDatePrevEvent(classRef: LibCalendarComponent): void {
    const leftDateCalender = classRef.firstCalendarView;
    if (leftDateCalender.currentView.toLocaleLowerCase() === 'month') {
      const date: Date = new Date(leftDateCalender['_clampedActiveDate']);
      classRef.secondCalendarView.minDate =
        classRef.getFirstDateOfNextMonth(date);
      classRef.cdref.markForCheck();
    }
    classRef.attachHoverEventOnFirstViewDates();
  }

  /**
   * This method gets all eligible cells on first view for hover event.
   */
  private attachHoverEventOnFirstViewDates() {
    const nodes = this.el.nativeElement.querySelectorAll(
      '#firstCalendarView .mat-calendar-body-cell'
    );
    setTimeout(() => this.addHoverEvents(nodes), 200);
  }

  /**
   * This method handle the next button event.
   *
   * @param classRef CalendarComponent
   * @param isForced boolean
   */
  private handleFirstCalendarNextEvent(
    classRef: LibCalendarComponent,
    isForced = false
  ): void {
    const firstCalendar = classRef.firstCalendarView;
    if (firstCalendar.currentView.toLocaleLowerCase() === 'month' || isForced) {
      const date: Date = new Date(firstCalendar['_clampedActiveDate']);
      const nextMonthDate = classRef.getFirstDateOfNextMonth(date);
      classRef.secondCalendarView.minDate = nextMonthDate;
      classRef.secondCalendarView._goToDateInView(nextMonthDate, 'month');
      classRef.removeDefaultFocus(classRef);
      classRef.cdref.markForCheck();
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
  removeDefaultFocus(classRef: LibCalendarComponent): void {
    setTimeout(() => {
      const btn: HTMLButtonElement[] =
        classRef.el.nativeElement.querySelectorAll(
          '#secondCalendarView button.mat-calendar-body-active'
        );
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
    const monthPrevBtn = this.el.nativeElement.querySelectorAll(
      '#firstCalendarView .mat-calendar-previous-button'
    );
    const monthNextBtn = this.el.nativeElement.querySelectorAll(
      '#firstCalendarView .mat-calendar-next-button'
    );
    this.attachClickEvent(monthPrevBtn, this.handleFirstCalDatePrevEvent);
    this.attachClickEvent(monthNextBtn, this.handleFirstCalendarNextEvent);
  }

  /**
   * This method attaches next and prev events on buttons.
   *
   */
  private addSecondCalendarButtonEvents(): void {
    const monthPrevBtn: any[] = this.el.nativeElement.querySelectorAll(
      '#secondCalendarView .mat-calendar-previous-button'
    );
    const monthNextBtn: any[] = this.el.nativeElement.querySelectorAll(
      '#secondCalendarView .mat-calendar-next-button'
    );
    if (!monthPrevBtn || !monthNextBtn) {
      return;
    }
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
    const selectedDates = this.selectedDates;
    if (selectedDates?.start && date && selectedDates.start < date) {
      const dateRange: DateRange<Date> = new DateRange<Date>(
        selectedDates.start,
        date
      );
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
    this.secondCalendarViewData.minDate =
      this.getFirstDateOfNextMonth(currDate);
    currDate.setMonth(currDate.getMonth() + 1);
    this.secondCalendarViewData.startDate = this.selectedDates?.end
      ? this.selectedDates.end
      : currDate;
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
  
  onToggleChanged(): void {
    this.sideBySide = !this.sideBySide;
    this.isCustomRange = !this.isCustomRange;
  }
}
