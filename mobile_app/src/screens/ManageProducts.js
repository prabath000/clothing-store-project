import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  TextInput,
  ScrollView,
} from 'react-native';
import { productAPI } from '../api/api';
import { COLORS, SPACING, TYPOGRAPHY } from '../theme/theme';
import Icon from 'react-native-vector-icons/Ionicons';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');

  const fetchProducts = async () => {
    try {
      const response = await productAPI.getAll();
      setProducts(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreate = async () => {
    if (!name || !price || !category) {
      Alert.alert('Error', 'Please fill in required fields');
      return;
    }

    try {
      // In a real app, we'd handle images via FormData. 
      // For this student project demo, we'll send basic fields.
      const productData = { name, description, price: Number(price), category, stock: Number(stock) || 0 };
      await productAPI.create(productData);
      
      Alert.alert('Success', 'Product created!');
      setShowAddForm(false);
      setName(''); setDescription(''); setPrice(''); setCategory(''); setStock('');
      fetchProducts();
    } catch (error) {
      Alert.alert('Error', 'Failed to create product');
    }
  };

  const handleDelete = (id) => {
    Alert.alert('Delete', 'Are you sure?', [
      { text: 'Cancel' },
      { text: 'Delete', onPress: async () => {
        try {
          await productAPI.remove(id);
          fetchProducts();
        } catch (error) {
          Alert.alert('Error', 'Failed to delete');
        }
      }, style: 'destructive' }
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.secondary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.addBtn}
        onPress={() => setShowAddForm(!showAddForm)}
      >
        <Icon name={showAddForm ? "close" : "add"} size={30} color={COLORS.white} />
        <Text style={styles.addBtnText}>{showAddForm ? "Cancel" : "Add New Product"}</Text>
      </TouchableOpacity>

      {showAddForm && (
        <ScrollView style={styles.form}>
          <TextInput style={styles.input} placeholder="Product Name" value={name} onChangeText={setName} />
          <TextInput style={styles.input} placeholder="Description" value={description} onChangeText={setDescription} multiline />
          <TextInput style={styles.input} placeholder="Price" value={price} onChangeText={setPrice} keyboardType="numeric" />
          <TextInput style={styles.input} placeholder="Category (e.g., T-Shirt, Jeans)" value={category} onChangeText={setCategory} />
          <TextInput style={styles.input} placeholder="Stock" value={stock} onChangeText={setStock} keyboardType="numeric" />
          <TouchableOpacity style={styles.submitBtn} onPress={handleCreate}>
            <Text style={styles.submitBtnText}>Create Product</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.sub}>Category: {item.category} | Stock: {item.stock}</Text>
              <Text style={styles.price}>${item.price}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => handleDelete(item._id)}>
                <Icon name="trash-outline" size={24} color={COLORS.error} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.grey,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtn: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    padding: SPACING.m,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {
    color: COLORS.white,
    fontWeight: 'bold',
    marginLeft: 10,
    fontSize: 16,
  },
  form: {
    backgroundColor: COLORS.white,
    padding: SPACING.m,
    maxHeight: 300,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.secondary,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  submitBtn: {
    backgroundColor: COLORS.secondary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitBtnText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  list: {
    padding: SPACING.m,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: SPACING.m,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 2,
  },
  info: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  sub: {
    fontSize: 12,
    color: COLORS.darkGrey,
    marginTop: 2,
  },
  price: {
    color: COLORS.secondary,
    fontWeight: 'bold',
    marginTop: 4,
  },
  actions: {
    marginLeft: 10,
  },
});

export default ManageProducts;
