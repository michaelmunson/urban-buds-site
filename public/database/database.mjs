import { Firestore } from "@google-cloud/firestore";


export const Database = new Firestore({
  projectId: 'urban-buds-site',
  keyFilename: '/Users/michael/code/urban-buds-site/urban-buds-site-8e63bf883471.json',
});

export const User = {
    async getUser(id){
        return await Database.collection('users').doc(id).get();
    },
    async getUserData(id){
        return (await this.getUser(id)).data();
    },
    async isUser(id){
        return (await this.getUser(id)).exists;
    },
    async addUser({firstName,lastName,email,password}){

        if (await this.isUser(email)) return {
            error : true,
            message : "Email already exists"
        }
    
        const res = await Database.collection('users').doc(email).set({
            firstName,
            lastName,
            email,
            password,
        });
    
        return {
            error : false,
            message : "signup successful",
            res,
        }
    }
}

export const Product = {
    async listProducts(){

    }
}

export const Store = {
    async getStore(id){
        return await Database.collection('stores').doc(id).get();
    },
    async getStoreData(id){
        return (await this.getStore(id)).data();
    },
    async isStore(id){
        return (await this.getStore(id)).exists
    }
}

export const Order = {

    async getNumOrders(){
        return await Database.collection('orders').count().get();
    },

    async createOrder(order){
        const orderNum = (await this.getNumOrders())._data.count + 45; 
        let orderPrefix = "";

        for (let i = 0; i < (6 - (orderNum.toString().length)); i ++){
            orderPrefix += "0";
        }

        const orderId = orderPrefix + orderNum;

        const result = await Database.collection('orders').doc(orderId).set({order});
        return {
            ...result,
            error:false,
            orderId,
        }
    }
}

