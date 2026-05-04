// ======================================================
// APIFeatures class: Encapsulates and chains query logic
// ======================================================
// STEP: 1. Set up the blueprint:
// ======================================

class APIFeatures {
  constructor(query, queryString) {
    this.query = query; // Mongoose query
    this.queryString = queryString; // req.query
  }

  // ===================
  // STEP: 2. FILTERING
  // ===================
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);

    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    const advancedFilter = JSON.parse(queryStr);

    // console.log('Parsed filter:', advancedFilter);

    this.query = this.query.find(advancedFilter);

    // Enables chaining (return)
    return this;
  }

  // =================
  // STEP: 3. SORTING
  // =================

  sort() {
    // if (req.queryString.sort)
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    // Enables chaining (return)
    return this;
  }

  // =======================
  // STEP: 4. FIELD LIMITING
  // =======================

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);

      // console.log('Limited by:', fields);
    } else {
      this.query = this.query.select('-__v');
    }

    // Enables chaining
    return this;
  }
  // ===================
  // STEP: 5. PAGINATION
  // ===================

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    // console.log('Pagination:', { page, limit, skip });

    // Enables chaining
    return this;
  }
}

module.exports = APIFeatures;
