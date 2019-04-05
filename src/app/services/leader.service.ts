import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { LEADERS } from '../shared/leaders';
import { Leader } from '../shared/leader';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  getLeaders(): Observable<Leader[]> {
    return of(LEADERS).pipe(delay(2000));
  }

  getLeader(id: string): Observable<Leader> {
    return of(LEADERS.filter(leader => (leader.id === id))[0]).pipe(delay(2000));
  }

  getFeaturedLeader(): Observable<Leader> {
    return of(LEADERS.filter(leader => leader.featured)[0]).pipe(delay(2000));
  }

  constructor() { }
}
