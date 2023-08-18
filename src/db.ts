import * as mongoose from 'mongoose'
//import AuthService from './services/admin/auth.service';
class Db {
   // public DB: mongoose.Mongoose;
    async connectDb(url: string): Promise<void> {
        try {
           // this.DB = await mongoose.connect(url);
            console.log('Database connected');
            //await AuthService.createAdmin();
        } catch (error) {
            console.log('Error to connecting database');
        }
    }
}

export default new Db();