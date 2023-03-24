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



