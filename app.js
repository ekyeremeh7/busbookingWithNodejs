const express = require('express');
const bodyParser = require("body-parser");
const ejs = require('ejs');
const mongoose = require('mongoose');
const _ = require("lodash");
const bcrypt = require("mongoose-bcrypt");
const Bcrypt = require("bcryptjs");
const https = require('https');
const fs = require('fs');
const key = fs.readFileSync('./localhost-key.pem');
const cert = fs.readFileSync('./localhost.pem');
const { auth } = require("express-openid-connect");

let global_name = "";
let global_signup_name = "";

const app = express();

// https.createServer({ key, cert }, app).listen('6000', () => {
//     console.log('Listening on https://localhost:6000');
// });

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));


//connecting/creating bus booking database
mongoose.connect("mongodb+srv://admin:admin@cluster0-x17jw.mongodb.net/busbooking", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//Create a database Schema
const userInfoSchema = new mongoose.Schema({
        fullName: {
            type: String,
            required: [true, 'Name is required']
        },
        userName: String,
        email: String,
        phone: Number,
        password: String
    })
    //compile our model
const UserInfo = mongoose.model("UserInfo", userInfoSchema);


//User authentication code

// const config = {
//     required: false,
//     auth0Logout: true,
//     baseURL: "https://localhost:6000",
//     issuerBaseURL: "https://dev-8c9qxw-t.auth0.com",
//     clientID: "eEWi27XtTHbv5gawm7Bu6EqRMd0gMdOf",
//     appSessionSecret: "a long, randomly-generated string stored in env"
// };

// auth router attaches /login, /logout, and /callback routes to the baseURL
// app.use(auth(config));

// req.isAuthenticated is provided from the auth router
// app.get("/", (req, res) => {
//     res.send(req.isAuthenticated() ? "Logged in" : "Logged out");
// });



//creating admin user
// const admin = new UserInfo({
//     fullName: "Emmmanuel Kwabena Kyeremeh",
//     userName: "admin",
//     email: "ekyeremeh7@gmail.com",
//     phone: +233558121540,
//     password: "admin"
// });
// admin.save();

//Bus Schema
const busSchema = new mongoose.Schema({
    busName: String,
    busId: Number,
    deptTime: String,
    arrTime: String,
    src: String,
    destination: String,
    fare: String
})

//model the Bus Schema
const Bus = new mongoose.model("bus", busSchema);

///creating documents of buses
// const bus1 = new Bus({
//     busName: "Ronnie Ablett",
//     busId: 32432959352,
//     deptTime: "11 March 2020",
//     arrTime: "11 March 2020",
//     src: "Kumasi",
//     destination: "Accra",
//     fare: "300 cedis"

// });
// bus1.save();

// // const fruit = new Fruit({
// //     name: "Apple",
// //     rating: 7,
// //     review: "Peaches are so yummy."
// // });

// // fruit.save();

// const banana = new Fruit({
//     name: "Banana",
//     rating: 7,
//     review: "Taste great."
// });

// banana.save();


// //Admin schema
// const adminSchema = new mongoose.Schema({
//     name: String,
//     password: String
// });

// //model the new mongoose model or retrieve the adminSchema
// const Admin = new mongoose.model("admin", adminSchema);

// //create a admin doc
// const user1 = new Admin({
//     name: "admin",
//     password: "admin"
// });
// user1.save();

// //create a admin doc
// const user2 = new Admin({
//     name: "emmanuel",
//     password: "kyeremeh"
// });
// user1.save();
// //Customer schema
// const customerSchema = new mongoose.Schema({
//         name: String,
//         password: String,
//         email: String,
//         phone: Number,
//         age: Number
//     })
//     //model the  customer Schema
// const Customer = new mongoose.model("customer", customerSchema);

// const customer1 = new Customer({
//     name: "Aziz",
//     password: "kindof",
//     email: "ekyeremeh7@gmail.com",
//     phone: "0558121540",
//     age: 13
// })
// customer1.save();

// //Seat schema
// const seatSchema = new mongoose.Schema({
//         bus_name: String,
//         class: String,
//         seats: String
//     })
//     //model the Seat Schema
// const Seat = new mongoose.model("seat", seatSchema);




app.get("/", function(req, res) {
    //res.send(req.isAuthenticated() ? "Logged in" : "Logged out");
    res.render("login");

});

app.post("/", async(req, res) => {
    const username = req.body.username;
    global_name = username;
    const userPassword = req.body.password;
    try {
        var user = await UserInfo.findOne({ userName: username }).exec();
        if (!user || !Bcrypt.compareSync(userPassword, user.password)) {
            res.render("sign_up");
            // return res.status(400).send({ message: "Either The username does not exist or The password is incorrect" });
        } else {
            res.render("home", {
                username: username
            });
        }
        // if () {
        //    // return res.status(400).send({ message: "The password is invalid" });
        // }
        // res.send({ message: "The username and password combination is correct!" });



    } catch (error) {
        res.status(500).send(error);
    }
});
// app.post("/", function(req, res) {
//     const username = req.body.username;
//     global_name = username;
//     const userPassword = req.body.password;

// try {
//     var user = await UserInfo.findOne({ userName: username }).exec();
//     if (!user) {
//         return response.status(400).send({ message: "The username does not exist" });
//     }
//     if (!Bcrypt.compareSync(userPassword, user.password)) {
//         return response.status(400).send({ message: "The password is invalid" });
//     }
//     response.send({ message: "The username and password combination is correct!" });
// } catch (error) {
//     response.status(500).send(error);
//}
// UserInfo.exists({ userName: username, password: userPassword }, function(err, userInfo) {
//     let result = userInfo;
//     // console.log(result);

//     if (result === true) {
//         res.render("home", {
//             username: username
//         });
//     } else {
//         res.render("sign_up");
//     }
// });


// let data = UserInfo.findOne({ userName: username, password: userPassword }, function(err, userInfo) {});

// if (data) {
//     res.render("home", {
//         username: username
//     });

// } else {

//     res.render("sign_up");
// }

// });


app.get("/signup_form", function(req, res) {
    res.render("signup_form");
});
app.post("/home", function(req, res) {
    const fullName = req.body.full_name;
    const signUpUsername = req.body.signUpUsername;
    const email = req.body.email;
    const prefix = req.body.prefix;
    const number = req.body.number;
    const phoneNumber = prefix + number;
    const userPassword = Bcrypt.hashSync(req.body.userPassword, 10);
    //console.log(userPassword);
    global_signup_name = signUpUsername;


    const userInfo = new UserInfo({
        fullName: fullName,
        userName: signUpUsername,
        email: email,
        phone: phoneNumber,
        password: userPassword
    });
    userInfo.save();

    UserInfo.findOne({ userName: signUpUsername }, function(err, result) {
        res.render("home", {
            username: signUpUsername

        });
    });

});


app.get("/home", function(req, res) {


    const username = global_name;
    const signup_username = global_signup_name;

    let noOfDocuments = UserInfo.countDocuments({}, function(err, count) {
        // console.log("There are %d documents ", count)
    });


    if (signup_username) {
        res.render("home", {
            username: signup_username,
            // customers: noOfDocuments,
        })
    } else if (username) {
        res.render("home", {
            username: username,
            // customers: noOfDocuments
        })
    }
})

app.get("/customers", function(req, res) {

    UserInfo.find({}, function(err, document) {
        console.log("Documents " + document);
        res.render("customers", {
            //documentsLength: noOfDocuments,
            userInfosDocument: document

        });
    })


});

app.get("/bookings", function(req, res) {
    res.render("bookings");
})

app.get("/buses", function(req, res) {
    res.render("buses");
})


app.get("/seats", function(req, res) {
    res.render("seats");
});

app.get("/availability", function(req, res) {
    res.render("availability");
});

app.get("/routes", function(req, res) {
    res.render("routes");
});

app.get("/reports", function(req, res) {
    res.render("reports");
});

app.listen(3000, function() {

    console.log("Server started successfully on Port 3000");
});