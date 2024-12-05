import React, { useEffect, useState } from 'react';
import { View, Image, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter, useGlobalSearchParams } from 'expo-router';
import { getDatabase, ref, push } from "firebase/database"; 

interface Product {
  id: string;
  name: string;
  price: number;
  imageFile?: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

const CartScreen = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]); 
  const [orderedItems, setOrderedItems] = useState([]); 
  const { cart } = useGlobalSearchParams(); 

  useEffect(() => {
    if (!cart) {
      console.error("Cart parameter is not provided:", cart);
      return;
    }
  
    let cartString;
  
    // Check if cart is a string or array of strings
    if (Array.isArray(cart)) {
      if (cart.length > 0) {
        cartString = cart[0]; // Use the first element of the array
      } else {
        console.error("Cart array is empty:", cart);
        return;
      }
    } else {
      cartString = cart; // cart is already a string
    }
  
    try {
      const parsedCart = JSON.parse(cartString);
      console.log("Parsed cart data:", parsedCart);
  
      if (Array.isArray(parsedCart)) {
        const filteredCart = parsedCart.filter(
          (item) => !orderedItems.some((ordered) => ordered.product.id === item.product.id)
        );
        setCartItems(filteredCart);
      } else {
        console.error("Parsed cart is not an array:", parsedCart);
      }
    } catch (error) {
      console.error("Error parsing cart parameter:", error);
    }
  }, [cart, orderedItems]);
  

  const addItemToCart = (newItem) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.product.id === newItem.product.id
      );

      if (existingItemIndex !== -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += newItem.quantity;
        return updatedItems;
      } else {
        return [...prevItems, newItem];
      }
    });
  };


  const resetCart = () => {
    setCartItems([]); 
  };

  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => {
        const price = parseFloat(item.product.price); 
        const quantity = item.quantity; 
        return total + price * quantity;
      }, 0)
      .toFixed(2); 
  };

  const renderItem = ({ item }) => {
    if (!item || !item.product) return null;

    return (
      <View style={styles.cartItem}>
        {item.product.imageFile && (
          <Image source={{ uri: item.product.imageFile }} style={styles.imageFile} />
        )}
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.product.name}</Text>
          <Text style={styles.itemPrice}>${item.product.price}</Text>
          <Text style={styles.itemQuantity}>x {item.quantity}</Text>
        </View>
      </View>
    );
  };

  const calculateTotalQuantity = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }
  
    const orderId = `order-${Date.now()}`;

    const db = getDatabase();
    const ordersRef = ref(db, 'orders');
  
    
    const orderData = {
      status: "Pending",
      items: cartItems, 
      total: calculateTotal(), 
      totalQuantity: calculateTotalQuantity(),
      timestamp: new Date().toISOString(),
    };
  
    try {
      await push(ordersRef, orderData);
      alert("Order successfully placed!");
      resetCart(); 
      router.push({
        pathname: '/orders', 
        params: { cart: JSON.stringify(cartItems) }  // Passing the orderData to the Order page
      });
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place the order. Try again.");
    }
  };
  

  return (
    <View style={styles.container}>
      <Image 
        source={require('./assets/images/logo_moms_cafe.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>My Cart</Text>
      <View style={{backgroundColor: 'white', width: '100%', height: 1, marginBottom: 10}}></View>

      {cartItems.length > 0 ? (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderItem}
            keyExtractor={(item, index) => item?.product?.id?.toString() || `fallback-${index}`}
            extraData={cartItems} 
          />
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.totalText}>Total:</Text>
            <Text style={styles.totalText}>${calculateTotal()}</Text>
          </View>
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={handleCheckout}
          >
            <Text style={styles.checkoutText}>Checkout</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.emptyCart}>Your cart is empty!</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#b78876' 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    color: 'white' 
  },
  logo: { 
    width: 150, 
    height: 150, 
    alignSelf: 'center', 
    backgroundColor: '#F4ECD8', 
    borderRadius: 100 
  },
  cartItem: { 
    flexDirection: 'row', 
    padding: 15, 
    backgroundColor: '#F4ECD8', 
    marginBottom: 10, 
    borderRadius: 10 
  },
  imageFile: { 
    width: 60, 
    height: 60 
  },
  itemDetails: { 
    flex: 1, 
    marginLeft: 20 
  },
  itemName: { 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  itemPrice: { 
    fontSize: 14, 
    color: '#800020' 
  },
  itemQuantity: {
    fontSize: 12 
  },
  totalText: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginTop: 20, 
    color: '#F4F1E1', 
    marginRight: 210 
  },
  checkoutButton: { 
    backgroundColor: '#333333', 
    padding: 15, 
    borderRadius: 10, 
    alignItems: 'center', 
    marginTop: 20 
  },
  checkoutText: { 
    color: 'white', 
    fontWeight: 'bold', 
    fontSize: 18 
  },
  emptyCart: { 
    fontSize: 16, 
    textAlign: 'center', 
    color: 'white', 
    marginTop: 50 
  },
  addItemButton: { 
    padding: 10, 
    backgroundColor: '#333', 
    borderRadius: 5, 
    marginTop: 10 
  },
  addItemText: { 
    color: 'white', 
    textAlign: 'center' 
  }
});

export default CartScreen;