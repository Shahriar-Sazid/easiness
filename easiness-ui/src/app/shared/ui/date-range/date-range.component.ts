import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DateRange } from 'src/app/core/models/document.model';

@Component({
  selector: 'app-date-range',
  templateUrl: './date-range.component.html',
  styleUrls: ['./date-range.component.scss']
})
export class DateRangeComponent implements OnInit {
  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  today = this.calendar.getToday();

  @Output() dateSelected = new EventEmitter<{ from: Date; to: Date }>();

  constructor(private calendar: NgbCalendar, public formatter: NgbDateParserFormatter) {

  }

  ngOnInit(): void {
    this.reset();
  }

  reset() {
    this.fromDate = this.calendar.getNext(this.today, 'm', -1);
    this.toDate = this.today;
    this.dateSelected.emit(this.toDateRange())
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
      this.dateSelected.emit(this.toDateRange())
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
      this.dateSelected.emit(this.toDateRange())
    } else {
      this.toDate = null;
      this.fromDate = date;
      this.dateSelected.emit(this.toDateRange())
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) &&
      date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) { return this.toDate && date.after(this.fromDate) && date.before(this.toDate); }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) ||
      this.isHovered(date);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

  toDateRange(): DateRange {
    return {
      from: this.fromDate ? new Date(this.fromDate.year, this.fromDate.month - 1, this.fromDate.day) : null,
      to: this.toDate ? new Date(this.toDate.year, this.toDate.month - 1, this.toDate.day, 23, 59, 59, 999) : null
    }
  }
}


