import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import { getDatabase, ref, onValue } from "firebase/database";

const OrderScreen = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    const ordersRef = ref(db, 'orders');

    const unsubscribe = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const ordersList = Object.entries(data).map(([key, value]) => ({
          id: key, // Firebase-generated unique ID
          ...value,
        }));
        setOrders(ordersList);
      }
    });

    return () => unsubscribe();
  }, []);

  const renderOrderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      {item.product?.imageFile && (
        <Image
          source={{ uri: item.product.imageFile }}
          style={styles.productImage}
        />
      )}
      <View style={styles.itemDetails}>
        <Text style={styles.productName}>Product: {item.product?.name || 'N/A'}</Text>
        <Text>Quantity: {item.quantity}</Text>
        <Text>Total: ${item.total}</Text>
      </View>
    </View>
  );

  const renderOrder = ({ item }) => (
    <View style={styles.orderContainer}>
      <FlatList
        data={item.items}
        renderItem={renderOrderItem}
        keyExtractor={(item, index) => index.toString()} // Index as key for `items`
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Orders</Text>
      <FlatList
        data={orders}
        renderItem={renderOrder}
        keyExtractor={(item) => item.id} // Firebase unique ID as key
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4ecd8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  orderContainer: {
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#800020',
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#f4f4f4',
    marginBottom: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  productName: {
    fontWeight: 'bold',
    color: '#333',
  },
});

export default OrderScreen;
