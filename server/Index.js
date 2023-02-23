const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const mycon = require('mysql');
const fileupload = require('express-fileupload');
const { request, response } = require('express');
const fileUpload = require('express-fileupload');

const app = express();
app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));
app.use(fileupload());
app.use(express.static('public'));

const c = mycon.createConnection({
    host : "localhost",
    port : "3306",
    user : "root",
    password : "Mani*2000",
    database : "register"
});

c.connect(function(error){
    if(error){
        console.log(error);
    }
    else{
        console.log('Database Connected');
    }
})

app.get('/Checkstatus',(request,response)=>{

    let sql = 'select * from regstatus';

    c.query(sql,(error,result)=>{
        if(error){
            let s = {"status":"error"};
            response.send(s);
        }
        else{
            let status = result[0].regstate;
            let s = {"status":status};
            response.send(s);
        }
    })
})

app.post('/Registration',(request,response)=>{
    let {username,password,name,fathername,date_of_birth,email,phone} = request.body;

    let sql = 'insert into signup(username,password,name,fathername,date_of_birth,email,phone,status) values (?,?,?,?,?,?,?,?)';

    let sql1 = 'update regstatus set regstate=?';

    c.query(sql1,[1],(error1,result1)=>{})

    c.query(sql,[username,password,name,fathername,date_of_birth,email,phone,0],(error,result)=>{
        if(error){
            let s = {"status":"error"};
            response.send(s);
        }
        else{
            let s = {"status":"Registered"};
            response.send(s);
        }
    })

})

app.post('/Signin',(request,response)=>{
    let {username,password} = request.body;
    let sql = 'select * from signup where username=?';

    c.query(sql,[username],(error,result)=>{
        if(error){
            let s = {"status":"error"};
            response.send(s);
        }
        else if(result.length > 0){

            let id = result[0].id;
            let username1 = result[0].username;
            let password1 = result[0].password;
            if(username1 == username && password1 == password){
                let s = {"status":"Success","userid":id};
                response.send(s);
            }
            else{
                let s = {"status":"Invalid"};
                response.send(s);
            }
        }
        else{
            let s ={"status":"final_error"};
            response.send(s);
        }
    })

})

app.get('/View_par_user/:id',(request,response)=>{
    let {id} = request.params;
    let sql = 'select * from signup where id=?';

    c.query(sql,[id],(error,result)=>{
        if(error){
            let s = {"status":"error"};
            response.send(s);
        }
        else{
            let name = result[0].name;
            let s = {"status":name};
            response.send(s);
        }
    })

})

app.get('/Get_userdetails/:id',(request,response)=>{
    let {id} = request.params;
    let sql = 'select * from signup where id=?';

    c.query(sql,[id],(error,result)=>{
        if(error){
            let s = {"status":"error"};
            response.send(s);
        }
        else{
            response.send(result);
        }
    })   
})

app.post('/Add_profilephoto',(request,response)=>
{
    let userid=request.body.userid;
    let alt_text=request.body.alt_text;
    let imagefile=request.files.image;
    let filename=imagefile.name;
    let path=__dirname+'upload/'+imagefile.name;

    let url='http://localhost:3000/upload';

    let sql='insert into profilephoto(userid,url,filename,alt_text,status)values(?,?,?,?,?)';

    c.query(sql,[userid,url,filename,alt_text,0],(error,result)=>{});

    imagefile.mv(path,function(error)
    {
       if(error)
       {
        let s={"status":"error"};
        response.send(s);
       }
       else{
        let s={"status":"uploaded"};
        response.send(s);
       }
    });
})

app.get('/View_profilephoto/:userid',(request,response)=>{
    let {userid}=request.params;
    let sql='select * from profilephoto where userid=?';

    c.query(sql,[userid],(error,result)=>{
        if(error){
            response.send(error);
        }
        else{
            response.send(result);
        }
    });
})

     

app.post('/Add_education',(request,response)=>{

    let userid = request.body.userid;

    let {pg_course,pg_collegename,pg_percentage,pg_location,pg_passedout,ug_course,ug_collegename,ug_percentage,ug_location,ug_passedout,hsc,hsc_schoolname,hsc_percentage,hsc_location,hsc_passedout,sslc,sslc_schoolname,sslc_percentage,sslc_location,sslc_passedout}=request.body;
   
    let sql = 'insert into education1(userid,pg_course,pg_collegename,pg_percentage,pg_location,pg_passedout,ug_course,ug_collegename,ug_percentage,ug_location,ug_passedout,hsc,hsc_schoolname,hsc_percentage,hsc_location,hsc_passedout,sslc,sslc_schoolname,sslc_percentage,sslc_location,sslc_passedout) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';

    c.query(sql,[userid,pg_course,pg_collegename,pg_percentage,pg_location,pg_passedout,ug_course,ug_collegename,ug_percentage,ug_location,ug_passedout,hsc,hsc_schoolname,hsc_percentage,hsc_location,hsc_passedout,sslc,sslc_schoolname,sslc_percentage,sslc_location,sslc_passedout],(error,result)=>{
        if(error){
            let s ={'status':'error'};
            response.send(s);
        
        }
        else{
            let s={'status':'Uploaded'};
            response.send(s);
        }
    })
})

app.get('/View_education/:userid',(request,response)=>{
    let {userid} = request.params;

    let sql='select * from education1 where userid=?';

    c.query(sql,[userid],(error,result)=>{{
        if(error){
            response.send(error);
        }
        else{
            response.send(result);
        }
    }})

})



app.post('/Add_Softskill',(request,response)=>{
    let userid = request.body.userid;
    let {html5,css3,bootstrap,javascript,corejava,reactjs,nodejs,mysql}=request.body;
    let sql = 'insert into softskills(userid,html5,css3,bootstrap,javascript,corejava,reactjs,nodejs,mysql)values(?,?,?,?,?,?,?,?,?)';

    c.query(sql,[userid,html5,css3,bootstrap,javascript,corejava,reactjs,nodejs,mysql],(error,request)=>{
        // console.log(userid);
        // console.log(html5);
        if(error){
            let s ={"status":"error"};
            response.send(s);
        
        }
        else{
            let s ={"status":"Registered"};
            response.send(s);
        }
    })
})

app.get('/View_softskill/:userid',(request,response)=>{
    let {userid}=request.params;

    let sql='select * from softskills where userid=?';
    c.query(sql,[userid],(error,result)=>{
        if(error)
        {
            response.send(error);
        }
        else{
            response.send(result);
        }
    })
})


app.get('/View_experience/:userid',(request,response)=>{
    let {userid}=request.params;

    let sql='select * from experience where userid=?';
    c.query(sql,[userid],(error,result)=>{
        if(error)
        {
            response.send(error);
        }
        else{
            response.send(result);
        }
    })
})

app.post('/Add_Experience',(request,response)=>{
    let userid = request.body.userid;
    let {field,experience}=request.body;

    let sql = 'insert into experience(userid,field,experience) values(?,?,?)';

    c.query(sql,[userid,field,experience],(error,result)=>{
        if(error){
            let s={"status":"error"};
            response.send(s);
        }
        else{
            let s={"status":"uploaded"};
            response.send(s);
        }
    })
})

app.post('/Certificate',(request,response)=>
{
    let userid=request.body.userid;
    let text=request.body.text;
    let imagefile=request.files.image;
    let filename=imagefile.name;
    let path=__dirname+'/upload/'+imagefile.name;

    let url='http://localhost:3000/upload';

    let sql='insert into certificate(userid,url,filename,text)values(?,?,?,?)';

    c.query(sql,[userid,url,filename,text],(error,result)=>{

    
       if(error)
       {
        let s={"status":"error"};
        response.send(s);
       }
       else{
        let s={"status":"uploaded"};
        response.send(s);
       }
    });
})

app.get('/View_cert/:userid',(request,response)=>{
    let {userid}=request.params;
    let sql='select * from certificate where userid=?';

    c.query(sql,[userid],(error,result)=>{
        if(error){
            response.send(error);
        }
        else{
            response.send(result);
        }
    });
})



app.get('/Get_username/:userid',(request,response)=>{
    let {userid}=request.params;
    let sql='select * from signup where userid=?';

    c.query(sql,[userid],(error,result)=>{
        if(error){
            response.send(error);
        }
        else{
            response.send(result);
        }
    });
})


app.get('/View_contact/:userid',(request,response)=>{
    let {userid}=request.params;
    let sql='select * from signup where id=?';

    c.query(sql,[userid],(error,result)=>{
        if(error){
            response.send(error);
        }
        else{
            response.send(result);
        }
    });
})



// app.get('/View_education/:userid',(request,response)=>{
//     let {userid}=request.params;
//     console.log(userid)
//     let sql='select * from education1 where userid=?';

//     c.query(sql,[userid],(error,result)=>{
//         if(error){
//             response.send(error);
//         }
//         else{
//             response.send(result);
//         }
//     });
// })



app.listen(3000, ()=>{console.log('Port number running in 3000')});







