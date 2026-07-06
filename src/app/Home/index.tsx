import { View, Image } from 'react-native';

import { styles } from './styles';
import { Button } from '@/components/Button';

export function Home() {
  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require("@/assets/logo.png")}
      />
      <Button title="Adicionar" />
    </View>
  );
}
