import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

//Declaring the api url that will provide data for the client app
const apiUrl = 'https://movieflixapp-88791d8c1b4d.herokuapp.com/';
@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {
  /**
   * Inject the HttpClient module to the constructor params
   * This will provide HttpClient to the entire class, making it available via this.http
   */
  constructor(private http: HttpClient) {
  }
  public userRegistration(userDetails: any): Observable<any> {
    console.log('Attempting to register with:', userDetails);

    return this.http
      .post(apiUrl + 'users', userDetails, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      })
      .pipe(
        map((response) => {
          console.log('Registration successful:', response);
          return response;
        }),
        catchError(this.handleError),
      );
  }

  /**
   * 
   * @param userDetails 
   * @returns 
   * User Login (Stores Token)
   */
  public userLogin(userDetails: any): Observable<any> {
    return this.http.post(apiUrl + 'login', userDetails).pipe(
      map((response: any) => {
        if (response.token) {
          localStorage.setItem('token', response.token); // Store token after login
        }
        return response;
      }),
      catchError(this.handleError),
    );
  }

  /**
   * 
   * @returns 
   * Helper: Get authorization headers
   */
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  /**
   * 
   * @returns 
   * Get all movies
   */
  public getAllMovies(): Observable<any> {
    return this.http
      .get(apiUrl + 'movies', { headers: this.getAuthHeaders() })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * 
   * @param movieId 
   * Get One Movie
   * @returns 
   */
  public getMovie(movieId: string): Observable<any> {
    return this.http
      .get(apiUrl + `movies/${movieId}`, { headers: this.getAuthHeaders() })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * 
   * @param directorName 
   * Get director
   * @returns 
   */
  public getDirector(directorName: string): Observable<any> {
    return this.http
      .get(apiUrl + `directors/${directorName}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * 
   * @param genreName 
   * Get genre
   * @returns 
   */
  public getGenre(genreName: string): Observable<any> {
    return this.http
      .get(apiUrl + `genres/${genreName}`, { headers: this.getAuthHeaders() })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * 
   * @returns 
   * Get user data
   */
  public getUser(): Observable<any> {
    return this.http
      .get(apiUrl + 'users', { headers: this.getAuthHeaders() })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * 
   * @returns 
   * Get Favorites for a user
   */
  public getFavoriteMovies(): Observable<any> {
    return this.http
      .get(apiUrl + 'users/FavoriteMovies', { headers: this.getAuthHeaders() })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * 
   * @param movieId 
   * AddFavorite movie
   * @returns 
   */
  public addFavoriteMovie(movieId: string): Observable<any> {
    return this.http
      .post(
        apiUrl + `users/FavoriteMovies/${movieId}`,
        {},
        { headers: this.getAuthHeaders() },
      )
      .pipe(catchError(this.handleError));
  }

  /**
   * 
   * @param updatedDetails 
   * Edits User
   * @returns 
   */
  public editUser(updatedDetails: any): Observable<any> {
    return this.http
      .put(apiUrl + 'Users', updatedDetails, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  /**
   * 
   * @returns 
   * Deletes user
   */
  public deleteUser(): Observable<any> {
    return this.http
      .delete(apiUrl + 'Users', { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  /**
   * Delete Movie from Favorites
   */
  public removeFavoriteMovie(movieId: string): Observable<any> {
    return this.http
      .delete(apiUrl + `users/FavoriteMovies/${movieId}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Extract Response Data
   */
  private extractResponseData(res: any): any {
    return res || {};
  }

  /**
   * 
   * @param error 
   * @returns 
   * Handles Errors
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Backend returned status:', error.status);
    console.error('Full error response:', error);

    let errorMessage = 'Something went wrong; please try again later.';

    if (error.error) {
      try {
        let errorBody;
        if (typeof error.error === 'string') {
          errorBody = JSON.parse(error.error);
        } else {
          errorBody = error.error;
        }

        console.error('Parsed error body:', errorBody);

        if (typeof errorBody === 'string') {
          errorMessage = errorBody;
        } else if (errorBody.message) {
          errorMessage = errorBody.message;
        } else if (errorBody.errors && Array.isArray(errorBody.errors)) {
          errorMessage = errorBody.errors.map((err: any) => err.msg).join('\n');
        } else {
          errorMessage = 'An unexpected error occurred.';
        }
      } catch (parseError) {
        console.error('Error parsing backend response:', parseError);
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}

