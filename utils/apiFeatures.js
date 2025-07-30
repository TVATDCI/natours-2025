// ======================================
// APIFeatures class: Encapsulates and chains query logic
// ======================================
// STEP: 1. Set up the blueprint:
// - query: the base Mongoose query (e.g., Tour.find())
// - queryString: the incoming req.query object from Express
// - This allows each method (filter, sort, etc.) to access and manipulate them.
// ======================================

class APIFeatures {
  constructor(query, queryString) {
    this.query = query; // Mongoose query
    this.queryString = queryString; // req.query
  }

  // ======================================
  // STEP: 2. FILTERING
  // Basic + Advanced Filtering
  // Removes reserved query fields, converts operators to MongoDB format
  // Example: ?price[gte]=500 becomes { price: { $gte: 500 } }
  // ======================================

  filter() {
    // Clone req.query to avoid mutating the original object
    const queryObj = { ...this.queryString };

    // Reserved fields that shouldn't be used for filtering
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Convert query object to string
    let queryStr = JSON.stringify(queryObj);

    // Replace operators with regex manipulation to match MongoDB-compatible ones
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    // NOTE: Parse the query string back into an object for advanced filtering.
    // Using a clearly named variable (`advancedFilter`) improves readability and intent.
    const advancedFilter = JSON.parse(queryStr);

    // DEBUG
    console.log('Parsed filter:', advancedFilter);

    // Apply to Mongoose query
    // Then call (`advancedFilter`) instead of:
    // this.query = this.query.find(JSON.parse(queryStr));
    this.query = this.query.find(advancedFilter);

    // Enables chaining (return)
    return this;
  }

  // ======================================
  // STEP: 3. SORTING
  // Supports multi-field sorting via comma-separated values
  // Example: ?sort=-price,ratingsAverage
  // ======================================

  sort() {
    // if (req.queryString.sort)
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);

      // DEBUG
      console.log('Sorting by:', sortBy);
    } else {
      // ======================================
      // 4. PAGINATION
      // Supports paging with ?page=2&limit=10
      // Skip calculated from (page - 1) * limit
      // ======================================
      this.query = this.query.sort('-createdAt');
    }

    // Enables chaining (return)
    return this;
  }

  // ======================================
  // STEP: 4. FIELD LIMITING
  // Controls which fields are returned in the response
  // Example: ?fields=name,price
  // ======================================

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);

      // DEBUG
      console.log('Limited by:', fields);
    } else {
      this.query = this.query.select('-__v');
    }

    // Enables chaining
    return this;
  }

  // ======================================
  // STEP: 5. PAGINATION
  // Supports paging with ?page=2&limit=10
  // Skip calculated from (page - 1) * limit
  // ======================================

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    // DEBUG
    console.log('Pagination:', { page, limit, skip });

    // Enables chaining
    return this;
  }
}

module.exports = APIFeatures;
