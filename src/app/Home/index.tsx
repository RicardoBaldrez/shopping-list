import { View, Image, TouchableOpacity, Text } from 'react-native';

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

export function Home() {
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
              <Filter key={status} status={status} isActive />
            ))
          }
        <TouchableOpacity style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Limpar</Text>
        </TouchableOpacity>
        </View>

        <Item data={
          {
            status: FilterStatus.PENDING,
            description: 'Item 1'
          }}
          onRemove={() => console.log('remove')}
          onStatus={() => console.log('status')}
        />
        <Item data={
          {
            status: FilterStatus.DONE,
            description: 'Item 2'
          }}
          onRemove={() => console.log('remove')}
          onStatus={() => console.log('status')}
        />
      </View>
    </View>
  );
}
