import { ObjectId } from "aws-sdk/clients/codecommit";
import { UserInterface } from "../../interfaces/user.interface";
import UserModel from "../../models/user.model";
import { ApiFeatures } from "../../utils/api-features";


class UserService{
    async userList(
        queryString: any
    ): Promise<{ count: number, list: UserInterface[],page:number,limit:number }> {
        const page = queryString.page * 1 || 1;
        const limit = queryString.limit * 1 || 10;
        const countQuery = UserModel.find({ isVerified: true,name:{$ne:null}});
        const countFeature = new ApiFeatures(countQuery, queryString)
            .filtering()
            .searching(['name','email'])
            .sorting('-createdAt')
            .getCount();

        const lisQuery = UserModel.find({ isVerified: true,name:{$ne:null} });
        const listFeature = new ApiFeatures(lisQuery, queryString)
            .filtering()
            .searching(['name','email'])
            .sorting('-createdAt')
            .fieldsLimiting()
            .pagination();

        const count = await countFeature.query;
        const list = await listFeature.query;
        // console.log("fsdfsf", page, limit);
        
        return { count, list ,page,limit };
    }
      /**
    * @description get user by id
    * @param id {String} user id for fetching user
    * @returns {Promise<UserInterface>} user data by id
    */

       async findUser(
       id: string | ObjectId
    ): Promise<UserInterface> {
        const userData: UserInterface = await UserModel.findById(id);
        return userData;
    }


}

export default new UserService();