import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../models/userModel';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Cart } from '../models/cartModel';
import { Order } from '../models/orderModel';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  // Get all users 
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/user').pipe(
      catchError(this.handleError)
    );
  }

  // Get one user
  getOneUser(): Observable<User> {
    return this.http.get<User>('/api/user/profile').pipe(
      catchError(this.handleError)
    );
  }

  // Delete user
  deleteUser(id: string): Observable<any> {
    return this.http.delete(`/api/admin/du/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Create a user
  createUser(data: User): Observable<User> {
    return this.http.post<User>('/api/user/register', data, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  // Edit user
  editUser(data: User): Observable<User> {
    return this.http.patch<User>('/api/user/update-user', data, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  // Get cart for user
  getCartForUser(): Observable<Cart> {
    return this.http.get<Cart>('/api/user/cart').pipe(
      catchError(this.handleError)
    );
  }

  // Add a product to cart
  addProductToMyCart(pid: string, data: Cart): Observable<Cart> {
    return this.http.post<Cart>(`/api/user/addtocart/${pid}`, data, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  // Update cart
  updateCart(pid: string, data: Cart): Observable<Cart> {
    return this.http.patch<Cart>(`/api/user/editcart/${pid}`, data, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  // Delete a product from cart
  pullProductFromCart(pid: string): Observable<any> {
    return this.http.delete(`/api/user/delete-item/${pid}`).pipe(
      catchError(this.handleError)
    );
  }

  // Checkout cart
  checkoutCart(): Observable<any> {
    return this.http.post<any>('/api/user/orders', httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  emptyCart(): Observable<any> {
    return this.http.delete<any>('/api/user/empty-cart', httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  // Get orders for this user
  getOrderForThisUser(): Observable<Order[]> {
    return this.http.get<Order[]>('/api/user/orders').pipe(
      catchError(this.handleError)
    );
  }

  getOneOrder(oId: string): Observable<Order> {
    return this.http.get<Order>(`/api/user/orders/${oId}`).pipe(
      catchError(this.handleError)
    );
  }

  // Handle errors
  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError('Something went wrong. Please try again later.');
  }
}

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

