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

/**
 * This is the get movies function that will pass the movies from the linked api
 */
getMovies(): void {
  this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }
  /**
   * 
   * @param genreName 
   * This function will pass the genre into a sepreate piece that is viewable to teh user
   */
  getGenreMovies(genreName: string): void {
    this.fetchApiData.getGenre(genreName).subscribe((resp: any) => {
      this.genreMovies = resp;
      console.log(this.genreMovies);
      return this.genreMovies;
    });
  }
  /**
   * 
   * @param directorName 
   * This will pass through the Director
   */
  getDirectorMovies(directorName: string): void {
    this.fetchApiData.getDirector(directorName).subscribe((resp: any) => {
      this.directorMovies = resp;
      console.log(this.directorMovies);
      return this.directorMovies;
    });
  }
  /**
   * 
   * @param movieId 
   * this will pass the movieDescription from the movieId
   */
  getMovieDescription(movieId: string): void {
    this.fetchApiData.getMovie(movieId).subscribe((resp: any) => {
      this.movieDescription = resp.description; 
      console.log(this.movieDescription);
      return this.movieDescription;
    });
  }
  
  /**
   * 
   * @param movieId 
   * this will allow the user to pick a favorite and add it to their list by passing the MovieID.
   */
  addToFavorites(movieId: string): void {
    this.fetchApiData.addFavoriteMovie(movieId).subscribe((resp: any) => {
      console.log(`Movie with ID ${movieId} added to favorites!`, resp);
    });
  }
  

}