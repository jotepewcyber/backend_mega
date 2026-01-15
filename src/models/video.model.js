import mongoose,{Schema} from "mongoose"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema=new Schema({
    videoFile:{
        type:String,  //cloudinary url
        required:true,
    },
    thumbnail:{
        type:String, //cloudinary url
        required:true,
    },
    title:{
        type:String,
        required:true,
        index:true
    },
    description:{
        type:String,
        required:true,
    },
    //After uploading video to cloudinary we get various info about video like format,resolution,duration etc
    duration:{
type:Number, //in seconds
required:true,
    },
    views:{
        type:Number,
        default:0,
    },
    isPublic:{
        type:Boolean,
        default:true,
    },
    owner:{
type:Schema.Types.ObjectId,
ref:"User",
    }

},{timestamps:true})

videoSchema.plugin(mongooseAggregatePaginate);
// Take the schema videoSchema
// Apply the plugin mongooseAggregatePaginate
// The plugin modifies the schema/model

export const Video=mongoose.model("Video", videoSchema);