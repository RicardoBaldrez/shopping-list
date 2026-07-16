import AsyncStorage from '@react-native-async-storage/async-storage';

import { FilterStatus } from '@/types/FilterStatus';

const ITEMS_STORAGE_KEY = '@shopping_list:items';

export type ItemStorage = {
    id: string;
    description: string;
    status: FilterStatus;
}

async function get(): Promise<ItemStorage[]> {
    try {
        const storage = await AsyncStorage.getItem(ITEMS_STORAGE_KEY);
        return storage ? JSON.parse(storage) : [];
    } catch (error) {
        throw new Error("GET_ITEMS_STORAGE_ERROR: " + error);
    }
}

async function getByStatus(status: FilterStatus): Promise<ItemStorage[]> {
    const items = await get();
    return items.filter(item => item.status === status);
}

async function save(items: ItemStorage[]): Promise<void> {
    try {
        await AsyncStorage.setItem(ITEMS_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
        throw new Error("SAVE_ITEMS_STORAGE_ERROR: " + error);
    }
}

async function add(newItem: ItemStorage): Promise<void> {
    const items = await get();
    const updatedItems = [...items, newItem];
    await save(updatedItems);
}

async function remove(id: string): Promise<void> {
    const items = await get();
    const updatedItems = items.filter(item => item.id !== id);
    await save(updatedItems);
}

async function clear(): Promise<void> {
    try {
        await AsyncStorage.removeItem(ITEMS_STORAGE_KEY);
    } catch (error) {
        throw new Error("CLEAR_ITEMS_STORAGE_ERROR: " + error);
    }
}

async function toggleStatus(id: string): Promise<void> {
    try {
        const items = await get();
        const updateItems = items.map(item => 
            item.id === id ? {
                ...item,
                status: item.status === FilterStatus.PENDING ? FilterStatus.DONE : FilterStatus.PENDING
            } : item
        );

        await save(updateItems);
    } catch (error) {
        throw new Error("TOGGLE_STATUS_ITEMS_STORAGE_ERROR: " + error);
    }
}

export const itemsStorage = {
    get,
    add,
    clear,
    remove,
    getByStatus,
    toggleStatus
}
