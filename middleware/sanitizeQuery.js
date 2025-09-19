module.exports = (req, res, next) => {
  const allowed = [
    'sort',
    'page',
    'limit',
    'fields',
    'difficulty',
    'order',
    'duration',
    'rating',
    'ratingsAverage',
    'ratingsQuantity',
    'role',
    'price',
    'tour',
    'user',
  ];

  Object.entries(req.query).forEach(([key, value]) => {
    if (!allowed.includes(key)) {
      delete req.query[key]; // drop unknown params
      return;
    }

    if (typeof value === 'string') {
      let cleaned = value.trim();

      // lowercase normalization
      if (['difficulty', 'sort', 'order'].includes(key)) {
        cleaned = cleaned.toLowerCase();
      }

      // number conversion for numeric fields
      if (['page', 'limit'].includes(key)) {
        const num = Number(cleaned);
        if (!Number.isNaN(num) && cleaned !== '') {
          cleaned = num;
        }
      }

      // strip potentially harmful characters
      cleaned = cleaned.replace(/[$<>]/g, '');

      req.query[key] = cleaned;
    }
  });

  next();
};

// module.exports = (req, res, next) => {
//   Object.entries(req.query).forEach(([key, value]) => {
//     if (typeof value === 'string') {
//       let cleaned = value.trim();

//       // Optional: lowercase normalization for certain fields
//       if (['difficulty', 'sort', 'order'].includes(key)) {
//         cleaned = cleaned.toLowerCase();
//       }

//       // Convert to number if it's a numeric string
//       const num = Number(cleaned);
//       if (!Number.isNaN(num) && cleaned !== '') {
//         cleaned = num;
//       }

//       req.query[key] = cleaned;
//     }
//   });

//   next();
// };
