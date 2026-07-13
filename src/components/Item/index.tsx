import { View, Text, TouchableOpacity } from 'react-native';
import { Trash2 } from 'lucide-react-native';

import { styles } from './styles';
import { FilterStatus } from '@/types/FilterStatus';
import { StatusIcon } from '@/components/StatusIcon';

type ItemDataProps = {
    status: FilterStatus;
    description: string;
};

type ItemProps = {
    data: ItemDataProps;
    onRemove: () => void;
    onStatus: () => void;
};

export function Item({ data, onRemove, onStatus }: ItemProps) {
    return (
        <View style={styles.container}>
            <TouchableOpacity activeOpacity={0.8} onPress={onStatus}>
                <StatusIcon status={data.status} />
            </TouchableOpacity>

            <Text style={styles.description}>
                {data.description}
            </Text>

            <TouchableOpacity activeOpacity={0.8} onPress={onRemove}>
                <Trash2 size={18} color="#828282" />
            </TouchableOpacity>
        </View>
    );
}
