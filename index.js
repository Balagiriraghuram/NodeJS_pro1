import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const db = new pg.Client({
    user : "postgres",
    host : "localhost",
    database : "world",
    password : "Balu@9129" ,
    port : 5432
});

db.connect();

const app = express();
const port = 3000 ;

app.use(bodyParser.urlencoded({ extended : true }));

app.get("/", (req , res)=>{
    res.render("index.ejs", { myName : "USER" });
})
app.get("/register", (req , res)=>{
    res.render("register.ejs");
})
app.get("/login", (req , res)=>{
    res.render("login.ejs");
})


app.post("/register",async (req , res)=>{
    const password = req.body.password ;
    const email = req.body.username ;

    try {
        const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
          email
        ]);
  
        console.log(checkResult.rows.length);
        if (checkResult.rows.length > 0) {
          res.send("Email already exists. Try logging in.");
        } else {
          const result = await db.query(
            "INSERT INTO users (email, password) VALUES ($1, $2)",
            [email, password]
          );
          console.log(result);
          res.render("secrets.ejs");
        }
      } catch (err) {
        console.log(err);
      }
});

app.post("/login",async (req , res)=>{
    const pass = req.body.password ;
    const email = req.body.username ;
    try {
      const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
        email
      ]);

     
      if (checkResult.rows.length > 0) {
          const user = checkResult.rows[0] ;
          const userPassword = user.password ;
          
          if(userPassword === pass){
            res.render("secrets.ejs");
          }else{
            res.send("Incorrect Password");
          }
      } else {
        res.send("User not Found");
      }
    } catch (err) {
      console.log(err);
    }});

app.listen( 4000 , ()=>{
    console.log("Server started");
});