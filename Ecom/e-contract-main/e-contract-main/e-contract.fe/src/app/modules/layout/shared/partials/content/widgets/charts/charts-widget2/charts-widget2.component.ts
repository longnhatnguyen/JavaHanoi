import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import { DashBoardService } from 'src/app/modules/layout/service/dashboard.service';
import { getCSSVariableValue } from '../../../../../kt/_utils';

@Component({
  selector: 'app-charts-widget2',
  templateUrl: './charts-widget2.component.html',
})
export class ChartsWidget2Component implements OnInit {
  chartOptions: any = {};
  // @ViewChild("chartRef") chartbar: ApexCharts;
  @ViewChild("chartRef") chart: ChartComponent;
  type = 3;
  data = {
    fundList: [],
    revenueList: [],
    costList: [],
    profitList: [],
  }
  constructor(
    private dashBoardService: DashBoardService,
  ) { }

  ngOnInit(): void {
    this.chartOptions = getChartOptions(350);
    this.getDataInfor();

  }

  getDataInfor() {
    this.dashBoardService.getBusinessInfor({ type: this.type }).subscribe(res => {
      this.data.fundList = this.handleData(res.data.funds);
      this.data.profitList = this.handleData(res.data.profit);
      this.data.costList = this.handleData(res.data.cost);
      this.data.revenueList = this.handleData(res.data.revenue);
      this.updateData(res.data.cost.map(obj => obj.name))
      this.chart.updateOptions(this.chartOptions);
      // this.chartbar.render();
    })
  }

  handleData(data) {
    return data.map(obj => {
      return obj.total
    })
  }

  getData(type) {
    this.type = type;
    this.getDataInfor();
  }

  updateData(data) {
    this.chartOptions.series.forEach(obj => {
      switch (obj.name) {
        case 'Quỹ':
          obj.data = this.data.fundList;
          break;
        case 'Doanh thu':
          obj.data = this.data.revenueList;
          break;
        case 'Giá tiền':
          obj.data = this.data.costList;
          break;
        case 'Lợi nhuận':
          obj.data = this.data.profitList;
          break;
        default:
        // code block
      }
    })

    this.chartOptions.xaxis.categories = data;

    //this.chart.render();
  }

}

function getChartOptions(height: number) {
  const labelColor = getCSSVariableValue('--kt-gray-500');
  const borderColor = getCSSVariableValue('--kt-gray-200');
  const baseColor = getCSSVariableValue('--kt-warning');
  const secondaryColor = getCSSVariableValue('--kt-gray-300');

  return {
    series: [
      {
        name: 'Quỹ',
        data: []
      },
      {
        name: 'Doanh thu',
        data: [],
      },
      {
        name: 'Giá tiền',
        data: [],
      },
      {
        name: 'Lợi nhuận',
        data: [],
      },
    ],
    chart: {
      fontFamily: 'inherit',
      type: 'bar',
      height: height,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '80%',
        borderRadius: 5,
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: ['Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
        formatter: function (val: number) {
          return `${numberWithCommas(val)} VNĐ`;
        },
      },
    },
    fill: {
      opacity: 1,
    },
    states: {
      normal: {
        filter: {
          type: 'none',
          value: 0,
        },
      },
      hover: {
        filter: {
          type: 'none',
          value: 0,
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: 'none',
          value: 0,
        },
      },
    },
    tooltip: {
      style: {
        fontSize: '12px',
      },
      y: {
        formatter: function (val: number) {
          return `${numberWithCommas(val)} VNĐ`;
        },
      },
    },
    colors: [
      '#42A5F5',
      '#66BB6A',
      '#FFA726',
      '#e04848',],
    grid: {
      borderColor: borderColor,
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
  };
}
function numberWithCommas(x) {
  return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}
