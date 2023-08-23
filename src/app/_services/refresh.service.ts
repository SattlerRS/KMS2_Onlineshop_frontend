import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RefreshService {
  private refreshSubject: Subject<void> = new Subject<void>();

  refresh$: Observable<void> = this.refreshSubject.asObservable();

  // Refresh Komponente
  triggerRefresh(): void {
    this.refreshSubject.next();
  }
}