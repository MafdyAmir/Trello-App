import mongoose from "mongoose";

const taskSchema = mongoose.Schema({
    title:{
        type:String,
        require:true,
    },
    description:{
        type:String,
        require:true
    },
    status:{
        type:String,
        enum:['ToDo','Doing','Done'],
        defualt:'ToDo'
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    userId:{    //creator task
        type:mongoose.Types.ObjectId,
        requier:true,
        ref:'users'
    },
    assignTo:{  
        type:mongoose.Types.ObjectId,
        requier:true,
        ref:'users'
    },
    deadLine:{  //(timestamps) can i use this type with deadLine
        type:Date,
        requier:true
    },
    
},{
    timestamps:true
})

const taskModel = mongoose.model("task", taskSchema);

export default taskModel;