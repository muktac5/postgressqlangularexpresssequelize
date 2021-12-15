var express=require('express');
var Sequelize=require('sequelize');
const { dialect } = require('./db.config');
var dbConfig=require('./db.config');
var cors=require("cors");
const bodyparser=require('body-parser');

const app=express();
app.use(express.json());
app.use(cors()); 

var sequelize= new Sequelize(dbConfig.DB,dbConfig.USER,dbConfig.PASSWORD,{

    host:dbConfig.HOST,
    dialect:dbConfig.dialect,
    pool:{
        min:dbConfig.pool.min,
        max:dbConfig.pool.max,
        acquire:dbConfig.pool.acquire,
        idle:dbConfig.pool.idle
    }
});

sequelize.authenticate().then(()=>{
    console.log("connected to database successfully..");
}).catch(err =>{
    console.error("unable to connect to db"+err);
})

let userTable=sequelize.define('StudentUserTable',{
    email:{
        primaryKey:true,
        type:Sequelize.STRING
    },
    name:Sequelize.STRING,
    phoneNo:Sequelize.STRING,
    password:Sequelize.STRING
},{
    timestamps:false,
    freezeTableName:true
});

/*
userTable.sync({force:true}).then(()=>{
    console.log("Table created successfully");
}).catch(err=>{
    console.error("Error"+err);
});
*/

app.use(cors());

app.use(express.json());
app.get("/",function(req,res){
    console.log("At the localhost:8000");
    res.send("hii");
})

app.get("/getAll",function(req,res){
    userTable.findAll({raw:true}).then(data=>{
        console.log(data);
        res.send(data);
    }).catch(err=>{
        console.error(err);
        res.send(err);
    })
})

app.get("/getUserByEmail/:e",function(req,res){
    var email=req.params.e;
    console.log("query email is :"+email);
    userTable.findAll({where:{email:email},raw:true}).then(data=>{
        console.log(data);
        res.send(data);
    }).catch(err=>{
        res.send(err);
    })
});

app.use(bodyparser.json());
app.post("/insertStudent",function(req,res) {
    console.log("data");
    var email = req.body.email;
    var name=req.body.name;
    var phoneNo=req.body.phoneNo;
    var password=req.body.password;

    var empObj = userTable.build({email:email,name:name,phoneNo:phoneNo,password:password});
    empObj.save().then(data=>{
        var strMsg = "Record inserted successfully...";
        console.log("data");
        res.send(strMsg);
    }).catch ( err=>{
        res.send(err);
    })
});

app.put("/updateStudent",function(req,res){
    var email = req.body.email;
    var name=req.body.name;
    var phoneNo=req.body.phoneNo;
    var password=req.body.password;

    userTable.update({email:email,name:name,phoneNo:phoneNo,password:password},{where:{email:email}}).then(data => {
        console.log(data);
        var strMsg = "Record updated successfully";
        res.send(strMsg);
    }).catch(err =>{
        console.error(err);
        res.send(err);
    })
});


app.delete("/deleteStudentbyemail/:email",function(req,res){
    console.log("enter student email");
    var email = req.params.email;
    console.log("Given id is :"+email);

    userTable.destroy({where : {email:email}}).then( data =>{
        console.log(data);
        var strMsg="Record deleted successfully...";
        res.send(strMsg);
    }).catch(err=>{
        console.error(err);
        res.send(err);
    })
});

app.post('/register',function(req,res){
    var email = req.body.email;
    var name=req.body.name;
    var phoneNo=req.body.phoneNo;
    var password=req.body.password;
    var userObj=userTable.build({email:email,name:name,phoneNo:phoneNo,password:password});
    userObj.save().then(data=>{
        var msg="record inserted successfully";
        res.status(200).send(data)
    }).catch(err=>{
        console.error("there is an error getting data from db"+err);
        res.send(err);
    })
})

app.post("/login",function(req,res){
    console.log("logging at server side");
    var email = req.body.email;
    var password=req.body.password;
    var str="";
    userTable.findAll({where:{email:email}},{raw:true}).then(data=>{
        if(data[0].password==password)
        res.send("Valid user");
        else{
            res.send("Invalid User");
        }
    }).catch(err=>{
        error="Invalid User";
        console.error("There is an error getting data from db: "+err);
        res.send(error);
    })
})

app.listen(8000,function(){
    console.log("server is listening at 8000");
})
