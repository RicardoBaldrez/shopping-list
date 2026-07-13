import { useState } from 'react';
import { View, Image, TouchableOpacity, Text, FlatList } from 'react-native';

import { styles } from './styles';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Filter } from '@/components/Filter';
import { Item } from '@/components/Item';

import { FilterStatus } from '@/types/FitlerStatus';

const FILTER_STATUS: FilterStatus[] = [
  FilterStatus.DONE,
  FilterStatus.PENDING,
];
const ITEMS = [
  { id: "1", status: FilterStatus.DONE, description: "1 pacotes de arroz" },
  { id: "2", status: FilterStatus.PENDING, description: "2 pacotes de feijão" },
  { id: "3", status: FilterStatus.PENDING, description: "Temperos para o churrasco" },
]

export function Home() {
  const [filter, setFilter] = useState(FilterStatus.DONE);

  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require("@/assets/logo.png")}
      />
      <View style={styles.form}>
        <Input placeholder="O que você precisa comprar?" />
        <Button title="Adicionar" />
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
            data={ITEMS}
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
