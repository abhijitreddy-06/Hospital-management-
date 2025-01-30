import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;
// Middleware
app.use(cors());
app.use(bodyParser.json());

// Get current directory path using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//Get Home page
app.get('/', (req, res) => {
    res.sendFile('/Hospital-management-/public/pages/index.html');
});


// Serve the appointments HTML page
app.get('/appointments', (req, res) => {
    res.sendFile('/Hospital-management-/public/pages/appointment.html');
});

app.get('/homepage', (req, res) => {
    res.sendFile(path.join(__dirname,'public','pages', 'homepage.html'));
  });
//Middleware
app.use(bodyParser.urlencoded({extended: true}));

//Static files are in public
app.use(express.static(path.join(__dirname, 'public')));

//Postgres connection
const db = new pg.Client({
    user: 'postgres',
    host: 'localhost',
    database: 'Hospital',
    password: 'Abhi.data',
    port: 5432,
  });
  

//connect to database
db.connect((err) => {
    if (err) {
        console.error('Failed to connect to PostgreSQL:', err.stack);
    } else {
        console.log('Connected to PostgreSQL');
    }
});

//connect to table Sign_up
db.query("SELECT * FROM sign_up", (err, result) => {
    if (err) {
        console.error('Error fetching sign up data:', err.stack);
    } else {
        console.log(' Connected to signup_data:');
    }
});
try {
//Post request for signup
app.post('/Signup', async(req,res) =>{
    const  email_id = req.body.email;
    const phone_no = req.body.phone;
    //check email from  database
    const select_email = "SELECT * FROM sign_up WHERE email = $1";
    const email_values =  await db.query(select_email,[email_id]);
    //check phone numberfrom database
    const select_phone = "SELECT * FROM sign_up WHERE phone_numbers = $1";
    const phone_values =  await db.query(select_phone,[phone_no]);
    //check if email or phone number already exists in database
    if(phone_values.rows.length>0 || email_values.rows.length>0){
         res.status(400).send('Accoont already exists');}
    else {
    const insertquery = 
    `INSERT INTO sign_up 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;
     db.query(insertquery, [
        req.body.fullName,
        req.body.email,
        req.body.phone,
        req.body.password,
        req.body.confirmPassword,
        req.body.gender,
        req.body.dob,
        req.body.address 
    ], (err) => {
        if (err) {
            console.error('Insert Error:', err.stack);
            res.status(500).send('Error inserting account data');
        } else {
            res.send('account data inserted successfully');
        }
    });}
});}
catch (err) {
    console.error('Error connecting to PostgreSQL:', err.stack);
}

//connect to table appointments
db.query("SELECT * FROM appointments", (err, result) => {
    if (err) {
        console.error('Error fetching appointment data:', err.stack);
    } else {
        console.log(' Connected to appointments:');
    }
});
// Define API route to fetch total appointments
app.get('/api/appointments', (req, res) => {
    db.query("SELECT COUNT(*) FROM appointments", (err, result) => {
      if (err) {
        console.error('Error fetching appointment count:', err.stack);
        res.status(500).json({ error: 'Database error' });
      } else {
        const totalAppointments = result.rows[0].count;
        console.log("Total Appointments:", totalAppointments);
        res.json({ totalAppointments }); // Send the data as JSON
      }
    });
  });

//Post request for appointment form
app.post('/appointments', async(req, res) => {
    try{
        //select email from appointment table
        const select_EMAIL = "SELECT * FROM appointments WHERE email_address = $1";
        const email_values =  await db.query(select_EMAIL,[req.body.email]);
        //select phone number from appointment table
        const select_PHONE = "SELECT * FROM appointments WHERE phone_numbers = $1";
        const phone_values =  await db.query(select_PHONE,[req.body.phone]);
        //check if email and phonne  already exists in appointment table
        if(email_values.rows.length>0 || phone_values.rows.length>0){
             return res.send(`  <script>
                alert('Appointment is already Scheduled');
                window.location.href="/appointments";
           </script>`);
           }
        else {
    const insertquery = `
        INSERT INTO appointments 
        VALUES ($1, $2, $3, $4, $5, $6)
    `;
    db.query(insertquery, [
        req.body.name,
        req.body.email,
        req.body.phone,
        req.body.date,
        req.body.doctor,
        req.body.message
    ], (err) => {
        if (err) {
            console.error('Insert Error:', err.stack);
            res.status(500).send('Error inserting appointment');
        } else {
            return res.send(`  <script>
                alert('Appointment is Scheduled');
                window.location.href="/appointments";
           </script>`);
        }
    });}}
    catch(err){
        console.error('Error connecting to PostgreSQL:', err.stack);
    }
});
app.post('/login', (req, res) => {
    const { username, email, phone } = req.body;

    if (!username) {
        return res.status(400).json({ error: "Username is required" });
    }
    if (!email) {
        return res.status(400).json({ error: "email is required" });
    }
    if (!phone) {
        return res.status(400).json({ error: "Phone number is required" });
    }

    // Simulate a successful login response
    res.json({ username, email: email || null,phone: phone || null }); // Send email only if it exists
});

//Admin login
app.post('/admin-login', (req, res) => {

    const Admin_user = "Abhi.admin";
    const Admin_pass = "Abhi.admin123";

    // Compare the incoming form data with the admin credentials
    if (req.body.username === Admin_user && req.body.password === Admin_pass ) {
        // Send the path to the admin page (for redirection on the client-side)
        res.sendFile('/Hospital-management-/public/pages/admin.html');
    } else {
        // Send the path to the homepage (for redirection on the client-side)
        return res.send(`  <script>
            alert('Wrong Password or username, Please check again');
            window.location.href="/admin-login";
       </script>`);
    }
});

  



  
