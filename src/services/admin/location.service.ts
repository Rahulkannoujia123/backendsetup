import { LocationInterface } from "../../interfaces/location.interface";
import LocationModel from "../../models/location.model";
import { ApiFeatures } from "../../utils/api-features";

class LocationService {

    async list(queryString: any): Promise<{ count: number, list: LocationInterface[] }> {
        const countQuery = LocationModel.find({ isDeleted: false });
        const countFeature = new ApiFeatures(countQuery, queryString)
            .searching(['locationName'])
            .getCount();
        const lisQuery = LocationModel.find({ isDeleted: false });
        const listFeature:any = new ApiFeatures(lisQuery, queryString)
            .searching(['locationName'])
            .sorting('-createdAt')
            .pagination();

        // console.log(listFeature.options,"ramlaaaaaal");
        const count = await countFeature.query;
        const list = await listFeature.query;

        return { list, count };
    }

};
export default new LocationService()