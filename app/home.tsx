import { View, Modal, Button, Text, StyleSheet, SafeAreaView, Image, Pressable, ImageSourcePropType, ScrollView, TouchableOpacity, TouchableHighlight, ActivityIndicator, TextInput } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { db, ref, onValue } from '../firebaseConfig';

import './assets/images/logo_moms_cafe.png';
import './assets/images/beverage.png';
import './assets/images/meals.png';
import './assets/images/snacks.png';
import './assets/images/desserts.png';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from '@expo/vector-icons/Ionicons';
import { type IconProps } from '@expo/vector-icons/build/createIconSet';
import { HoverEffect } from 'react-native-gesture-handler';

interface Product {
  id: string;
  name: string;
  price: string;
  imageFile: string;
  customizable: boolean;
  category: string;
  specialRequest?: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

const DetailsScreen = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [specialRequest, setSpecialRequest] = useState(""); // State for special requests
  const [isSpecialRequestModalVisible, setIsSpecialRequestModalVisible] = useState(false); 
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All Items');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [hoveredCategory, setHoveredCategory] = useState<string>('');

  const incrementQuality = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  useEffect(() => {
    const productRef = ref(db, 'product');
    onValue(productRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const productList = Object.values(data).map((item: any) => ({
          ...item,
          customizable: item.customizable || false, 
          category: item.category || 'All Items',
        }));
        setProducts(productList);
        setFilteredProducts(productList);
        setLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    console.log('Search Query:', searchQuery);
  console.log('Filtered Products:', filteredProducts);

  const filteredByCategory = activeCategory === 'All Items'
  ? products
  : products.filter(product => product.category === activeCategory);

    if (searchQuery) {
       const filtered = products.filter(product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        setFilteredProducts(filtered);
      
        if (filtered.length > 0) {
      setActiveCategory(filtered[0].category); // Automatically set to category of first found item
    } else {
      setActiveCategory('All Items'); // If no items match, fall back to "All Items"
    }

    } else {
      setFilteredProducts(filteredByCategory); // Show all products if search query is empty
    }
  }, [searchQuery, activeCategory, products]);



    const handleCategoryPress = (category: string) => {
      setActiveCategory(category); // Update activeCategory when a category is pressed
      setHoveredCategory(category);
    };

  const handleProductPress = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setSpecialRequest(""); // Reset special request when selecting a product
    setModalVisible(true);
  }

  const handleAddToCart = () => {
    if (selectedProduct) {
      const newCartItem: CartItem = { product: selectedProduct, quantity };
      const updatedCart = [...cart, newCartItem];

      if (specialRequest) {
        newCartItem.product = { ...newCartItem.product, specialRequest };
      }

      setCart(updatedCart);

      router.push({
        pathname: '/cart',
        params: { cart: JSON.stringify(updatedCart) },
      });

      setModalVisible(false);
    }
  };

  const handleSpecialRequestPress = () => {
    setIsSpecialRequestModalVisible(true); 
  };

  const handleSpecialRequestSubmit = (request: string) => {
    setSpecialRequest(request); 
    setIsSpecialRequestModalVisible(false); 
  };

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>

      <SafeAreaView style={{flexDirection: 'row',justifyContent: 'space-between', alignItems: 'center', position: 'absolute', zIndex: 1, right: 0}}>
          <TextInput
            style={{height: 40,
              borderColor: 'gray',
              borderWidth: 1,
              borderRadius: 10,
              paddingHorizontal: 10,
              width: '60%',}}
            placeholder="Search"
            value={searchQuery}
            onChangeText={setSearchQuery} 
          />
        </SafeAreaView>

        <SafeAreaView style={styles.itemsContainer}>
          {menuItems.map((item, index) => (
            <Pressable 
              key={index} 
              onPress={() => handleCategoryPress(item.label)}
              style={[styles.item, { backgroundColor: activeCategory === item.label ? '#b78876' : 'white' }]} 
              >
                <Image
                source={item.imageSource}
                style={{ width: 50, height: 50 }}
              />
              <Text style={styles.itemLabel}>{item.label}</Text>
              </Pressable>
          ))}
        </SafeAreaView>

        <SafeAreaView style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ paddingLeft: 20, fontSize: 25, fontWeight: 'bold', marginRight: 10 }}>MENUS</Text>
          <View style={{ height: 2, width: '80%', backgroundColor: 'black', display: 'flex' }}></View>
        </SafeAreaView>

        {loading ? (
          <ActivityIndicator size="large" color="orange" />
        ) : (
          <SafeAreaView style={styles.productDisplay}>
            {filteredProducts.map((product, index) => (
              <TouchableOpacity
                key={index}
                style={styles.productItem}
                onPress={() => handleProductPress(product)}
              >
                {product.imageFile && product.imageFile.startsWith('data:image') ? (
                  <Image
                    source={{ uri: product.imageFile }}
                    style={{ width: 50, height: 50, resizeMode: 'contain' }}
                  />
                ) : (
                  <Text>No image available</Text>
                )}

                <Text style={styles.productText}>{product.name}</Text>
                <Text style={styles.productText}>{product.price}</Text>
              </TouchableOpacity>
            ))}
          </SafeAreaView>
        )}

        <Modal
          transparent={true}
          visible={modalVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={{ backgroundColor: 'gray', width: 100, height: 30, opacity: 0.5, marginBottom: 20 }}
                onPress={() => setModalVisible(false)}
              >
                <Text style={{ textAlign: 'center', marginTop: 5 }}>Close</Text>
              </TouchableOpacity>
              {selectedProduct && (
                <>
                  {selectedProduct.imageFile &&
                  selectedProduct.imageFile.startsWith('data:image') ? (
                    <Image
                      source={{ uri: selectedProduct.imageFile }}
                      style={{ width: 100, height: 100, resizeMode: 'contain' }}
                    />
                  ) : (
                    <Text>No image available</Text>
                  )}

                  <Text style={styles.modalText}>
                    {selectedProduct.name}
                  </Text>
                  <Text style={styles.modalPrice}>
                    {selectedProduct.price}
                  </Text>

                  <View style={styles.quantity}>
                    <Pressable
                      style={{ width: 50, height: 30, borderRadius: 10, borderWidth: 2 }}
                      onPress={decrementQuantity}
                    >
                      <Text style={{ fontSize: 20, textAlign: 'center' }}>-</Text>
                    </Pressable>

                    <Text style={{ fontSize: 20 }}>{quantity}</Text>
                    <Pressable
                      style={{ width: 50, height: 30, backgroundColor: 'orange', borderRadius: 10 }}
                      onPress={incrementQuality}
                    >
                      <Text style={{ fontSize: 20, textAlign: 'center' }}>+</Text>
                    </Pressable>
                  </View>

                  {selectedProduct.customizable && (
                  <View style={styles.custom}>
                    <Pressable
                        style={{width: 100, height: 50, backgroundColor: 'orange', borderRadius: 10}}
                        onPress={handleSpecialRequestPress}
                      >
                        <Text style={{fontSize: 15, textAlign: 'center', marginTop: 15, fontWeight: 'bold'}}>Customize</Text>
                      </Pressable>
                    </View>
                  )}

                    <Pressable
                      style={{ width: 100, height: 50, backgroundColor: 'orange', borderRadius: 10 }}
                      onPress={handleAddToCart}
                    >
                      <Text style={{ fontSize: 15, textAlign: 'center', marginTop: 15, fontWeight: 'bold' }}>Done</Text>
                    </Pressable>
                </>
              )}
            </View>
          </View>
        </Modal>

        {/* <Modal
          transparent={true}
          visible={isSpecialRequestModalVisible}
          animationType="slide"
          onRequestClose={() => setIsSpecialRequestModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TextInput
                style={styles.customInput}
                placeholder="Enter special request"
                value={specialRequest}
                onChangeText={setSpecialRequest}
              />
              <Pressable
                // style={styles.specialRequestSubmitButton}
                onPress={() => handleSpecialRequestSubmit(specialRequest)}
              >
                <Text>Submit</Text>
              </Pressable>
            </View>
          </View>
        </Modal> */}

      </SafeAreaView>
    </ScrollView>
  );
};

interface HoverableItemProps {
  label: string;
  imageSource: ImageSourcePropType;
}

const HoverableItem: React.FC<HoverableItemProps> = ({ label, imageSource }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Pressable
      onPressIn={() => setIsHovered(true)}
      onPressOut={() => setIsHovered(false)}
      style={[styles.item, { backgroundColor: isHovered ? '#b78876' : 'white' }]}
    >
      <Image
        source={imageSource}
        style={{ width: 50, height: 50 }}
      />
      <Text style={styles.itemLabel}>{label}</Text>
    </Pressable>
  );
};

const menuItems = [
  { label: 'All Items', imageSource: require('./assets/images/beverage.png') },
  { label: 'Beverages', imageSource: require('./assets/images/beverage.png') },
  { label: 'Meals', imageSource: require('./assets/images/meals.png') },
  { label: 'Snacks', imageSource: require('./assets/images/snacks.png') },
  { label: 'Desserts', imageSource: require('./assets/images/desserts.png') },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4ECD8',
  },
  itemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    padding: 20,
    gap: 10,
  },
  item: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    elevation: 3,
  },
  itemLabel: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  productItem: {
    width: '30%',  // Ensure that each item takes up a consistent width
    padding: 10,
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    minHeight: 150, // Set a minimum height to keep consistency even if the image is smaller
  },
  productText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalPrice: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  quantity: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  custom: {
    marginBottom: 20,
  },
  customInput: {
    height: 40,
    width: 200,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  productDisplay: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',  // Make sure the products are spaced evenly
    padding: 20,
  },
});


export default DetailsScreen;
