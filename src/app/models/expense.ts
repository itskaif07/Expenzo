
export interface expense{

    id?:'',
    name:string,
    amount:number,
    date:Date,
    category: string,
    description?:string,
    location?:string,
    status: 'Paid' | 'Pending';
    paymentMethod: 'Cash' | 'Card' | 'UPI' | 'Wallet';
}