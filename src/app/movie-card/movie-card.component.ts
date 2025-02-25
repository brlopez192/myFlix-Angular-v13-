import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service'

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent {
  movies: any[] = [];
  genreMovies: any[] = [];
  directorMovies: any[] = [];
  movieDescription: string = '';
  constructor(public fetchApiData: FetchApiDataService) { }

ngOnInit(): void {
  this.getMovies();
}

getMovies(): void {
  this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }
  getGenreMovies(genreName: string): void {
    this.fetchApiData.getGenre(genreName).subscribe((resp: any) => {
      this.genreMovies = resp;
      console.log(this.genreMovies);
      return this.genreMovies;
    });
  }
  getDirectorMovies(directorName: string): void {
    this.fetchApiData.getDirector(directorName).subscribe((resp: any) => {
      this.directorMovies = resp;
      console.log(this.directorMovies);
      return this.directorMovies;
    });
  }
  getMovieDescription(movieId: string): void {
    this.fetchApiData.getMovie(movieId).subscribe((resp: any) => {
      this.movieDescription = resp.description; 
      console.log(this.movieDescription);
      return this.movieDescription;
    });
  }

  addToFavorites(movieId: string): void {
    this.fetchApiData.addFavoriteMovie(movieId).subscribe((resp: any) => {
      console.log(`Movie with ID ${movieId} added to favorites!`, resp);
    });
  }
  

}