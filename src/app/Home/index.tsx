import { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, Text, FlatList, Alert } from 'react-native';

import { styles } from './styles';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Filter } from '@/components/Filter';
import { Item } from '@/components/Item';

import { itemsStorage, ItemStorage } from '@/storage/itemsStorage';

import { FilterStatus } from '@/types/FilterStatus';

const FILTER_STATUS: FilterStatus[] = [
  FilterStatus.DONE,
  FilterStatus.PENDING,
];

export function Home() {
  const [filter, setFilter] = useState(FilterStatus.DONE);
  const [description, setDescription] = useState("");
  console.log("🚀 ~ Home ~ description:", description)
  const [items, setItems] = useState<ItemStorage[]>([]);

  async function handleAddItem() {
    if (!description.trim()) {
      Alert.alert('Adicionar', 'Informe a descrição do item');
      return;
    }

    const newitem = {
      id: Math.random().toString(36).substring(2),
      description,
      status: FilterStatus.PENDING,
    };

    try {
      await itemsStorage.add(newitem);
      await fetchItems();
      setDescription("");
    } catch (error) {
      Alert.alert('Erro', error as string);
    }
  }

  async function fetchItems() {
    try {
      const response = await itemsStorage.get();
      setItems(response);
    } catch (error) {
      Alert.alert('Erro', error as string);
    }
  }

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require("@/assets/logo.png")}
      />
      <View style={styles.form}>
        <Input
          value={description}
          onChangeText={setDescription}
          placeholder="O que você precisa comprar?"
        />
        <Button title="Adicionar" onPress={handleAddItem} />
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          {
            FILTER_STATUS.map((status) => (
              <Filter
                key={status}
                status={status}
                isActive={filter === status}
                onPress={() => setFilter(status)}
              />
            ))
          }
        <TouchableOpacity style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Limpar</Text>
        </TouchableOpacity>
        </View>
          <FlatList
            data={items}
            keyExtractor={value => value.id}
            renderItem={({ item }) => (
              <Item
                data={item}
                onRemove={() => console.log('remove')}
                onStatus={() => console.log('status')}
              />
            )}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={() => <Text style={styles.emptyListText}>Nenhum item encontrado</Text>}
          />
      </View>
    </View>
  );
}
