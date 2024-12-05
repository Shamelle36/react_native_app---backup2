import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { getDatabase, ref, onValue, get } from 'firebase/database';
import { useGlobalSearchParams } from 'expo-router';
import { ListRenderItem } from 'react-native';

interface OrderItem {
  product?: {
    id?: string;
    name?: string;
    price?: number;
  };
  quantity?: number;
}


const OrderScreen = () => {
  const [items, setItems] = useState<OrderItem[]>([]); // State to store items for the specific order
  const [loading, setLoading] = useState(true);
  const { orderId } = useGlobalSearchParams();

  console.log("Received orderId:", orderId); 

 useEffect(() => {
  console.log("OrderScreen Mounted");
  if (!orderId) {
    console.error("No orderId provided!");
    return;
  }
  const db = getDatabase();
  const orderRef = ref(db, `orders/${orderId}`);
  console.log("Fetching data from:", `orders/${orderId}`);
  
  get(orderRef)
    .then((snapshot) => {
      console.log("Fetched data:", snapshot.val());
    })
    .catch((error) => {
      console.error("Firebase fetch error:", error);
    });
}, [orderId]);


  const renderItem: ListRenderItem<OrderItem> = ({ item }) => {
    const price = item.product?.price; // Check if price exists
    const formattedPrice = typeof price === 'number' ? `$${price.toFixed(2)}` : 'N/A'; // Format price or display 'N/A'

    return (
      <View style={styles.item}>
        <Text style={styles.itemName}>{item.product?.name || 'Unknown Product'}</Text>
        <Text style={styles.itemQuantity}>Quantity: {item.quantity || 0}</Text>
        <Text style={styles.itemPrice}>Price: {formattedPrice}</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Loading order details...</Text>
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>No items found for this order.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Summary</Text>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${index}-${item.product?.id || 'unknown'}`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  item: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#F4ECD8',
    borderRadius: 10,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemQuantity: {
    fontSize: 16,
  },
  itemPrice: {
    fontSize: 16,
    color: '#800020',
  },
  error: {
    fontSize: 18,
    color: 'red',
  },
});

export default OrderScreen;
