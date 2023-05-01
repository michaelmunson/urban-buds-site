import { Firestore } from "@google-cloud/firestore";

export const Database = new Firestore({
  projectId: 'urban-buds-site',
  keyFilename: '/Users/michael/code/urban-buds-site/urban-buds-site-8e63bf883471.json',
});

// export const Database = new Firestore();

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

export const Admin = {
    async getAdmin(id){
        return await Database.collection('admins').doc(id).get();
    },
    async getAdminData(id){
        return (await this.getAdmin(id)).data();
    },
    async isAdmin(id){
        return (await this.getAdmin(id)).exists;
    },
    async verifyAdmin(id,password){
        if (await this.isAdmin(id)){
            const adminData = await this.getAdminData(id);
            return (password === adminData.password)
        }
        return false;
    }
}

export const Product = {
    async listProductData(){
        const productArr = [];
        const products = await Database.collection('products').get();
        products.forEach(store => {
            productArr.push(store.data());
        });
        return productArr;
    },
    async createProduct(data){
        try {
            const id = data.name;
            return await Database.collection('products').doc(id).set(data);
        }
        catch(e){
            return {
                error: true,
                message : e,
            }
        }
    },
    async removeProduct(idArray){
        const results = [];
        for (const id of idArray){
            results.push(await Database.collection('products').doc(id).delete());
        }
        return results;
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
    },
    async listStoreData(){
        const storeArr = [];
        const stores = await Database.collection('stores').get();
        stores.forEach(store => {
            storeArr.push(store.data());
        });
        return storeArr;
    },
    async createStore(data){
        try {
            const id = data.store_id;
            return await Database.collection('stores').doc(id).set(data);
        }
        catch(e){
            return {
                error: true,
                message : e,
            }
        }
    },
    async removeStore(idArray){
        const results = [];
        for (const id of idArray){
            results.push(await Database.collection('stores').doc(id).delete());
        }
        return results;
    }
}

export const Order = {

    async getNumOrders(){
        return await Database.collection('orders').count().get();
    },

    async getOrders(){
        const orders = [];
        const ordersRef = await Database.collection("orders").get();
        ordersRef.forEach(order => {
            orders.push(order.data());
        });
        return {orders}
    },

    async createOrder(orderReq){
        const orderNum = (await this.getNumOrders())._data.count + 45; 
        let orderPrefix = "";

        for (let i = 0; i < (6 - (orderNum.toString().length)); i ++){
            orderPrefix += "0";
        }

        const orderId = orderPrefix + orderNum;

        const result = await Database.collection('orders').doc(orderId).set({...orderReq});
        return {
            ...result,
            error:false,
            orderId,
        }
    }
}

export const Stats = {
    async getViews(){
        const views = [];
        const result = await Database.collection('stats').doc('website').get();
        (await result.ref.collection("views").get()).forEach(view => {
            views.push(view.data());
        });
        return {views};
    },

    async addView(req){
        const result = await Database.collection('stats').doc('website').get();
        return result.ref.collection("views").add(req);
    }
}

