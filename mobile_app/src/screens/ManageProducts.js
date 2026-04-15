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
  Image,
  Platform,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { productAPI } from '../api/api';
import { COLORS, SPACING, TYPOGRAPHY } from '../theme/theme';
import Icon from 'react-native-vector-icons/Ionicons';
import CategoryChip from '../components/CategoryChip';

const SIZES_OPTIONS = ['S', 'M', 'L', 'XL', 'XXL'];
const CATEGORY_OPTIONS = ['Shirts', 'Pants', 'Jackets', 'Skinny', 'Shorts', 'Others'];


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
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

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

  const handlePickImage = () => {
    launchImageLibrary(
      { mediaType: 'photo', quality: 0.6, selectionLimit: 1, includeBase64: true },
      (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        Alert.alert('Error', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        setSelectedImage(response.assets[0]);
      }
    });

  };

  const toggleSize = (size) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter(s => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  const handleCreate = async () => {
    if (!name || !price || !category) {
      Alert.alert('Error', 'Please fill in required fields');
      return;
    }

    try {
      const data = {
        name,
        description,
        price,
        category,
        stock: stock || '0',
        sizes: selectedSizes.join(','),
      };

      if (selectedImage?.base64) {
        console.log('Attaching Base64 image data');
        data.base64Image = `data:${selectedImage.type};base64,${selectedImage.base64}`;
      }

      console.log('Sending JSON product creation request...');
      await productAPI.create(data);
      
      Alert.alert('Success', 'Product created successfully!');
      resetForm();
      fetchProducts();
    } catch (error) {
      console.log('Product creation error details:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Check if backend is running.';
      Alert.alert('Error', `Failed to create product: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setShowAddForm(false);
    setName(''); setDescription(''); setPrice(''); setCategory(''); setStock('');
    setSelectedSizes([]); setSelectedImage(null);
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
        <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
          <Text style={styles.formTitle}>Product Details</Text>
          <TextInput style={styles.input} placeholder="Product Name" value={name} onChangeText={setName} />
          <TextInput style={styles.input} placeholder="Description" value={description} onChangeText={setDescription} multiline />
          
          <View style={styles.row}>
            <TextInput style={[styles.input, { flex: 1, marginRight:10 }]} placeholder="Price (Rs.)" value={price} onChangeText={setPrice} keyboardType="numeric" />
            <TextInput style={[styles.input, { flex: 1 }]} placeholder="Stock" value={stock} onChangeText={setStock} keyboardType="numeric" />
          </View>

          <Text style={styles.label}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {CATEGORY_OPTIONS.map(cat => (
              <CategoryChip 
                key={cat}
                label={cat}
                active={category === cat}
                onPress={() => setCategory(cat)}
              />
            ))}
          </ScrollView>


          <Text style={styles.label}>Available Sizes</Text>
          <View style={styles.sizeGrid}>
            {SIZES_OPTIONS.map(size => (
              <TouchableOpacity 
                key={size} 
                onPress={() => toggleSize(size)}
                style={[styles.sizeBox, selectedSizes.includes(size) && styles.sizeBoxActive]}
              >
                <Text style={[styles.sizeText, selectedSizes.includes(size) && styles.sizeTextActive]}>{size}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Product Image</Text>
          <TouchableOpacity style={styles.imagePicker} onPress={handlePickImage}>
            {selectedImage ? (
              <Image source={{ uri: selectedImage.uri }} style={styles.previewImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Icon name="camera-outline" size={32} color={COLORS.darkGrey} />
                <Text style={styles.imagePlaceholderText}>Choose Image</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.submitBtn} onPress={handleCreate}>
            <Text style={styles.submitBtnText}>Create Product</Text>
          </TouchableOpacity>
          <View style={{ height: 20 }} />
        </ScrollView>
      )}

      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Image 
              source={{ uri: item.images && item.images[0] ? (item.images[0].startsWith('http') ? item.images[0] : `http://10.0.2.2:5000${item.images[0]}`) : 'https://via.placeholder.com/150' }} 
              style={styles.cardImage} 
            />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.sub}>Cat: {item.category} | Stock: {item.stock}</Text>
              <Text style={styles.price}>Rs.{item.price}</Text>
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
    maxHeight: 500,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  formTitle: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.m,
  },
  label: {
    ...TYPOGRAPHY.bodyMedium,
    marginTop: SPACING.m,
    marginBottom: SPACING.s,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    color: COLORS.text,
  },
  categoryScroll: {
    marginBottom: 10,
  },
  row: {

    flexDirection: 'row',
  },
  sizeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 5,
  },
  sizeBox: {
    width: 50,
    height: 40,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  sizeBoxActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  sizeText: {
    color: COLORS.text,
    fontWeight: 'bold',
  },
  sizeTextActive: {
    color: COLORS.white,
  },
  imagePicker: {
    width: '100%',
    height: 150,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    alignItems: 'center',
  },
  imagePlaceholderText: {
    marginTop: 8,
    color: COLORS.darkGrey,
  },
  submitBtn: {
    backgroundColor: COLORS.secondary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: SPACING.l,
  },
  submitBtnText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  list: {
    padding: SPACING.m,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: SPACING.m,
    borderRadius: 15,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 2,
  },
  cardImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    color: COLORS.text,
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
    fontSize: 14,
  },
  actions: {
    marginLeft: 10,
  },
});

export default ManageProducts;
