class apiFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    filter() {
        const excludeFields = ['sort', 'page', 'limit', 'fields'];
        const queryObj = { ...this.queryStr };

        // Exclude unwanted fields
        excludeFields.forEach((el) => {
            delete queryObj[el];
        });

        console.log("Filtered Query Object: ", queryObj); // Debug log

        // Adding dollar sign to operators (like gte, lte)
        let queryStr1 = JSON.stringify(queryObj);
        queryStr1 = queryStr1.replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`);
        const queryObj2 = JSON.parse(queryStr1);

        // Apply the filter to the query
        this.query = this.query.find(queryObj2);
        console.log("Query after filtering: ", this.query); // Debug log
        return this;
    }

    sort() {
        if (this.queryStr.sort) {
            const sortBy = this.queryStr.sort.split(',').join(' '); // Handle multiple sort fields
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createdAt'); // Default sort by creation date, for example
        }
        console.log("Query after sorting: ", this.query); // Debug log
        return this;
    }

    limit_fields() {
        if (this.queryStr.fields) {
            const fields = this.queryStr.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        }
        console.log("Query after limiting fields: ", this.query); // Debug log
        return this;
    }

    pagination() {
        const page = this.queryStr.page * 1 || 1;
        const limit = this.queryStr.limit * 1 || 10;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);
        console.log("Query after pagination: ", this.query); // Debug log
        return this;
    }
}

module.exports = apiFeatures;
