const nodemailer = require('nodemailer')

const sendEmail = async options => {
        
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PWD
            }
        });
        let mailoptions = {
            from: 'no.reply.cherub@gmail.com',
            to: options.email,
            subject: options.subject,
            text: options.message,
        };

        await transporter.sendMail(mailoptions, function (err, data) {
            if (err) {
                console.log("error", err);
            }
            else {
                console.log("email sent successfully!!");
            }
        });
    
}

// module.exports = {
//     sendEmail: function (email) {
//         return new Promise(async function (resolve, reject) {
//             let transporter = nodemailer.createTransport({
//                 service: 'gmail',
//                 auth: {
//                     user: process.env.EMAIL,
//                     pass: process.env.PWD
//                 }
//             });
//             let mailoptions = {
//                 from: 'no.reply.cherub@gmail.com',
//                 to: email,
//                 subject: 'cherub forgot password ',
//                 text: 'click the link to reset your password',                
//             };
                                                  
//             transporter.sendMail(mailoptions, function (err, data) {
//                 if (err) {
//                     console.log("error", err);
//                 }
//                 else {
//                     console.log("email sent successfully!!");
//                 }
//             });
//             return resolve("");
//         })
//     }

// }

module.exports=sendEmail