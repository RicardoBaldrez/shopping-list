import AsyncStorage from '@react-native-async-storage/async-storage';

import { FilterStatus } from '@/types/FilterStatus';

const ITEMS_STORAGE_KEY = '@shopping_list:items';

export type ItemStorageProps = {
    id: string;
    description: string;
    status: FilterStatus;
}

async function get(): Promise<ItemStorageProps[]> {
    try {
        const storage = await AsyncStorage.getItem(ITEMS_STORAGE_KEY);
        return storage ? JSON.parse(storage) : [];
    } catch (error) {
        throw new Error("GET_ITEMS_STORAGE_ERROR: " + error);
    }
}

export const itemsStorage = {
    get,
}
