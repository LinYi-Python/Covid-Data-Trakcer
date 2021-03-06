const mongoCollections = require('../config/mongoCollections');
const { ObjectId } = require('mongodb');
// const ObjectId = require('mongodb').ObjectId;
const comments = mongoCollections.comments;
const users = mongoCollections.users;
const vaccineInjectionSite = mongoCollections.vaccineInjectionSite;
const usersCollection = require("./users");

//comment
// {
//     "_id": "12eg456-e89b-24d3-a456-426655440000",
//     "userId": "12eg456-e89b-24d3-a456-426655440000",
//     "siteId": "12eg456-e89b-24d3-a456-426655440000",
//     "data": "04//06/2021",
//     "rating": "4.5",
//     "comment":"Nice and Social distant"
// }

async function getCommentById(commentId){
    if(!commentId || typeof (commentId) !== "string"){
        throw "input a not string format commentId"
    }
    
    commentId = commentId.slice(0,24); // fucking \n in postman
    // console.log(commentId.length);
    const commentCollection = await comments();
    // let objectId = ObjectId(commentId);
    let objectId = ObjectId(commentId);
    // commentId = ObjectId.createFromHexString(commentId);
    let commentGoal = await commentCollection.findOne({ _id: objectId});
    if (commentGoal === null)
        throw 'No comment with that id';
    return commentGoal;
}

async function getAllComments(){
    const commentCollection = await comments();
    let allComments = await commentCollection.find({}).toArray();
    return allComments;
}

async function addComment(userId, siteId, rating, comment){
    if(!userId || typeof (userId) !=="string"){
        throw "input a string format userId";
    }

    if(!siteId || typeof (siteId) !=="string"){
        throw "input a string format siteId";
    }

    if(!rating|| typeof (rating) !=="string"){
        throw "input a string format rating";
    }

    if(!comment || typeof (comment) !=="string"){
        throw "input a string format comment";
    }
    const commentCollection = await comments();
    let newComment = {
        userId: userId,
        siteId:siteId,
        date: new Date().toLocaleDateString(),
        rating: rating,
        comment: comment
    }
    
    let insertInfo = await commentCollection.insertOne(newComment);
    if (insertInfo === null)
        throw 'Something wrong when adding the comment';
    let newCommentId = insertInfo.insertedId;
    let commentCreated = await getCommentById(newCommentId.toHexString());

    //add two methods
    // await usersCollection.addCommentIdFromUser(userId, newCommentId.toHexString());
    // await sitesCollection.addCommentIdFromSite(siteId, newCommentId.toHexString());





    return commentCreated;



}

async function removeComment(commentId, userId, siteId){
    if(!commentId || typeof (commentId) !=="string"){
        throw "input a string format commentId";
    }
    if(!userId || typeof (userId) !=="string"){
        throw "input a string format userId";
    }
    if(!siteId || typeof (siteId) !=="string"){
        throw "input a string format siteId";
    }

    //add two methods
    // await usersCollection.removeCommentIdFromUser(userId, commentId);
    // await sitesCollection.removeCommentIdFromSite(siteId, commentId);


    commentId = ObjectId(commentId);
    const commentCollection = await comments();
    let deletionInfo = await commentCollection.removeOne({ _id: commentId });
    if (deletionInfo.deletedCount === 0) {
        throw `Could not delete the comment`;
    }

    return true;
}

async function averageRating(siteId){
    if(!siteId || typeof (siteId) !=="string"){
        throw "input a string format commentId";
    }
    const commentCollection =  comments();
    const siteInfo =  getSiteById(siteId);
    let commentsHistory;
    if(!siteInfo.comments_history || typeof (siteInfo.comments_history) ==='undefined'){
        return null;
    }else {
        commentsHistory = siteInfo.comments_history;
        let temp = [];
        for(let i of commentsHistory){
            i._id = ObjectId(i._id);
            let tempComment = await commentCollection.findOne({_id: i._id});
            let rating = tempComment.rating;
            rating = parseInt(rating);
            temp.push(rating);
        }
        let sum = 0;
        for(let j = 0; j < temp.length; j++){
            sum += temp[j];
        }
        return sum/ temp.length;
    }

}

 async function getSiteById(siteId){
    if (!siteId|| typeof siteId !== 'string'){
        throw 'Site id is not a valid string.';
    }

    siteId = ObjectId(siteId);
    const vaccineCollection = vaccineInjectionSite();
    let vaccine = await vaccineCollection.findOne({_id: siteId});
    if(vaccine === null){
        throw "No site found";
    }
    return vaccine;
}





module.exports={
    getCommentById,
    addComment,
    removeComment,
    getAllComments,
    averageRating
}