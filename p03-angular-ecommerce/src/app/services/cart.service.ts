import {Injectable} from '@angular/core';
import {CartItem} from "../common/cart-item";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CartService
{
  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor()
  {
  }

  addToCart(theCartItem: CartItem)
  {
    // check if we already have the item in our cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem = undefined;

    if (this.cartItems.length > 0)
    {
      // find the item in the cart based on item id
      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id);

      // check if we found it
      alreadyExistsInCart = existingCartItem != undefined;
    }

    if (alreadyExistsInCart)
    {
      existingCartItem.quantity++;
    }
    else
    {
      this.cartItems.push(theCartItem);
    }

    // compute cart total price and total quantity
    this.computeCartTotals();
  }

  computeCartTotals()
  {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let currentCartItem of this.cartItems)
    {
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    // publish the new values ... all subscribers will receive the new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    // log cart data just for debugging purposes
    this.logCartData(totalPriceValue, totalQuantityValue);
  }

  private logCartData(totalPriceValue: number, totalQuantityValue: number)
  {
    console.log(`Contents of the cart`);
    for (let currentCartItem of this.cartItems)
    {
      const subTotalPrice = currentCartItem.quantity * currentCartItem.unitPrice;
      console.log(`name=${currentCartItem.name}, quantity=${currentCartItem.quantity}, `
        + `unitPrice=${currentCartItem.unitPrice}, subTotalPrice=${subTotalPrice}`)
    }

    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`);
    console.log('----');
  }

  decrementQuantity(currentCartItem: CartItem)
  {
    currentCartItem.quantity--;

    if (currentCartItem.quantity === 0)
    {
      this.remove(currentCartItem);
    }
    else
    {
      this.computeCartTotals();
    }
  }

  remove(currentCartItem: CartItem)
  {
    // get index of item in the array
    const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id === currentCartItem.id);

    // if found, remove the item from the array at the given index
    if (itemIndex > -1)
    {
      this.cartItems.splice(itemIndex, 1);

      this.computeCartTotals();
    }
  }
}
