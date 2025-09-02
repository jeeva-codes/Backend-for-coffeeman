require('dotenv').config()
const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')

const app=express()
app.use(express.json())

app.use(cors())


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB error:", err))

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

const UserModel = mongoose.model('User', UserSchema);

app.get('/',(req,res)=>{
    res.json('hey there')
})


app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await UserModel.create({ name, email, password });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
})

app.post('/login',async(req,res)=>{
       const {email,password}=req.body
       try{
       const user=await UserModel.findOne({email})
       if(!user){
        return res.status(400).json('No Records Found')
       }
        if(user.password!==password){
       return res.status(401).json('incorrect password')
       }
         res.status(200).json({ message: 'Login successful', user })
       
       }
        catch (err){
        return  res.status(500).json({ error: 'invalid', details: err.message })
       }
})

module.exports = app;