
import { ObjectId } from "aws-sdk/clients/codecommit";
import { UserInterface } from "../../interfaces/user.interface";
import UserModel from "../../models/user.model";
import { ApiFeatures } from "../../utils/api-features";


class UserService {

    /**
   * @description listing of user
   * @param queryString req query object
   * @params User id of user
   * @returns 
   */

    async list(
        queryString: any,
    ): Promise<{ count: number, list: UserInterface[] }> {
        const countQuery = UserModel.find({ isDeleted: false, isCompleted: true});
        const sorting =queryString.sort||'-createdAt';
        const countFeature = new ApiFeatures(countQuery, queryString)
            .filtering()
            .searching(['name','email'])
            .sorting(sorting)
            .getCount();

        const lisQuery = UserModel.find({ isDeleted: false, isCompleted: true});
        const listFeature = new ApiFeatures(lisQuery, queryString)
            .filtering()
            .searching(['name','email'])
            .sorting(sorting)
            .fieldsLimiting()
            .pagination();

        const count = await countFeature.query;
        const list = await listFeature.query;

        return { count, list };
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