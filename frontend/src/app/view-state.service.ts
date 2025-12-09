import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type ViewMode = 'grid' | 'graph';

@Injectable({
  providedIn: 'root',
})
export class ViewStateService {
  private viewModeSubject = new BehaviorSubject<ViewMode>('grid');
  public viewMode$: Observable<ViewMode> = this.viewModeSubject.asObservable();

  constructor() {}

  setViewMode(mode: ViewMode): void {
    this.viewModeSubject.next(mode);
  }

  getCurrentViewMode(): ViewMode {
    return this.viewModeSubject.value;
  }

  toggleViewMode(): void {
    const currentMode = this.viewModeSubject.value;
    this.setViewMode(currentMode === 'grid' ? 'graph' : 'grid');
  }
}
