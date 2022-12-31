import { AfterViewInit, Component, OnInit } from '@angular/core';
import Chart, { ChartConfiguration, ChartData } from 'chart.js/auto';
import { ChartKeys, ChartMeta, ChartPoint, ChartsMeta, DashboardResponse } from 'src/app/core/models/dashboard.model';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { UtilService } from 'src/app/core/services/util.service';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit, AfterViewInit {
  data: DashboardResponse
  charts = {} as { [key in ChartKeys]: ChartConfiguration }
  chartsMeta: ChartsMeta = {
    topProductByProfit: {
      label: "Most Profitable Products",
      backgroundColor: ['#5823cf', '#6C4AB6', '#8D72E1', '#8D9EFF', '#B9E0FF',],
      type: 'pie',
      key: 'topProductByProfit',
    },
    topProductByQuantity: {
      label: "Best Selling Products",
      backgroundColor: ['#5823cf', '#6C4AB6', '#8D72E1', '#8D9EFF', '#B9E0FF',],
      type: 'pie',
      key: 'topProductByQuantity',
    },
    topDebtPeople: {
      label: "Your High Debts",
      backgroundColor: ['#420516', '#521224', '#7D1935', '#B42B51', '#E63E6D',],
      type: 'bar',
      key: 'topDebtPeople',
    },
    topDuePeople: {
      label: "People With Higher Due",
      backgroundColor: ['#445642', '#557153', '#7D8F69', '#A9AF7E', '#E6E5A3',],
      type: 'bar',
      key: 'topDuePeople',
    },
  }

  keepOrder = (a: any, b: any) => {
    return a;
  }

  period: 'week' | 'month' | 'year' = 'month'

  constructor(
    private dashboardService: DashboardService,
    private utils: UtilService,
  ) { }

  ngOnInit() {
    this.getDataForLast(this.period)
  }

  getDataForLast(period: 'week' | 'month' | 'year') {
    let fromDate: Date
    switch (period) {
      case 'week':
        fromDate = this.utils.getNDayBefore(7)
        break
      case 'month':
        fromDate = this.utils.getNDayBefore(30)
        break
      case 'year':
        fromDate = this.utils.getNDayBefore(365)
        break
    }
    this.getDashboardData(fromDate)
  }

  getDashboardData(from: Date) {
    this.dashboardService.getDashboardData({ from }).subscribe(
      data => {
        for (const key in data) {
          if (Object.prototype.hasOwnProperty.call(data, key)) {
            const chartPoints = data[key] as ChartPoint[];

            const chart: ChartConfiguration = this.charts[key] = this.charts[key] ?? {} as ChartConfiguration
            const chartMeta = this.chartsMeta[key]

            chart.type = chartMeta.type
            chart.data = {} as ChartData
            chart.data.labels = chartPoints.map(el => el.label)
            chart.data.datasets = [
              {
                label: chartMeta.label,
                data: chartPoints.map(el => +el.value),
                backgroundColor: chartMeta.backgroundColor
              }
            ]
          }
        }

        for (const key in this.charts) {
          if (Object.prototype.hasOwnProperty.call(this.charts, key)) {
            new Chart(document.getElementById(key) as HTMLCanvasElement, this.charts[key])
          }
        }
      },
      err => {

      }
    )
  }

  ngAfterViewInit() {
    console.log('something')
  }
}
