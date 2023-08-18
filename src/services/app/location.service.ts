import * as mongoose from "mongoose";
import { PipelineStage } from "mongoose";
import { LocationInterface } from "../../interfaces/location.interface";
import LocationModel from "../../models/location.model";
import MovedItemModel from "../../models/moved-item.model";
import { ApiFeatures } from "../../utils/api-features";

class LocationService{

    async list(
        queryString: any
    ): Promise<{ count: number, list: LocationInterface[], page:number , limit:number }> {
        const page = queryString.page  * 1 || 1;
        const limit = queryString.limit * 1 || 10;
        const countQuery = LocationModel.find();
        const countFeature = new ApiFeatures(countQuery, queryString)
      .searching(['locationName'])
      .getCount();
    
    const lisQuery = LocationModel.find();
    const listFeature = new ApiFeatures(lisQuery, queryString)
      .searching(['locationName','locationAddress'])
      .sorting('-createdAt')
      .pagination();

    const count = await countFeature.query;
    const list = await listFeature.query;

    return { list, count ,page , limit };

    }

    async usersLocationList(
      userId:string,
      queryString:any
    ): Promise<{ count:number ,list: LocationInterface[],page:number , limit:number}> {
        const page = queryString.page  * 1 || 1;
        const limit = queryString.limit * 1 || 10;
        let   skip = (page - 1) * limit;
        const search = queryString.search||null;
        console.log("user aa gaya",userId);
        const conditions = {
          $or: [
            {receiverId: new mongoose.Types.ObjectId(userId)},
            {userId:new mongoose.Types.ObjectId(userId)}
          ],
          movingStatus:1,
        }
        let searchMatch ={}
        if(search &&  search.trim()){
          searchMatch = {
            '$or': [
              {
                'result.locationName': {
                  '$regex': search, 
                  '$options': '$i'
                }
              }, {
                'result.locationAddress': {
                  '$regex': search, 
                  '$options': '$i'
                }
              }
            ]
          }
        }
        const pipeline = [
            {
              '$match': conditions
            }, {
              '$facet': {
                'count': [
                  {
                    '$count': 'count'
                  }
                ], 
                'list': [
                  {
                    '$lookup': {
                      'from': 'locations', 
                      'localField': 'location._id', 
                      'foreignField': '_id', 
                      'as': 'result'
                    }
                  }, {
                    '$unwind': {
                      'path': '$result', 
                      'preserveNullAndEmptyArrays': true
                    }
                  }, {
                    '$match': searchMatch
                  },
                  {
                    '$skip':skip
                  },
                  {
                    '$limit':limit
                  },
                  {
                    '$sort': {
                      'createdAt': -1
                    }
                  }, {
                    '$project': {
                      'result': 1, 
                      'userId': 1, 
                      'receiverId': 1
                    }
                  }
                ]
              }
            }, {
              '$project': {
                'count': {
                  '$first': '$count.count'
                }, 
                'list': 1
              }
            }
          ] as PipelineStage[];
        
       const locationData =await MovedItemModel.aggregate(pipeline);
       const list =locationData[0].list;
       const count =locationData[0].count;
        return { list, count ,page , limit };
    }
}




export default new LocationService();