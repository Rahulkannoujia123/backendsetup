// import * as slug from 'slug';
// import Db from '../db';



// /**
//  * 
//  * @param slugStr name of slug creation document
//  * @param collection database collection name
//  * @returns 
//  */
// export const generateSlug = async (slugStr: string, collection: string, count: number = 0): Promise<string> => {
//     let s = slugStr;
//     if (!count) {
//         s = slug(slugStr, { locale: 'en' });
//     }
//     const exist = await Db.DB.model(collection).findOne({ slug: s });
//     if (exist) {
//         count++;
//         const sArr = s.split('-');
//         if (typeof sArr[sArr.length - 1] === 'number') {
//             sArr.push(count.toString());
//             s = sArr.join('-');
//         }
//         else {
//             s = `${s}-${count}`;
//         }
//         s = await generateSlug(s, collection, count);
//     }
//     return s;
// }

