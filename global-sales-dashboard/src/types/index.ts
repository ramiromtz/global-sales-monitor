export interface Order {
    id: number;
    amount: number;
    store: { name: string; city: string; lat: number; lng: number };
    createdAt: string;
}
