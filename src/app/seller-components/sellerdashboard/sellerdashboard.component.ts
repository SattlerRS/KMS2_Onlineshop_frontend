import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { OrdersService } from '../../_services/orders.service'
import { TokenStorageService } from '../../_services/token-storage.service';
import { Chart,registerables  } from 'chart.js';


@Component({
  selector: 'app-sellerdashboard',
  templateUrl: './sellerdashboard.component.html',
  styleUrls: ['./sellerdashboard.component.css']
})
export class SellerdashboardComponent implements OnInit {
  user: any;
  orderdetails: any[] = [];
  filteredOrders: any[] = [];
  showResetFilterBtn: boolean = false;
  p: any;
  searchTerm: any;
  showChart: boolean = false;
  showCartBtnText: string = 'Umsatz Diagramm anzeigen';
  filterStatusString: string = '';

  @ViewChild('myChart') myChart!: ElementRef<HTMLCanvasElement>;
  chart: Chart | undefined;

  constructor(private ordersService: OrdersService, private token: TokenStorageService) { }

  ngOnInit(): void {
    // User aus dem Sessionstorrage abfragen
    this.user = this.token.getUser();

    // Bestellungen aus der Datanbank für den Verkäufer abrufen
    this.ordersService.getOrdersFromSeller(this.user.id).subscribe({
      next: data => {
        this.orderdetails = data.orderDetails;
        this.createChart();
        this.orderdetails.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        this.filteredOrders = this.orderdetails;

        // Wenn ein Filter aktiv ist, wird er nach dem neu laden der Seite über NgOnInit wieder aktiv
        if (this.showResetFilterBtn) {
          this.filterOrders(this.filterStatusString);
        }

        // Wenn zu wenig Inhalt in der Liste ist wird auf Seite 1 gewechselt
        if (this.filteredOrders.length < 11) {
          this.p = 1;
        }
      },
      error: err => {
        console.log(err.message);
      }
    });
  }

  // Datum und Uhrzeit formattieren
  formatDateTime(dateTime: string): string {
    const date = new Date(dateTime);
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString();

    return formattedDate + ' ' + formattedTime;
  }

  // Bei Statusänderungen werden die Orders neu eingelesen und die ngOnInit aufgerufen
  changeStatus(id: any, status: any) {
    this.ordersService.changeOrderStatus(id, status).subscribe({
      next: data => {
        this.ngOnInit();
      },
      error: err => {
        console.log(err.message);
      }
    });
  }

  // Gesamtmenge der verkauften Produkte ermitteln
  claculateTotalSoldProducts(): number {
    let totalRevenue = 0;
    for (const orderDetail of this.orderdetails) {
      totalRevenue += orderDetail.amount;
    }
    return totalRevenue;
  }
 // Gesamtpreis der verkauften Produkte ermitteln
  calculateTotalRevenue(): string {
    let totalRevenue = 0;
    for (const orderDetail of this.orderdetails) {
      totalRevenue += orderDetail.price * orderDetail.amount;
    }
    return totalRevenue.toLocaleString('de-DE');
  }

  // Bestellungen filtern über Status
  filterOrders(status: string) {
    this.filterStatusString = status;
    this.filteredOrders = this.orderdetails.filter(order => order.status === this.filterStatusString);
    this.showResetFilterBtn = true;
    this.p = 1;
    
  }
  // Filter zurücksetzen
  resetFilter() {
    this.filteredOrders = this.orderdetails;
    this.filterStatusString = '';
    this.showResetFilterBtn = false;
  }

  // Bestellungen filtern über Bestellnr 
  applySearchFilter() {
    this.filteredOrders = this.orderdetails.filter(order => order.orderid.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // Umsatzchart verstecken oder anzeigen
  showChartOnScreen() {
    this.showChart = !this.showChart;
    if (this.showChart) {
      this.showCartBtnText = 'Umsatz Diagramm verstecken';
    }
    else {
      this.showCartBtnText = 'Umsatz Diagramm anzeigen';
    }
  }

  // Umsatzdiagramm erstellen
  createChart(): void {
    this.chart?.destroy();
    Chart.register(...registerables);
    const canvas = this.myChart.nativeElement;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('Failed to get the 2D rendering context for the canvas element.');
      return;
    }

    const allMonths = this.generateAllMonths();
    const monthlySales = this.calculateMonthlySales(allMonths);

    const months = monthlySales.map((data) => data.month);
    const revenues = monthlySales.map((data) => data.revenue);

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: months,
        datasets: [
          {
            label: 'Umsatz',
            data: revenues,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
            font: {
              size: 16,
            },
            color: 'white',
          },
        },
          x: {
          ticks: {
            font: {
              size: 16,
            },
            color: 'white',
          },
          },
        },
      },
    });
  }

  // Alle Monate für das Umsatzchart generieren
  generateAllMonths(): string[] {
    const months: string[] = [];
    const currentDate = new Date();

    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate.getFullYear(), i, 1);
      const month = date.toLocaleString('default', { month: 'short' });
      months.push(month);
    }
    return months;
  }

  // Umsätze für jedes Monat berechnen und zurückgeben
  calculateMonthlySales(allMonths: string[]): { month: string; revenue: number }[] {
    const monthlySalesMap = new Map<string, number>();

    for (const month of allMonths) {
      monthlySalesMap.set(month, 0);
    }

    for (const orderDetail of this.orderdetails) {
      const date = new Date(orderDetail.createdAt);
      const month = date.toLocaleString('default', { month: 'short' });
      const revenue = orderDetail.price * orderDetail.amount;

      if (monthlySalesMap.has(month)) {
        monthlySalesMap.set(month, monthlySalesMap.get(month)! + revenue);
      }
    }

    const monthlySales: { month: string; revenue: number }[] = [];
    monthlySalesMap.forEach((revenue, month) => {
      monthlySales.push({ month, revenue });
    });

    return monthlySales;
  }
}




