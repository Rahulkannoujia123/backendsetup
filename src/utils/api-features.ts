
export class ApiFeatures {
  query: any;
  queryString: any;
  constructor(query:any, queryString:any) {
    this.query = query;
    this.queryString = queryString;
  }

  filtering() {
    let queryObj = { ...this.queryString };
    let excludingFields = ['page', 'limit', 'sort', 'fields', 'search'];
    excludingFields.forEach(el => delete queryObj[el]);
    // Filtering query
    let newQuery = (JSON.stringify(queryObj)).replace(/\b(gte|gt|lt|lte)\b/g, match => `$${match}`);
    newQuery = JSON.parse(newQuery);
    this.query = this.query.find(newQuery);
    return this;
  }

  pagination() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    let skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }

  fieldsLimiting() {
    if (this.queryString.fields) {
      let fields = (this.queryString.fields).split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  sorting(defaultSort: string) {
    if (this.queryString.sort) {
      let sortBy = (this.queryString.sort).split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort(defaultSort);
    }
    return this;
  }

  searching(fields: string[]) {
    if (this.queryString.search) {
      const search = this.queryString.search;
      const searchObject: any = { $or: [] };
      fields.forEach(field => {
        searchObject.$or.push({ [field]: { $regex: `${search}`, $options: '$i' } });
      });
      this.query = this.query.find(searchObject);
      console.log(this.query);
    }
    return this;
  }

  getCount() {
    this.query = this.query.countDocuments();
    return this;
  }
}
