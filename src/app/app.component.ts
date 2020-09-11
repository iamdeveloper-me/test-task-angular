import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    
    constructor(private http: HttpClient){}

    displayedColumns: string[] = ['title', 'platform', 'score', 'genre' , 'editors_choice'];
    dataSource: MatTableDataSource<GameList>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    ngOnInit(){
      this.getGameList();
    }

    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }

    getGameList() {
      this.http.get('https://api.jsonbin.io/b/5d45e4d789ed890b24cb25f5').pipe(
          map((data: any) => {
            const results: GameList[] = [];
            data.forEach((result: GameList) => {
              if (!result.hasOwnProperty('api_rate_limit'))
                results.push(new GameList(result));
            });
            return results;
          })
        ).subscribe((res: any)=>{
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
      });
    }
}


export class GameList {
  editors_choice: string;
  genre: string;
  platform: string;
  score: number;
  title: string;

  constructor(data: any) {
    this.editors_choice = data.editors_choice;
    this.genre = data.genre;
    this.platform = data.platform;
    this.score = data.score;
    this.title = data.title;
  }
}