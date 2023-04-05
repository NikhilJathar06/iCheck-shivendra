const mongoose = require('mongoose');
const mongooseAcl = require('mongoose-acl')

const csvtojson = require('csvtojson');
const multer = require('multer');

const router = require('express').Router();
const mongodb = require('mongodb');
const User = require('../models/user');
const Company = require('../models/company');
const Vessel = require('../models/vessel');
const inspectionData = require('../models/inspectiondata');
const testData = require('../models/testData');
const UserProgress = require('../models/userProgress');
const Communicationlog = require('../models/communicationlog');
const Notification = require('../models/notification');
const trackprogress = require('../models/trackprogress')
const Rectification = require('../models/rectification')
const vesselInspectionData = require('../models/vesselInspectionData');
const companyNotiOptions = require('../models/companyNotiOptions');

const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const checkAuth = require('../middleware/check-auth');
const checkAdmin = require('../middleware/check-admin');

const path = require("path");



const nodemailer = require('nodemailer');
const user = require('../models/user');
const { error } = require('console');

const fs = require('fs');
const xlsx = require('xlsx');
const { async } = require('rxjs');


// NODEMAIL TRANSPORTER

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'testelementreenoreply@gmail.com',
        pass: 'aomqdufmgxltqdny'
    }
})

// Signup api
router.post('/signup', (req, res) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            return res.json({ success: false, message: "Hash Error!" })
        } else {
            const user = new User({
                role: req.body.role,
                name: req.body.name,
                email: req.body.email,
                companyName: req.body.companyName,
                phoneno: req.body.phoneno,
                password: hash
            })

            user.save()
                .then((_) => {
                    res.json({ success: true, message: "Account has been Created!" })
                })
                .catch((err) => {
                    if (err.code === 11000) {
                        return res.json({ success: false, message: "Email is already existing! " })
                    }
                    res.json({ success: false, message: "Authentication Failed" })
                })
        }
    });
})


// login api


router.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email) {
        return res.json({ success: false, message: "Email is required" })
    }
    if (!password) {
        return res.json({ success: false, message: "Password is required" })

    }
    User.findOne({ email }).exec().then(async (result) => {
        if (!result) {
            return res.json({ success: false, message: "User not found!" })
        }
        const user = result;
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
            // Check if the expiry date has passed
            const now = new Date();
            if (now > user.expiryDate) {
                return res.json({ success: false, message: "User's access expired" })
            }
            const payload = {
                userId: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                companyName: user.companyName,
                expiryDate: user.expiryDate // add expiryDate to the payload
            };
            const token = jwt.sign(payload, "webBatch");
            return res.json({
                success: true,
                token: token,
                role: user.role,
                companyName: user.companyName,
                message: "Login Successfull!"
            });
        } else {
            return res.json({ success: false, message: "Please Enter a correct Password" })
        }
    }).catch(err => {
        res.json({ success: false, message: "Authentication Failed!" })
    });
});

router.post('/forgotpassword', async (req, res) => {
    try {
        const email = req.body.email
        User.findOne({ email: email }).exec().then((user) => {
            if (!user) {
                return res.json({ success: false, message: "User not found!" })
            }
            // Generate OTP for the User
            const OTP = Math.floor(1000 + Math.random() * 9000);
            user.OTP = OTP;
            user.OTPExpires = Date.now() + 300000; //expires in 5 mins
            user.save().then(() => {
                // Send and email to the the user with OTP

                const mailOptions = {
                    to: user.email,
                    subject: 'OTP for password reset of iCheck',
                    text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account. 
                Your OTP is ${OTP}. Please use this OTP to reset your password. If you did not request this, please ignore this email and your password will remain unchanged.`
                };
                transporter.sendMail(mailOptions, (err) => {
                    if (err) {
                        return res.json({ success: false, message: err.message })
                    }
                    try {
                        return res.json({ success: true, message: "Email Send" })
                    }
                    catch (err) {
                        res.json(error)
                    }

                })
            })
        })
    }
    catch (error) {
        res.status(400).send({ succes: false, message: error.message })
    }
})

router.post('/sendOTP', async (req, res) => {
    try {
        const email = req.body.email
        User.findOne({ email: email }).exec().then((user) => {
            if (!user) {
                return res.json({ success: false, message: 'User not found' })
            }
            // Generate OTP for the user
            const OTP = Math.floor(1000 + Math.random() * 9000)
            user.OTP = OTP;
            user.OTPExpires = Date.now() + 300000; //Expires in 5 mins
            user.save().then(() => {
                // Send the email to the user with OTP
                const mailOptions = {
                    to: user.email,
                    subject: 'OTP for removing access',
                    text: `You are receiving this email you (or someone else) have requested to remove access of a company. 
                    Your OTP is ${OTP}.
                    Please use this OTP to remove access.
                    If you did not request this, Please ignore this message.`
                };
                transporter.sendMail(mailOptions, (err) => {
                    if (err) {
                        return res.json({ success: false, message: 'Failed to send email!' })
                    }
                    try {
                        return res.json({ success: true, message: 'Email Send' })
                    }
                    catch (err) {
                        res.json(error)
                    }
                })
            })
        })
    }
    catch (err) {
        res.status(400).send({ succes: false, message: error.message })
    }
})

router.post('/sendOTPGrantAccess', async (req, res) => {
    try {
        const email = req.body.email
        User.findOne({ email: email }).exec().then((user) => {
            if (!user) {
                return res.json({ success: false, message: 'User not found' })
            }
            // Generate OTP for the user
            const OTP = Math.floor(1000 + Math.random() * 9000)
            user.OTP = OTP;
            user.OTPExpires = Date.now() + 300000; //Expires in 5 mins
            user.save().then(() => {
                // Send the email to the user with OTP
                const mailOptions = {
                    to: user.email,
                    subject: 'OTP for granting access',
                    text: `You are receiving this email you (or someone else) have requested to grant access to a company. 
                    Your OTP is ${OTP}.
                    Please use this OTP to grant the access.
                    If you did not request this, Please ignore this message.`
                };
                transporter.sendMail(mailOptions, (err) => {
                    if (err) {
                        return res.json({ success: false, message: 'Failed to send email!' })
                    }
                    try {
                        return res.json({ success: true, message: 'Email Send' })
                    }
                    catch (err) {
                        res.json(error)
                    }
                })
            })
        })
    }
    catch (err) {
        res.status(400).send({ succes: false, message: error.message })
    }
})

router.post('/verifyotp', async (req, res) => {
    User.findOne({ email: req.body.email, OTP: req.body.OTP, OTPExpires: { $gt: Date.now() } }).exec()
        .then((user) => {
            if (user) {
                user.OTP = undefined
                user.OTPExpires = undefined
                user.save();
                return res.json({ success: true, message: "OTP verified" })

            }
            else {
                return res.json({ success: false, message: "Invalid or expired OTP" })
            }

        })
        .catch(err => {
            res.json({ success: false, message: "Error Occured" });
        })
})

router.post('/resetpassword', async (req, res) => {
    const email = req.body.email;
    User.findOne({ email: email }).exec().then((user) => {
        if (!user) {
            return res.json({ success: false, message: "User not found!" })
        }
        // Hash the new password
        bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
                return res.json({ success: false, message: "Error Occured!" });
            }
            // Update the User's password
            user.password = hash;
            user.OTP = undefined;

            user.OTPExpires = undefined;
            user.save().then(() => {
                return res.json({ success: true, message: 'Password reset successfull' })
            })
        })
    })
        .catch(err => {
            res.json({ success: false, message: "Error Occured" })
        })
})

// router.get('/getUser')
router.get('/getUser/:id', (req, res) => {
    User.findById(req.params.id).then(data => {
        if (!data) {
            res.status(404).send({ message: "Not found user with id" })
        }
        else {
            res.send(data)
        }
    }).catch(err => {
        res.status(500).send({ message: "Error retrieving user with id" })

    })
})

router.get('/getUserAll', async(req, res) => {
    User.find((error, data) => {
        if(error){
            console.log(error)
        }
        else{
            res.json(data);
        }
    })
})


router.get('/getCompaniesAll', async(req, res) =>{
    Company.find((error, data) =>{
        if(error){
            console.log(error)
        }
        else{
            res.json(data);
        }
    })

})

//dashboard api(get user)
router.get('/dashboard', (req, res) => {
    const userId = req.userData.userId;
    User.findById(userId).exec().then((result) => {
        res.json({ success: true, data: result })
    }).catch(err => {
        res.json({ success: false, message: "Server error" })
    })
})


//add company
router.post('/company', async (req, res) => {
    counter.findOneAndUpdate(
        { companyCode: "autoval" },
        { "$inc": { "companySeq": 1 } },
        { new: true }, (err, cd) => {
            let seqId;
            if (cd == null) {
                const newVal = new counter({
                    companyCode: "autoval", companySeq: 1
                })
                newVal.save()
                seqId = 1;
            } else {
                seqId = cd.companySeq
            }
            const startDate = req.body.companyStartDate;
            const durationinyears = req.body.companyDuration;
            const duration = durationinyears * 365;
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + duration);
            const company = new Company({
                companyCode: seqId,
                companyName: req.body.companyName,
                companyAddress1: req.body.companyAddress1,
                companyAddress2: req.body.companyAddress2,
                country: req.body.country,
                state: req.body.state,
                city: req.body.city,
                companyPostalCode: req.body.companyPostalCode,
                companyPersonInCharge: req.body.companyPersonInCharge,
                picemails: req.body.picemails,
                companyAccountHead: req.body.companyAccountHead,
                companyAccountTel: req.body.companyAccountTel,
                accEmails: req.body.accEmails,
                companyStartDate: req.body.companyStartDate,
                companyDuration: req.body.companyDuration,
                companyEndDate: endDate,
                companySubscriptionRate: req.body.companySubscriptionRate,
                companyNoOfShips: req.body.companyNoOfShips,
                companySubscriptionCurrency: req.body.companySubscriptionCurrency,
                isEnabled: true
            });




            company.save().then((_) => {
                res.json({ success: true, message: "Company has been created successfully!" })

            }).catch((err) => {
                res.json(err)
            })

        }
    )

})

//retrieve all comapnies OR retrieve and return a single user
router.get('/fetchcompanies', (req, res) => {

    if (req.query.id) {
        const id = req.query.id;

        Company.findById(id).then(data => {
            if (!data) {
                res.status(404).send({ message: "Not Found User with id " + id })
            } else {
                res.send(data)
            }
        })
            .catch(err => {
                res.status(500).send({ message: "Error retrieving user with id " + id })
            })
    } else {
        Company.find((err, val) => {
            if (err) {
                console.log(err)
            }
            else {
                res.json(val)
            }
        })
    }


})




//delete Companies
router.delete("/deletecompany/:id", async (req, res) => {
    try {
        const data = await Company;
        const result = await data.deleteOne({ _id: new mongodb.ObjectId(req.params.id) })
        res.send(result);
    }
    catch (err) {
        res.send(err)
    }

})


// Get Single Company For putting data into Edit Company Form
router.get('/fetchSingleCompany/:id', (req, res) => {
    Company.findById(req.params.id).then(data => {
        if (!data) {
            res.status(404).send({ message: "Not Found User with id " })
        } else {
            res.send(data)
        }
    })
        .catch(err => {
            res.status(500).send({ message: "Error retrieving user with id " })
        })
})

router.get('/fetchCompanyBycompanyName/:companyName', async (req, res) => {
    const company = await Company.findOne({
        companyName : req.params.companyName
    })

    if(!company){
        res.status(404).send({ message: "No company found " })
    }

    res.send(company)
})

//Edit Company
router.put('/editCompany/:id', (req, res) => {
    if (!req.body) {
        return res.status(400).send({ message: "Data to update cannot be empty" })
    }
    const id = req.params.id;
    Company.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            console.log(data)
            if (!data) {
                res.status(404).send({ message: `Cannot Update user with ${id}.Maybe User not found!` })
            } else {
                res.send(data)
            }
        })
        .catch(err => {
            res.status(500).send({ message: "Error Update user information" })
        })
})

// edit company by companyName
//Edit Company
router.put('/editCompanyByName/:companyName', (req, res) => {
    if (!req.body) {
        return res.status(400).send({ message: "Data to update cannot be empty" })
    }
    const companyName = req.params.companyName;
    Company.findOneAndUpdate({companyName: companyName}, req.body, { useFindAndModify: false })
        .then(data => {
            console.log(data)
            if (!data) {
                res.status(404).send({ message: `Cannot Update company with name ${companyName}. Maybe company not found!` })
            } else {
                res.send(data)
            }
        })
        .catch(err => {
            res.status(500).send({ message: "Error updating company information" })
        })
})


// ------------ VESSELS API ------------------------------//

// counter collection for incrementing ID
const counterSchema = new mongoose.Schema({
    vesselCode: {
        type: String
    },
    companyCode: {
        type: String
    },
    vesselSeq: {
        type: Number
    },
    companySeq: {
        type: Number
    }
})

const counter = mongoose.model("counter", counterSchema);

// create vessel
router.post('/vessel', (req, res) => {
    counter.findOneAndUpdate(
        { vesselCode: "autoval" },
        { "$inc": { "vesselSeq": 1 } },
        { new: true }, (err, cd) => {
            let seqId;
            if (cd == null) {
                const newVal = new counter({
                    vesselCode: "autoval", vesselSeq: 1
                })
                newVal.save()
                seqId = 0001;
            } else {
                seqId = cd.vesselSeq
            }
            const vessel = new Vessel({
                vesselCode: seqId,
                companyName: req.body.companyName,
                vesselName: req.body.vesselName,
                vesselImo: req.body.vesselImo,
                vesselPostOfRegistry: req.body.vesselPostOfRegistry,
                vesselCallSign: req.body.vesselCallSign,
                vesselGrossTonage: req.body.vesselGrossTonage,
                vesselSumerDeadweight: req.body.vesselSumerDeadweight,
                vesselLengthOverall: req.body.vesselLengthOverall,
                vesselBeam: req.body.vesselBeam,
                vesselDraught: req.body.vesselDraught,
                vesselYearOfBuilt: req.body.vesselYearOfBuilt,
                vesselBuilderYard: req.body.vesselBuilderYard,
                vesselPlaceOfBirth: req.body.vesselPlaceOfBirth,
                vesselClassificationSociety: req.body.vesselClassificationSociety,
                vesselMarineSuperintendent: req.body.vesselMarineSuperintendent,
                vesselTechnicalSuperintendent: req.body.vesselTechnicalSuperintendent
            });

            vessel.save().then((_) => {
                res.json({ success: true, message: "Vessel has been created!" })
            }).catch((err) => {
                res.json(err)
            })

        }
    )
})

// Fetch Vessels to put into list
router.get('/fetchvessels', (req, res) => {
    Vessel.find((err, val) => {
        if (err) {
            console.log(err)
        } else {
            res.json(val)
        }
    })
})

router.get('/fetchVesselsOfCompany/:companyName', async (req, res) => {
    const companyName = req.params.companyName;

    try {
        const vessels = await Vessel.find({ companyName: companyName })
        if (!vessels) return res.status(400).send({ message: 'No vessel for this company' })

        res.send(vessels)
    }
    catch (err) {
        res.status(500).send(err)

    }
})

router.get('/fetchVesselLogsOfCompany/:companyName', async (req, res) => {
    const companyName = req.params.companyName;

    try {
        const vessels = await Communicationlog.find({ companyName: companyName })
        if (!vessels) return res.status(400).send({ message: 'No vessel for this company' })
        res.send(vessels)
    }
    catch (err) {
        res.status(500).send(err)

    }
})

router.get('/fetchVesselInspectionData/:email/:checklistId', async (req, res) => {
    const email = req.params.email;
    const checklistId = req.params.checklistId;
    try{
        const data = await vesselInspectionData.find({
            email:email,
            checklistId:checklistId
        })

        if(!data){
            res.send({message: 'No checklist found with this email or checklistID'})
        }
        res.send(data)
    }
    catch(err){
        res.send(err)
    }
})





// delete vessel
// router.delete('/deletevessel/:id', async (req, res) => {
//     try{
//         console.log(req.params.id);
//         const data = await Vessel;
//         const result = await data.deleteOne({_id: new mongodb.ObjectId(req.params.id)})
//         res.send(result);
//     }
//     catch(err){
//         res.send(err)
//     }

// })


router.delete('/deletevessel/:id', async (req, res) => {
    try {
        console.log(req.params.id);
        const data = await Vessel;
        const result = await data.deleteOne({ _id: new mongodb.ObjectId(req.params.id) })
        res.send(result);
    }
    catch (err) {
        res.send(err)
    }

})

//get single vessel for putting data into edit vessel form
router.get('/fetchSingleVessel/:id', (req, res) => {
    Vessel.findById(req.params.id).then(data => {
        if (!data) {
            res.status(404).send({ message: "Not Found Vessel with id " + id })
        } else {
            res.send(data)
        }
    })
        .catch(err => {
            res.status(500).send({ message: "Error retrieving user with id " })
        })
})

//Edit Vessel
router.put('/editVessel/:id', (req, res) => {
    if (!req.body) {
        return res.status(400).send({ message: "Data to update cannot be empty" })
    }
    const id = req.params.id;
    Vessel.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({ message: `Cannot Update user with ${id}.Maybe User not found!` })
            } else {
                res.send(data)
            }
        })
        .catch(err => {
            res.status(500).send({ message: "Error Update user information" })
        })
})

// GET inspection data
router.get('/inspectiondata', (req, res) => {
    inspectionData.find((error, data) => {
        if (error) {
            console.log(error);
        } else {
            res.json(data);
        }
    });
});

router.get('/fetchInspectionOnQuestionNo/:questionNo', async (req, res) => {
    const data = await inspectionData.findOne({
        "Question No": req.params.questionNo
    })
    if (!data) {
        return res.status(400).send({ message: "data not found" })
    }
    res.send(data)
})

router.get('/fetchFirstQuestion', async (req, res) => {
    try {
        const firstQuestionData = await inspectionData.findOne().exec();
        res.send(firstQuestionData)
    }
    catch (err) {
        res.status(500).send('Server Error');
    }
})


// router.get('/postNextQuestion/:id', async (req, res) => {
//     let currentQuestion = req.params.id;
//     currentQuestion = currentQuestion.split(".");
//     nextQuestion = currentQuestion[0] +
//         "." +
//         currentQuestion[1] +
//         "." +
//         String(Number(currentQuestion[2]) + 1);
    
//     // First, check if there's a question with the next question number
//     await inspectionData.find({ "Question No": nextQuestion })
//         .then(async (data) => {
//             if (data.length) {
//                 // If there is a next question, send that data
//                 res.send(data);
//             }
//             else {
//                 // If there isn't a next question in this section
//                 // check if there's a next section
//                 let nextSection = currentQuestion[0] + "." + String(Number(currentQuestion[1]) + 1) + "." + "1";
//                 await inspectionData.find({ "Question No": nextSection })
//                     .then(async (data) => {
//                         if (data.length) {
//                             // If there is a next section, send the first question of that section
//                             res.send(data);
//                         } else {
//                             let nextChapter = String(Number(currentQuestion[0]) + 1) + "." + "1" + "." + "1";
//                             await inspectionData.find({ "Question No": nextChapter })
//                                 .then((data) => {
//                                     if (data.length) {
//                                         // If there is a next chapter, send the first question of that chapter
//                                         res.send(data);
//                                     }
//                                     else {
//                                         // If there's no next chapter, send a message indicating that there are no more questions
//                                         res.status(404).send({ message: "No more Questions" });
//                                     }
//                                 })
//                                 .catch((err) => {
//                                     res.status(500).send({ message: "Error retrieving" });
//                                 })
//                         }
//                     })
//                     .catch((err) => {
//                         res.status(500).send({ message: "Error retrieving" });
//                     })
//             }
//         })

// });

router.get('/postNextQuestion/:id/:checklistId', async (req, res) => {
    try {
        let currentQuestion = req.params.id;
        currentQuestion = currentQuestion.split(".");
        let nextQuestion = currentQuestion[0] + "." + currentQuestion[1] + "." + String(Number(currentQuestion[2]) + 1);

        // Get the question numbers from the vesselInspectionData collection
        const vesselData = await vesselInspectionData.findOne({ checklistId: req.params.checklistId });
        const questionNos = vesselData.questions.map(question => question.questionNo);

        // Find the index of the current question number
        const currentIndex = questionNos.findIndex(questionNo => questionNo === currentQuestion.join('.'));

        // Find the next question number
        const nextIndex = currentIndex + 1;
        if (nextIndex >= questionNos.length) {
            res.status(404).send({ message: "No more questions" });
            return;
        }
        const nextQuestionNo = questionNos[nextIndex].split(".");
        
        // Construct the next question number
        nextQuestion = nextQuestionNo[0] + "." + nextQuestionNo[1] + "." + nextQuestionNo[2];

        // Find the document with the next question number
        const nextQuestionDoc = await inspectionData.findOne({ "Question No": nextQuestion });
        if (!nextQuestionDoc) {
            res.status(404).send({ message: "No document found for the next question" });
            return;
        }

        res.json(nextQuestionDoc);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal server error" });
    }
});


router.post("/postPreviousQuestion/:checklistId", async (req, res) => {
    try {
      const currentQuestion = req.body.currentQuestion;
      const questionNoArr = currentQuestion.split(".");
      const chapter = questionNoArr[0];
      const section = questionNoArr[1];
      const questionNo = questionNoArr[2];
  
      const vesselData = await vesselInspectionData.findOne({ checklistId: req.params.checklistId });
      const questionNos = vesselData.questions.map(question => question.questionNo);
      const index = questionNos.indexOf(currentQuestion);
      if (index === -1) {
        return res.status(400).json({ message: "Cannot get previous question. Invalid question number." });
      }
  
      const prevQuestion = questionNos[index - 1];
      const prevQuestionDoc = await inspectionData.findOne({ "Question No": prevQuestion }).exec();
  
      if (!prevQuestionDoc) {
        return res.status(400).json({ message: "Cannot get previous question. Invalid question number." });
      }
  
      res.json(prevQuestionDoc);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal server error" });
    }
  });
  

router.put('/editContent/:currentQuestion', (req, res) => {
    inspectionData.findOneAndUpdate(
        { "Question No": req.params.currentQuestion },
        { $set: { "Question Description": req.body.questionDescription } },
        { new: true },
        (err, updatedQuestion) => {
            if (err) return res.status(500).send(err);
            return res.send(updatedQuestion)
        }
    )

})

router.put('/editGuidanceContent/:currentQuestion', (req, res) => {
    inspectionData.findOneAndUpdate(
        { "Question No": req.params.currentQuestion },
        { $set: { "Inspection Guidance": req.body.inspectionGuidance } },
        { new: true },
        (err, updatedQuestion) => {
            if (err) return res.status(500).send(err);
            return res.send(updatedQuestion)
        }
    )

})


router.put('/editActionsContent/:currentQuestion', (req, res) => {
    inspectionData.findOneAndUpdate(
        { "Question No": req.params.currentQuestion },
        { $set: { "Suggested Inspector Actions": req.body.inspectorActions } },
        { new: true },
        (err, updatedQuestion) => {
            if (err) return res.status(500).send(err);
            return res.send(updatedQuestion)
        }
    )

})


router.put('/editEvidenceContent/:currentQuestion', (req, res) => {
    inspectionData.findOneAndUpdate(
        { "Question No": req.params.currentQuestion },
        { $set: { "Expected Evidence": req.body.expectedEvidence } },
        { new: true },
        (err, updatedQuestion) => {
            if (err) return res.status(500).send(err);
            return res.send(updatedQuestion)
        }
    )

})


router.put('/editNegativeContent/:currentQuestion', (req, res) => {
    inspectionData.findOneAndUpdate(
        { "Question No": req.params.currentQuestion },
        { $set: { "Potential grounds for a Negative Observation": req.body.negativeObservation } },
        { new: true },
        (err, updatedQuestion) => {
            if (err) return res.status(500).send(err);
            return res.send(updatedQuestion)
        }
    )

})

router.put('/updateisCompleted/:currentQuestion', (req, res) => {
    inspectionData.findOneAndUpdate(
        { "Question No": req.params.currentQuestion },
        { $set: { isCompleted: true } },
        { new: true },
        (err, updatedQuestion) => {
            if (err) return res.status(500).send(err);
            return res.send(updatedQuestion)
        }
    )

})

// router.get('/isChapterCompleted/:chapter', (req, res) => {
//   const chapter = req.params.chapter;
//   inspectionData.find({ 'Question No': { $regex: `^${chapter}\\.` } }, (err, questions) => {
//     if (err) return res.status(500).send(err);
//     const isChapterCompleted = questions.every(question => question.isCompleted);
//     return res.send({ isChapterCompleted });
//   });
// });

// router.get('/isChapterCompleted/:chapter', (req, res) => {
//     const chapter = req.params.chapter;
//     UserProgress.find({ 'Question No': { $regex: `^${chapter}\\.` }, 'isCompleted': true }, (err, questions) => {
//       if (err) return res.status(500).send(err);
//       inspectionData.find({ 'Question No': { $regex: `^${chapter}\\.` } }, (err, allQuestions) => {
//         if (err) return res.status(500).send(err);
//         let completedQuestions = questions.length;
//         let totalQuestions = allQuestions.length;
//         let status;
//         if (completedQuestions === totalQuestions) {
//           status = 'completed';
//         } else if (completedQuestions > 0) {
//           status = 'inprogress';
//         } else {
//           status = 'nottouched';
//         }
//         return res.send({ status });
//       });
//     });
//   });

// router.get('/isChapterCompleted/:chapter/:email', async (req, res) => {
//     const chapter = req.params.chapter;
//     const userEmail = req.params.email;
//     let status
//     // Find the user progress for the given chapter and user email
//     const userProgress = await UserProgress.findOne({ 'Question No': { $regex: `^${chapter}\\.` }, email: userEmail });
//     if (!userProgress) return res.send({ status: 'nottouched' });


//     // Check how many questions are completed
//     const completedQuestions = userProgress.completedQuestions?.filter(q => q.startsWith(`${chapter}.`));
//     const totalQuestions = await inspectionData.countDocuments({ 'Question No': { $regex: `^${chapter}\\.` } });
//     // const status = (completedQuestions?.length === totalQuestions) ? 'completed' : 'inprogress';
//     if(completedQuestions === totalQuestions){
//         status = 'completed';
//     }
//     else{
//         status = 'inprogress';
//     }
//     return res.send({ status });
//   });


router.get('/isChapterCompleted/:chapter/:email/:checklistId', (req, res) => {
    const chapter = req.params.chapter;
    const userEmail = req.params.email;
    const checklistId = req.params.checklistId;

    vesselInspectionData.findOne({ email: userEmail, checklistId : checklistId }, (err, inspectionData) => {
        if (err) return res.status(500).send(err);

        if (!inspectionData) {
            // inspectionData is null or undefined
            return res.status(404).send("Inspection data not found");
          }

        const chapterQuestions = inspectionData.questions.filter(q => q.questionNo.startsWith(chapter + "."));
        const totalQuestions = chapterQuestions.length;

        UserProgress.countDocuments({ 'Question No': { $in: chapterQuestions.map(q => q.questionNo) }, email: userEmail, checklistId : checklistId }, (err, completedCount) => {
            if (err) return res.status(500).send(err);
            let status = 'nottouched';
            if (completedCount === totalQuestions) {
                status = 'completed';
            } else if (completedCount > 0) {
                status = 'inprogress';
            }
            return res.send({ status });
        });
    });
});



//   router.get('/isSectionCompleted/:chapter/:section', async (req, res) => {
//     const chapter = req.params.chapter;
//     const section = req.params.section;
//     await inspectionData.find({ 'Question No': { $regex: `^${chapter}\\.${section}\\.` } }).exec((err, questions) => {
//         if (err) return res.status(500).send(err);
//         let completedQuestions = 0;
//         questions.forEach(question => {
//             if (question.isCompleted) {
//                 completedQuestions++;
//             }
//         });
//         let status;
//         if (completedQuestions === questions.length) {
//             status = 'completed';
//         } else if (completedQuestions > 0) {
//             status = 'inprogress';
//         } else {
//             status = 'nottouched';
//         }
//         return res.send({ status });
//     });

// });

router.get('/isSectionCompleted/:chapter/:section/:email/:checklistId', async (req, res) => {
    const chapter = req.params.chapter;
    const section = req.params.section;
    const email = req.params.email;
    const checklistId = req.params.checklistId;

   
    vesselInspectionData.findOne({ email, checklistId }, (err, inspectionData) => {
        if (err) return res.status(500).send(err);
        if (!inspectionData) {
            // inspectionData is null or undefined
            return res.status(404).send("Inspection data not found");
          }
        const sectionQuestions = inspectionData.questions.filter(q => q.questionNo.startsWith(`${chapter}.${section}.`));
        const totalQuestions = sectionQuestions.length;

        UserProgress.countDocuments({ 'Question No': { $in: sectionQuestions.map(q => q.questionNo) }, email, checklistId }, (err, completedCount) => {
            if (err) return res.status(500).send(err);
            let status = 'nottouched';
            if (completedCount === totalQuestions) {
                status = 'completed';
            } else if (completedCount > 0) {
                status = 'inprogress';
            }
            return res.send({ status });
        });
    });
});


// router.get('/isSectionCompleted/:chapter/:section/:email', async (req, res) => {
//     const chapter = req.params.chapter;
//     const section = req.params.section;
//     const email = req.params.email;
//     try {
//         const userProgress = await UserProgress.findOne({ email: email });
//         if (!userProgress) {
//             return res.status(404).send({ error: 'User progress not found' });
//         }

//         const completedQuestions = userProgress.completedQuestions?.filter(q => q.startsWith(`${chapter}.${section}.`));
//         if (!completedQuestions || completedQuestions.length === 0) {
//             return res.send({ status: 'nottouched' });
//         }

//         const allQuestions = await inspectionData.find({ 'Question No': { $regex: `^${chapter}\\.${section}\\.` } });
//         if (allQuestions.length === completedQuestions.length) {
//             return res.send({ status: 'completed' });
//         } else {
//             return res.send({ status: 'inprogress' });
//         }
//     } catch (error) {
//         console.error(error);
//         return res.status(500).send({ error: 'Server error' });
//     }
// });



// router.post('/userprogress', async (req, res) => {
//     const progress = new UserProgress({
//         nameOfVessel: req.body.nameOfVessel,
//         email: req.body.email,
//         Chapter: req.body.Chapter,
//         "Section Name": req.body["Section Name"],
//         "Question No": req.body["Question No"],
//         checkedValue: req.body.checkedValue,
//         Remarks: req.body.Remarks,
//         Attachment: req.body.Attachment,
//         communicationLog: req.body.communicationLog
//     });
//     try {
//         const existingProgress = await UserProgress.findOne({
//             email: req.body.email,
//             "Question No": req.body["Question No"]
//         });
//         if (existingProgress) {
//             existingProgress.set({
//                 nameOfVessel: req.body.nameOfVessel,
//                 Chapter: req.body.Chapter,
//                 "Section Name": req.body["Section Name"],
//                 checkedValue: req.body.checkedValue,
//                 Remarks: req.body.Remarks,
//                 Attachment: req.body.Attachment,
//                 communicationLog: req.body.communicationLog
//             });
//             await existingProgress.save();
//             res.send(existingProgress);
//         } else {
//             await progress.save();
//             res.send(progress);
//         }
//     } catch (err) {
//         res.status(500).send(err);
//     }
// });


router.post('/userprogress', async (req, res) => {
    const {
        nameOfVessel,
        email,
        Chapter,
        checklistId,
        "Section Name": sectionName,
        "Question No": questionNo,
        checkedValue,
        Remarks,
        communicationLog,
        attachments
    } = req.body;
    if (!attachments) {
        res.status(400).send("No attachment found in the request.");
        console.log("No attachment found in the request.");
        return;
    }
    try {
        const existingProgress = await UserProgress.findOne({
            email,
            "Question No": req.body["Question No"]
        });
        if (existingProgress) {
            existingProgress.set({
                nameOfVessel,
                Chapter,
                checklistId,
                'Section Name': sectionName,
                checkedValue,
                Remarks,
                attachmentDetails: attachments.map((attachment) => ({
                    data: attachment.data,
                    fileName: attachment.fileName,
                    fileSize: attachment.fileSize,
                })),
                communicationLog,
            });
            await existingProgress.save();
            res.send(existingProgress);
        } else {
            const progress = new UserProgress({
                nameOfVessel,
                email,
                Chapter,
                checklistId,
                'Section Name': sectionName,
                'Question No': questionNo,
                checkedValue,
                Remarks,
                attachmentDetails: attachments.map((attachment) => ({
                    data: attachment.data,
                    fileName: attachment.fileName,
                    fileSize: attachment.fileSize,
                })),
                communicationLog,
            });
            await progress.save();
            res.send(progress);
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get('/getCountUserProgresses', async (req, res) => {
    try {
        const count = await UserProgress.countDocuments();
        res.send({ count });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

router.get('/getProgressCollection/:email', async (req, res) => {
    try {
        const userProgress = await UserProgress.find({ email:req.params.email })
        res.json(userProgress);
    }
    catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

router.get('/getUserProgress/:email/:currentQuestion/:checklistId', async (req, res) => {
    const email = req.params.email;
    const currentQuestion = req.params.currentQuestion;
    const checklistId = req.params.checklistId;
    try {

        const userProgress = await UserProgress.findOne({ email: email, checklistId: checklistId });
        if (!userProgress) return res.status(400).send({ message: "No user Found" })

        const progress = await UserProgress.findOne({
            email: email,
            "Question No": currentQuestion,
            checklistId : checklistId
        });

        if (!progress) {
            return res.status(400).send({ message: "Question not found" })
        }

        const inspectiondata = await inspectionData.findOne({
            "Question No": currentQuestion
        });
        if (!inspectiondata) {
            return res.status(400).send({ message: "Question Data not found" })

        }
        res.send({ progress, inspectiondata })
    }
    catch (err) {
        res.status(500).send(err)
    }
})


// router.post('/communicationlog', async (req, res) => {

//     const communicationLog = new Communicationlog({
//         email: req.body.email,
//         role: req.body.role,
//         name: req.body.name,
//         companyName: req.body.companyName,
//         Chapter: req.body.Chapter,
//         "Section Name": req.body["Section Name"],
//         "Question No": req.body["Question No"],
//         chat: req.body.chat,
//         // isRead: true,
//         timestamp: new Date()
//     });
//     await communicationLog.save().then((_) => {
//         res.json({ sucess: true, message: "Communication log Saved successfully" })
//     }).catch((err) => {
//         res.json(err)
//     })
// })

router.post("/communicationlog", async (req, res) => {
    const {
      email,
      role,
      name,
      companyName,
      Chapter,
      "Section Name": sectionName,
      "Question No": questionNo,
      chat,
      checklistId
    } = req.body;
  
    const filter = { email, Chapter, checklistId, "Section Name": sectionName, "Question No": questionNo };
    const update = {
      $push: {
        chats: {
          message: chat,
          role: role,
        }
      },
      $setOnInsert: {
        email,
        name,
        companyName,
        Chapter,
        checklistId,
        "Section Name": sectionName,
        "Question No": questionNo,
        timestamp: new Date()
      }
    };
    const options = { upsert: true, new: true };
  
    await Communicationlog.findOneAndUpdate(filter, update, options)
      .then((doc) => {
        console.log(doc)
        res.json({ success: true, message: "Communication log saved successfully", data: doc });
      })
      .catch((err) => {
        console.error(err);
        res.json({ success: false, message: "Failed to save communication log" });
      });
  });
  

router.get('/fetchCommunicationLog/:email/:currentQuestion', async (req, res) => {
    const email = req.params.email;
    const currentQuestion = req.params.currentQuestion;

    try {
        const communicationlog = await Communicationlog.find({ email: email });
        if (!communicationlog) return res.status(400).send({ message: 'No communication log found for this user' })

        const communicationLog = await Communicationlog.find({
            email: email,
            "Question No": currentQuestion
        });

        if (!communicationLog) {
            return res.status(400).send({ message: "Question not found" })
        }
        res.send(communicationLog)
    }
    catch (err) {
        res.status(500).send(err)
    }
})


router.get('/fetchVesselLogs/:companyName/:name/:checklistId', async (req, res) => {
    const companyName = req.params.companyName;
    const vesselName = req.params.name;
    const checklistId = req.params.checklistId;

    try {
        const communicationlog = await Communicationlog.find({ companyName: companyName });
        if (!communicationlog) return res.status(400).send({ message: 'No communication log found for this user' })

        const communicationLog = await Communicationlog.find({
            companyName: companyName,
            name: vesselName,
            checklistId :checklistId
        }).sort({ timestamp: 1 });;

        if (!communicationLog) {
            return res.status(400).send({ message: "No communication log found for this vessel" })
        }
        const chatLogs = communicationLog.map((log) => ({
            message: log.chat,
            timestamp: log.timestamp,
            role: log.role,
            questionNo: log['Question No'],
            isRead: log.isRead,
            vesselName:log.name,
            checklistId: log.checklistId
        }));
        res.send(chatLogs)
    }
    catch (err) {
        res.status(500).send(err)
    }
})

router.get('/fetchAllVesselLogsOfCompany/:companyName/:name', async (req, res) => {
    const companyName = req.params.companyName;
    const vesselName = req.params.name;

    try {
        const communicationlog = await Communicationlog.find({ companyName: companyName });
        if (!communicationlog) return res.status(400).send({ message: 'No communication log found for this user' })

        const communicationLog = await Communicationlog.find({
            companyName: companyName,
            name: vesselName,
        }).sort({ timestamp: 1 });;

        if (!communicationLog) {
            return res.status(400).send({ message: "No communication log found for this vessel" })
        }
        const chatLogs = communicationLog.map((log) => ({
            message: log.chat,
            timestamp: log.timestamp,
            role: log.role,
            questionNo: log['Question No'],
            isRead: log.isRead,
            vesselName:log.name,
            checklistId: log.checklistId
        }));
        res.send(chatLogs)
    }
    catch (err) {
        res.status(500).send(err)
    }
})


// router.get('/fetchVesselLogsOfCompany/:companyName/:name', async (req, res) => {
//     const companyName = req.params.companyName;
//     const vesselName = req.params.name;

//     try {
//         const communicationlog = await Communicationlog.find({ companyName: companyName });
//         if (!communicationlog) return res.status(400).send({ message: 'No communication log found for this user' })

//         const communicationLog = await Communicationlog.find({
//             companyName: companyName,
//             name: vesselName
//         }).sort({ timestamp: 1 });;

//         if (!communicationLog) {
//             return res.status(400).send({ message: "No communication log found for this vessel" })
//         }
//         const chatLogs = communicationLog.map((log) => ({
//             message: log.chat,
//             timestamp: log.timestamp,
//             role: log.role,
//             questionNo: log['Question No'],
//             isRead: log.isRead
//         }));
//         res.send(chatLogs)
//     }
//     catch (err) {
//         res.status(500).send(err)
//     }
// })

router.get('/fetchVesselLogsOfQuestionNo/:companyName/:name/:questionNo/:checklistId', async (req, res) => {
    const companyName = req.params.companyName;
    const vesselName = req.params.name;
    const questionNo = req.params.questionNo;
    const checklistId = req.params.checklistId;

    try {
        const communicationlog = await Communicationlog.find({ companyName: companyName });
        if (!communicationlog) return res.status(400).send({ message: 'No communication log found for this user' })

        const communicationLog = await Communicationlog.find({
            companyName: companyName,
            name: vesselName,
            checklistId: checklistId,
            "Question No": questionNo,
        }).sort({ timestamp: 1 });;

        if (!communicationLog) {
            return res.status(400).send({ message: "No communication log found for this vessel" })
        }

        communicationLog[0].chats.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        res.send(communicationLog);
    }
    catch (err) {
        res.status(500).send(err)
    }
})

router.get('/getUnReadChats/:companyName', async (req, res) => {
    const companyName = req.params.companyName;
    await Communicationlog.find({ companyName: companyName, isRead: false })
        .then((chats) => {
            res.send(chats)
        })
        .catch((err) => {
            res.status(500).send('Error fetching communication logs');

        })
})

router.get('/updateisRead/:companyName/:name/:questionNo/:checklistId', async (req, res) => {
    const companyName = req.params.companyName;
    const vesselName = req.params.name;
    const questionNo = req.params.questionNo;
    const checklistId = req.params.checklistId;

    try {
        const communicationlog = await Communicationlog.find({ companyName: companyName });
        if (!communicationlog) return res.status(400).send({ message: 'No communication log found for this user' })

        const communicationLog = await Communicationlog.findOneAndUpdate({
            companyName: companyName,
            name: vesselName,
            checklistId: checklistId,
            "Question No": questionNo,
            isRead: false // Update only if the isRead value is false
        }, {
            $set: { isRead: true } // Set the isRead value to true
        }, { new: true });

        if (!communicationLog) {
            return res.status(400).send({ message: "No communication log found for this vessel" })
        }
        const updatedChatLog = {
            message: communicationLog.chat,
            timestamp: communicationLog.timestamp,
            role: communicationLog.role,
            questionNo: communicationLog['Question No'],
            isRead: communicationLog.isRead
        };
        res.send(updatedChatLog);
    }
    catch (err) {
        res.status(500).send(err)
    }
})



router.post('/trackprogress', async (req, res) => {
    const progress = new trackprogress({
        email: req.body.email,
        Chapter: req.body.Chapter,
        Chapter: req.body.Chapter,
        checklistId: req.body.checklistId,
        "Section Name": req.body["Section Name"],
        "Question No": req.body["Question No"],
    });

    const existingTrackProgress = await trackprogress.findOne({
        checklistId: req.body.checklistId
    });
    if (existingTrackProgress) {
        existingTrackProgress.set({
            Chapter: req.body.Chapter,
            checklistId: req.body.checklistId,
            "Section Name": req.body["Section Name"],
            "Question No": req.body["Question No"],
            "Question Description": req.body["Question Description"],
            "Inspection Guidance": req.body["Inspection Guidance"],
            "Suggested Inspector Actions": req.body["Suggested Inspector Actions"],
            "Expected Evidence": req.body["Expected Evidence"],
            "Potential grounds for a Negative Observation": req.body["Potential grounds for a Negative Observation"],
        });
        await existingTrackProgress.save();
        res.send(existingTrackProgress);
    }
    else {
        await progress.save();
        res.send(progress)
    }

})

router.get('/getNotSatisfactory/:email/:checklistId', async (req, res) => {
    const email = req.params.email;
    const checklistId = req.params.checklistId;
    try {
        const data = await Rectification.find({ email: email, checklistId: checklistId })
        if (!data) return res.status(400).send({ message: 'No Not Satisfactory logs for this user or checklistId' })

        res.send(data)
    }
    catch (err) {
        res.status(500).send(err)
    }
})

router.get('/getNotSatisfactoryByName/:nameOfVessel', async (req, res) => {
    const nameOfVessel = req.params.nameOfVessel;
    try {
        const data = await UserProgress.find({ nameOfVessel: nameOfVessel, checkedValue: 'not-satisfactory' })
        if (!data) return res.status(400).send({ message: 'No Not Satisfactory logs for this user' })

        res.send(data)
    }
    catch (err) {
        res.status(500).send(err)
    }
})

router.get('/getAllNotSatisfactory', async (req, res) => {
    try {
        const data = await UserProgress.find({ checkedValue: 'not-satisfactory' })
        if (!data) return res.status(400).send({ message: 'No Not Satisfactory logs' })

        res.send(data)
    }
    catch (err) {
        res.status(500).send(err)
    }
})

router.get('/getNotSatisfactoryByQuestion/:email/:questionNo', async (req, res) => {
    const email = req.params.email;
    const questionNo = req.params.questionNo;
    try {
        const data = await UserProgress.find({ email: email, 'Question No': questionNo, checkedValue: 'not-satisfactory' })
        if (!data) return res.status(400).send({ message: 'No Not Satisfactory logs for this user' })
        res.send(data)
    }
    catch (err) {
        res.status(500).send(err)
    }

})



// router.post('/trackprogress', async (req, res) => {
//     const progress = new trackprogress({
//         email: req.body.email,
//         Chapter: req.body.Chapter,
//         "Section Name": req.body["Section Name"],
//         "Question No": req.body["Question No"],
//     });

//     const existingTrackProgress = await trackprogress.findOne({
//         email: req.body.email
//     });
//     if(existingTrackProgress){
//         const [existingChapter, existingSection, existingQuestion] = existingTrackProgress["Question No"].split('.');
//         const [newChapter, newSection, newQuestion] = req.body["Question No"].split('.');
//         if (newChapter > existingChapter || (newChapter === existingChapter && newSection > existingSection) || (newChapter === existingChapter && newSection === existingSection && newQuestion > existingQuestion)) {
//             existingTrackProgress.set({
//                 Chapter: req.body.Chapter,
//                 "Section Name": req.body["Section Name"],
//                 "Question No": req.body["Question No"],
//             });
//             await existingTrackProgress.save();
//             res.send(existingTrackProgress);
//         } else {
//             res.status(400).send({ message: "Can't track progress for previous question" });
//         }
//     }
//     else{
//         // Create a new record
//         await progress.save();
//         res.send(progress)
//     }
// });



router.get('/getTrackProgress/:email/:checklistId', async (req, res) => {
    const email = req.params.email;
    const checklistId = req.params.checklistId;
    try {
        const progress = await trackprogress.find({
            email: email,
            checklistId: checklistId
        });
        if (!progress) {
            return res.status(400).send({ message: "No user Found" })
        }

        const questionNo = progress[0]["Question No"];
        const inspectiondata = await inspectionData.findOne({
            "Question No": questionNo
        }).exec();
        if (!inspectiondata) {
            return res.status(400).send({ message: "No inspection data found for this question" })
        }
        res.send(inspectiondata)
    }
    catch (err) {
        res.status(500).send(err);
    }
})



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
})

const upload = multer({
    storage,
})



// USING RIGHTNOW
router.post("/uploadall", upload.single("csvFile"), async (req, res) => {
    let jsonArray;
    if (req.file.mimetype === 'application/vnd.ms-excel' || req.file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const csv = xlsx.utils.sheet_to_csv(sheet);
        const csvFile = 'temp.csv';
        fs.writeFileSync(csvFile, csv);
        jsonArray = await csvtojson().fromFile(csvFile);
    } else {
        jsonArray = await csvtojson().fromFile(req.file.path);
    }

    jsonArray.forEach((data) => {
        data.checkListName = req.body.checkListName;
    });
    inspectionData.insertMany(jsonArray, (err, response) => {
        if (err) {
            return res.status(500).json(err);
        }
        return res.json("Added Successfully!");
    });
});

router.put('/update/:id', (req, res) => {
    const id = req.params.id;
    const update = req.body;
    inspectionData.findByIdAndUpdate(id, update, {
        $set: {
            updated_at: Date.now().valueOf()
        }
    }, (err, doc) => {
        if (err) return res.status(500).send(err);
        return res.status(200).send(doc);
    });
});

router.post('/addcsv', upload.single('file'), async (req, res) => {
    console.log(req.files)
    if (!req.files) {
        return res.status(400).send('No files were uploaded.');
    }
    const file = req.files.file; // assuming the name of the file input field is "file"
    const filePath = "uploads/";
    file.mv(filePath, function (err) {
        if (err) {
            return res.status(500).send(err);
        }
        csvtojson()
            .fromFile(filePath)
            .then(csvData => {
                console.log(csvData)
                testData.insertMany(csvData)
                    .then(function () {
                        console.log('Data Inserted'); //success
                        res.json({ success: 'true', message: 'success' });
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            })
    })

})




router.post("/uploadcsv", upload.single('file'), async (req, res) => {
    try {
        console.log(req.file);
        console.log(req.file.buffer);

        fs.writeFile(path.join(__dirname, '../', 'uploads', req.file.originalname), req.file.buffer, (err) => {
            if (err) {
                res.status(500).json({ error: err })
            }
            res.status(200).json({ message: "File uploaded successfully" });
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err });
    }
})


router.post('/uploadXL', upload.single('file'), (req, res) => {
    console.log(req.file.filename)
    importExcelDataToJson(path.join('uploads/Final.xlsx'));
    inspectionData.insertMany(excelData.Final.then(() => {
        console.log("data inserted")
        res.json({ message: "Data Inserted" })
    })

    )
    res.json({
        message: "File uploaded successfully"
    });
})

router.post('/rectification',  async (req, res) => {
    try {
        
        const reasponseFindings =  req.body.reasponseFindings;
        const reasponseActionTaken = req.body.reasponseActionTaken;
        const reasponseCorrectiveAction =  req.body.reasponseCorrectiveAction;
        const reasponseRootCauses = req.body.reasponseRootCauses;
        const reasponsePreventiveAction = req.body.reasponsePreventiveAction;
        const reasponseDateOfCompletion = req.body.reasponseDateOfCompletion;
        const ObservationValue =  req.body.ObservationValue;
        const checklistId =  req.body.checklistId;
        const {
            email,
            name,
            companyName,
            questionNo,
            attachments
        } = req.body

        const filter = { email: email, questionNo: questionNo, name: name  }
        const update = {
            $push: {
                attachmentDetails: attachments.map((attachment) => ({
                    data: attachment.data,
                    fileName: attachment.fileName,
                    fileSize: attachment.fileSize,
                }))
            },
            $set : {
                checklistId,
                email,
                name,
                companyName,
                questionNo,
                reasponseFindings,
                reasponseActionTaken,
                reasponseCorrectiveAction,
                reasponseRootCauses,
                reasponsePreventiveAction,
                reasponseDateOfCompletion,
                ObservationValue
            }
        }

        const options = {upsert: true, new: true}
        const rectification = await Rectification.findOneAndUpdate(filter, update, options);

        res.send(rectification);


    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

router.get('/fetchRectificationData/:email/:questionNo/:checklistId', async (req, res) => {
    const email = req.params.email;
    const questionNo = req.params.questionNo;
    const checklistId = req.params.checklistId;

    const rectificationData = await Rectification.find({
        email: email,
        questionNo : questionNo,
        checklistId: checklistId
    })
    if(!rectificationData){
        return res.status(400).send({ message: "data not found" })
    }
    res.send(rectificationData)

})


router.get('/fetchRectificationDataByEmail/:email/:checklistId', async (req, res) => {
    const email = req.params.email;
    const checklistId = req.params.checklistId;

    const rectificationData = await Rectification.find({
        email: email,
        checklistId: checklistId,
    })
    if(!rectificationData){
        return res.status(400).send({ message: "data not found" })
    }
    res.send(rectificationData)

})


router.get('/fetchRectificationDataByName/:name', async (req, res) => {
    const name = req.params.name;

    const rectificationData = await Rectification.find({
        name: name,
    })
    if(!rectificationData){
        return res.status(400).send({ message: "data not found" })
    }
    res.send(rectificationData)

})

router.get('/fetchRectiAttachments/:email/:questionNo', async (req, res) => {
    const email = req.params.email;
    const questionNo = req.params.questionNo;
    
    try{
        const rectification = await Rectification.findOne({ email, questionNo });
    if (!rectification) {
      return res.status(404).json({ message: 'Rectification not found' });
    }

    const attachments = rectification.attachments.map(attachment => ({
        url: `/uploads/${attachment.fileName}`, // construct the URL of the attachment
        name: attachment.fileName,
        size: attachment.size,
      }));

      return res.json(attachments);

    }
    catch(err){
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
})

router.get('/getLatestDueDate/:companyName', async (req, res) => {
    try{
        const data = await Rectification.findOne({
            companyName: req.params.companyName
        })
        .sort({
            reasponseDateOfCompletion: 1
        })
        .exec();

        res.send(data)
    }
    catch(err){
        console.error(err)
        res.status(500).send('Server error');
    }
})


router.post('/createVesselInspection', async (req, res) => {
    const count = await vesselInspectionData.countDocuments({});
    const checklistId = `000${count + 1}`.slice(-4);

    // Loop through each question in the request body
    const questions = await Promise.all(req.body.questions.map(async (question) => {
        const questionData = await inspectionData.findOne({ "Question No": question.questionNo });
        if (questionData) {
            return {
                ...question,
                checkListName: questionData.checkListName,
                "Question Description": questionData["Question Description"],
                "Inspection Guidance": questionData["Inspection Guidance"],
                "Suggested Inspector Actions": questionData["Suggested Inspector Actions"],
                "Expected Evidence": questionData["Expected Evidence"],
                "Potential grounds for a Negative Observation": questionData["Potential grounds for a Negative Observation"],
                ISM: questionData.ISM,
                TMSA: questionData.TMSA,
                Risk: questionData.Risk,
            };
        } else {
            return question;
        }
    }));

    const data = new vesselInspectionData({
        checklistId,
        vesselName: req.body.vesselName,
        email: req.body.email,
        companyName: req.body.companyName,
        dateOfInspection: req.body.dateOfInspection,
        placeOfInspection: req.body.placeOfInspection,
        inspectornames: req.body.inspectornames,
        checkListRemark: req.body.checkListRemark,
        checkListName: req.body.checkListName,
        questions,
    });

    data.save().then((_) => {
        res.json({ success: true, message: "Data has been created successfully!" })
    }).catch((err) => {
        res.json(err)
    })
})


router.put('/editVesselInspection/:checklistId', async (req, res) => {
    if(!req.body){
        return res.status(400).send({ message: "Data to update cannot be empty" })
    }
    const checklistId = req.params.checklistId;
    vesselInspectionData.findOneAndUpdate({checklistId : checklistId}, req.body, { useFindAndModify: false })
        .then(data => {
            if(!data){
                res.status(404).send({ message: `Cannot Update checkList with ${checklistId}.Maybe checkList not found!` })
            }
            else{
                res.send(data)
            }
        })
        .catch(err => {
            res.status(500).send({ message: "Error Update checklist information" })

        })
})

router.get('/getInspectionDataBySelectedQuestions/:checklistId', async (req, res) => {
    const checklistId = req.params.checklistId;
    try {

    // Fetch the document from the inspectionData collection where the checklistId matches
    const checklistdata = await vesselInspectionData.findOne({ checklistId: checklistId }).exec();

     // Fetch all the questionNos from the fetched document
    const questionNos = checklistdata.questions.map(q => q.questionNo);
    
      // Fetch all the documents from the inspectionData collection where the Question No field matches any of the questionNos
      const data = await inspectionData.find({ 'Question No': { $in: questionNos } }).exec();
  
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal server error" });
    }
  });


  router.get('/updateInspectionProgressPercent/:email/:checklistId', async (req, res) => {
    const checklistId = req.params.checklistId;
    const checklistdata = await vesselInspectionData.findOne({ checklistId: checklistId }).exec();
    const questionNos = checklistdata.questions.map(q => q.questionNo);

    const totalQuestionsLength = questionNos.length
    
    const userProgress = await UserProgress.find({ email:req.params.email, checklistId: checklistId  })

    const finishedQuestionLength = userProgress.length

    const progress = (finishedQuestionLength / totalQuestionsLength) * 100
    // res.json(progress)

    const updateProgress = {
        progress : progress
    }
        await vesselInspectionData.findOneAndUpdate({ checklistId : checklistId },updateProgress, {new: true} )
            .then(data => {
                if (!data) {
                    res.status(404).send({ message: `Cannot Update` })
                } else {
                    res.send(data)
                }
            })
            .catch(err => {
                res.send(err)
            })
            

  })
  

router.get('/fetchVesselInspection/:email/:vesselName', async (req, res) => {
    const email = req.params.email;
    const vesselName = req.params.vesselName;

    try{
        const data = await vesselInspectionData.find({
            email:email,
            vesselName: vesselName,
        })
        if(!data){
            return res.status(404).json({ message: 'Data not found' });
        }
        else{
            res.send(data)
        }
    }
    catch(err){
        return res.status(500).json({ message: 'Server error' });
    }

})




router.get('/fetchVesselInspectionByCompany/:companyName', async (req, res) => {
    const companyName = req.params.companyName;
    

    try{
        const data = await vesselInspectionData.find({
            companyName:companyName,
           
        })
        if(!data){
            return res.status(404).json({ message: 'Data not found' });
        }
        else{
            res.send(data)
        }
    }
    catch(err){
        return res.status(500).json({ message: 'Server error' });
    }

})

// router.get('/fetchVesselInspection/:email/:vesselName/:checklistId', async (req, res) => {
//     const email = req.params.email;
//     const vesselName = req.params.vesselName;
//     const checklistId = req.params.checklistId;

//     try{
//         const data = await vesselInspectionData.find({
//             email:email,
//             vesselName: vesselName,
//             checklistId: checklistId
//         })
//         if(!data){
//             return res.status(404).json({ message: 'Data not found' });
//         }
//         else{
//             res.send(data)
//         }
//     }
//     catch(err){
//         return res.status(500).json({ message: 'Server error' });
//     }

// })


router.get('/fetchInspectionOnID/:checklistId', async (req, res) => {
    const checklistId = req.params.checklistId;
    try{
        const data = await vesselInspectionData.find({
            checklistId : checklistId
        })
        if(!data) {
            return res.status(404).json({ message: 'Data not found' });
       }
       res.send(data)
    }
    catch(err){
        return res.status(500).json({ message: 'Server error' });
    }
})

router.delete('/deleteCheckList/:checklistId', async (req, res) => {
    const checklistId = req.params.checklistId;
    const data = vesselInspectionData;

    const result = await data.deleteOne({
        checklistId: checklistId
    })
    res.send(result)
})




router.post('/createNotification', async (req, res) => {
    const notification = new Notification({
        companyName: req.body.companyName,
        vesselName: req.body.vesselName,
        notificationType: req.body.notificationType,
        remainingDays: req.body.remainingDays,
        questionNo: req.body.questionNo
    })

    await notification.save().then((_) => {
        res.json({ success: true, message: "Notification has been Send!" })
    })
    .catch((err) => {
        res.send(err)
    })

})

router.get('/getNotification/:companyName', async (req, res) => {
    const companyName = req.params.companyName;

    const notification = await Notification.find({
        companyName: companyName
    })

    if(!notification){
        return res.status(400).send({ message: "no notification found for this company" })
    }

    res.send(notification)
})


router.post('/updateCompanyLastNotificationDate/:companyName', async (req, res) => {
    const today = new Date();
    const updateDate = {
        lastNotificationDate: today
    };
    try {
        const updatedCompany = await Company.findOneAndUpdate({ companyName: req.params.companyName }, updateDate, { new: true });
        if (!updatedCompany) {
            return res.status(404).json({ error: "Company not found" });    
        }
        return res.status(200).json(updatedCompany);
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ error: "Server error" });
    }
});

router.post('/notioptions', (req, res) => {
    const data = req.body;
  
    companyNotiOptions.findOne({ companyName: data.companyName, email: data.email }, (err, existingDoc) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }
  
      if (existingDoc) {
        // Document with the same company name and email exists, so update it
        const options = {
          new: true, // Return the modified document rather than the original
          upsert: true, // Create a new document if none exists
        };
  
        companyNotiOptions.findOneAndUpdate({ companyName: data.companyName, email: data.email }, data, options, (err, doc) => {
          if (err) {
            return res.status(500).send('Internal Server Error');
          }
          res.status(200).send({ message: "successfull!" });
        });
      } else {
        // Document with the same company name and email does not exist, so create a new document
        const newDoc = new companyNotiOptions(data);
        newDoc.save((err) => {
          if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
          }
          res.status(200).send({ message: "successfull!" });
        });
      }
    });
  });
  

  router.get('/getNotiOptions/:companyName', async (req, res) => {
    try{
        await companyNotiOptions.find({
            companyName: req.params.companyName,
        })
            .then(data => {
                if(!data){
                    res.status(404).send({ message: 'No Notification Options found for this company' })
                }
                else{
                    res.send(data)
                }
            })
            .catch(Err => {
                res.status(500).send({ message: "Error retrieving "})
            })
    }
    catch(Err){
        res.send(Err)
    }
  })

  router.get('/updateNotiRead/:companyName/:email', async (req, res) => {
    try {
        const { companyName, email } = req.params;
        const noti = await Notification.find({ companyName, email });
        if (noti.length === 0) {
            return res.status(400).send({ message: 'No notifications log found for this user' });
        }

        const result = await Notification.updateMany(
            { companyName, email, isReadByCompany: false, notificationType: { $ne: 'New Communication' } },
            { $set: { isReadByCompany: true } }
        );

        const updatedData = { isRead: result.nModified };
        res.send(updatedData);
    } catch (err) {
        res.status(500).send(err);
    }
});

  

  router.delete('/deleteDueDateNotification/:companyName/:vesselName', async (req, res) => {
    try {
      const deletedNotification = await Notification.findOneAndDelete({ 
        companyName: req.params.companyName, 
        vesselName: req.params.vesselName,
        notificationType: 'Due Date'
      });
      if (!deletedNotification) {
        return res.status(404).json({ error: "Notification not found" });
      }
      return res.status(200).json(deletedNotification);
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ error: "Server error" });
    }
  });
  
  router.get('/isInspectionCompleted/:vesselName/:email/:checklistId', async (req, res) => {
    try {
      const { vesselName, email, checklistId } = req.params;
  
      // Find the vessel inspection data for the given vesselName
      const inspectionData = await vesselInspectionData.findOne({ vesselName, checklistId });
  
      // Find the user progress for the given vesselName and email
      const userProgress = await UserProgress.find({ nameOfVessel: vesselName, email });
  
      // Get an array of question numbers that have been answered
      const answeredQuestions = userProgress.map(progress => progress['Question No']);
  
      // Filter the questions array in the inspection data to only include unanswered questions
      const remainingQuestions = inspectionData.questions.filter(question => !answeredQuestions.includes(question.questionNo));
  
      // Get the question descriptions for the remaining questions
      const questionDescriptions = await Promise.all(remainingQuestions.map(async question => {
        const { questionNo } = question;
        const { questions } = await vesselInspectionData.findOne({ vesselName, 'questions.questionNo': questionNo }, { 'questions.$': 1 });
        return questions[0]["Question Description"];
      }));
      // Map the remaining questions array to include the question description
      const questionsWithDescription = remainingQuestions.map((question, index) => ({
        questionNo: question.questionNo,
        checkListName: question.checkListName,
        questionDescription: questionDescriptions[index],
        inspectionGuidance: question['Inspection Guidance'],
        suggestedInspectorActions: question['Suggested Inspector Actions'],
        expectedEvidence: question['Expected Evidence'],
        potentialGroundsForNegativeObservation: question['Potential grounds for a Negative Observation'],
        ISM: question.ISM,
        TMSA: question.TMSA,
        risk: question.Risk
      }));
  
      // Return the remaining questions array with question description as the response
      res.json(questionsWithDescription);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });
  
  router.post('/updateVesselInspection/:email', async (req, res) => {
    try{
        const data = await vesselInspectionData.findOne({ email: req.params.email })
        data.updated_at = new Date();
        await data.save();
        res.status(200).send('updated successfully')
    }
    catch(err){
        res.status(500).send(err.message);
    }
  })
  
  



module.exports = router;