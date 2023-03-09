import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import { DashBoardService } from 'src/app/modules/layout/service/dashboard.service';
import { getCSSVariableValue } from '../../../../../kt/_utils';

@Component({
  selector: 'app-charts-widget1',
  templateUrl: './charts-widget1.component.html',
})
export class ChartsWidget1Component implements OnInit {
  chartOptions: any = {};
  // @ViewChild("chartRef") chartbar: ApexCharts;
  @ViewChild("chartRef") chart: ChartComponent;
  type = 3;
  data = {
    invest_amounts: [],
    stocks: [],
  }
  constructor(
    private dashBoardService: DashBoardService,
  ) { }

  ngOnInit(): void {
    this.chartOptions = getChartOptions(350);
    this.getDataInfor();

  }

  getDataInfor() {
    this.dashBoardService.getAdminStockInfor({ type: this.type }).subscribe(res => {
      this.data.invest_amounts = this.handleData(res.data.invest_amounts);
      this.data.stocks = this.handleData(res.data.stocks);
      this.updateData(res.data.invest_amounts.map(obj => obj.name))
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
        case 'Số tiền đầu tư':
          obj.data = this.data.invest_amounts;
          break;
        case 'Cổ phiếu':
          obj.data = this.data.stocks;
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
        name: 'Số tiền đầu tư',
        data: []
      },
      {
        name: 'Cổ phiếu',
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
      categories: [],
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
        formatter: (value) => {
          return `${numberWithCommas(value)} VNĐ`;
        }
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
    ],
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
