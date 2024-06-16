class Apifeatures{
    constructor(query, queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    //Advance filtering of movies Eg. url--> 127.0.0.1:3000/api/v1/movies/?duration[gte]=120&rating[gte]=4.5&price[lte]=50.0
    filter(){
        let queryString = JSON.stringify(this.queryStr);
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match)=> `$${match}`); //using regular expression
        const queryObj = JSON.parse(queryString);
        this.query = this.query.find(queryObj);
        return this;
    }

    //Sorting movies on the basis of field...
    sort(){
        const excludeFields = ['sort','page','limit','fields']; //fields to be excluded from query obj
        let newQueryObj = {...queryObj} //creating shallow copy of query object..
        excludeFields.forEach((elem)=>{
            delete newQueryObj[elem];
        });
        this.query = this.query.find(newQueryObj); //returns query object so that we can use mongoose query method in it like .sort().
        
        if(this.queryStr.sort){
            const sortBy = this.queryStr.sort.split(",").join(" ");
            // console.log(sortBy);
            this.query = this.query.sort(sortBy); 
        }else{
            this.query = this.query.sort("-createdAt"); //newly created at the top.
        }
        return this;
    }

    limitFields(){
        if(this.queryStr.fields){
            const fields = this.queryStr.fields.split(",").join(" ");
            this.query = this.query.select(fields) //.select() is also a mongoose query method...
                    // .select("name price duration description") --> contains the fields which are to be returned 
        }else{
            this.query = this.query.select("-__v"); //Selecting all fields except __v using '-' (i.e. excluding field __v)
        }
        return this;
    }

    pagination(){
        const page = this.queryStr.page*1 || 1;
        const limit = this.queryStr.limit*1; //specify how many movies in one page? 
        const skip = (page-1)*limit; //number of movies to skip for the given page..
        this.query = this.query.skip(skip).limit(limit); //specify which page to show how many documents.
    //     if(req.query.page){
    //         const moviesCount = await Movie.countDocuments();
    //         if(skip >= moviesCount){
    //             throw new Error("This page is not found");
    //         }
    //     }
    return this;
    }
}

module.exports = Apifeatures;