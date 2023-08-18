
import { Approved, UserInterface, UserType } from "../../interfaces/user.interface";
import UserModel from "../../models/user.model";
import { ApiFeatures } from "../../utils/api-features";


class IndividualUserService{

     /**
    * @description listing of user
    * @param queryString req query object
    * @params User id of user
    * @returns 
    */

      async add(
       name:string,
       email:string,
       countryCode:string,
       phoneNumber:string
    ): Promise<UserInterface> {
        const newIndividualUser: UserInterface = await UserModel.create({name,email,countryCode,phoneNumber,userType: UserType.addedByAdmin,isApproved:Approved.approved });
        return  newIndividualUser;
    }
    /**
    * 
    * @param _id id of individual user
    * @param name name  of individual user
    * @param email email of individual user
    * @param countryCode countryCode of individual user
    * @returns  {Promise<IndividualUserInterface>}
    */

    async update(
        _id: string,
        name:string,
       email:string,
       countryCode:string,
       phoneNumber:string
    ): Promise<UserInterface> {
        const updatedIndividualUser: UserInterface = await UserModel .findByIdAndUpdate(
            _id,
            {
              name,
              email,
              countryCode,
              phoneNumber 
            },
            {
                new: true
            }
        );
        return updatedIndividualUser;
    }
    async list(
        queryString: any,
    ): Promise<{ count: number, list: UserInterface[] }> {
        const countQuery = UserModel.find({ isDeleted: false,  });
        const countFeature = new ApiFeatures(countQuery, queryString)
            .filtering()
            .searching(['name'])
            .getCount();

        const lisQuery = UserModel.find({ isDeleted: false, });
        const listFeature = new ApiFeatures(lisQuery, queryString)
            .filtering()
            .searching(['name'])
            .sorting('-createdAt')
            .fieldsLimiting()
            .pagination();

        const count = await countFeature.query;
        const list = await listFeature.query;

        return { count, list };
    }
  

     
}
export default new IndividualUserService();