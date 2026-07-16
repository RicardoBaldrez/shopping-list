import { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, Text, FlatList, Alert, ActivityIndicator } from 'react-native';

import { styles } from './styles';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Filter } from '@/components/Filter';
import { Item } from '@/components/Item';
import { Loading } from '@/components/Loading';

import { itemsStorage, ItemStorage } from '@/storage/itemsStorage';

import { FilterStatus } from '@/types/FilterStatus';

const FILTER_STATUS: FilterStatus[] = [
  FilterStatus.PENDING,
  FilterStatus.DONE,
];

export function Home() {
  const [filter, setFilter] = useState(FilterStatus.PENDING);
  const [description, setDescription] = useState("");
  const [items, setItems] = useState<ItemStorage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAddItem, setIsLoadingAddItem] = useState(false);

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
      setIsLoadingAddItem(true);
      await itemsStorage.add(newitem);
      await fetchItemsByStatus();
      
      Alert.alert('Sucesso', `Item ${description} adicionado com sucesso`);
      
      setDescription("");
      setFilter(FilterStatus.PENDING);
    } catch (error) {
      Alert.alert('Erro', error as string);
    } finally {
      setIsLoadingAddItem(false);
    }
  }

  async function handleRemoveItem(id: string) {
    try {
      setIsLoading(true);
      await itemsStorage.remove(id);
      await fetchItemsByStatus();
    } catch (error) {
      Alert.alert('Erro', error as string);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchItemsByStatus() {
    try {
      setIsLoading(true);
      const response = await itemsStorage.getByStatus(filter);
      setItems(response);
    } catch (error) {
      Alert.alert('Erro', error as string);
    } finally {
      setIsLoading(false);
    }
  }

  function handleClearItems() {
    Alert.alert('Limpar', 'Deseja limpar a lista de compras?', [
      {
        text: "Não",
        style: "cancel",
      },
      {
        text: "Sim",
        onPress: onClearItems,
      }
    ])
  }

  async function onClearItems() {
    try {
      setIsLoading(true);
      await itemsStorage.clear();
      setItems([]);
    } catch (error) {
      console.log(error);
      Alert.alert('Não foi possível limpar a lista de compras');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleToggleItemStatus(id: string) {
    try {
      setIsLoading(true);
      await itemsStorage.toggleStatus(id);
      await fetchItemsByStatus();
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível alterar o status do item");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchItemsByStatus();
  }, [filter]);

  return (
    <>
      {isLoading && <Loading />}
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
          <Button
            title={isLoadingAddItem ? "Adicionando..." : "Adicionar"}
            onPress={handleAddItem}
            disabled={isLoadingAddItem}
          />
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
          <TouchableOpacity style={styles.clearButton} onPress={handleClearItems}>
            <Text style={styles.clearButtonText}>Limpar</Text>
          </TouchableOpacity>
          </View>
            <FlatList
              data={items}
              keyExtractor={value => value.id}
              renderItem={({ item }) => (
                <Item
                  data={item}
                  onRemove={() => handleRemoveItem(item.id)}
                  onStatus={() => handleToggleItemStatus(item.id)}
                />
              )}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={() => <Text style={styles.emptyListText}>Nenhum item encontrado</Text>}
            />
        </View>
      </View>
    </>
  );
}
