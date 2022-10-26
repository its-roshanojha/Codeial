const nodeMailer = require('../config/nodemailer');



// this is another way of exporting a method. newComment is the function name here
exports.newComment = (comment) => {
    let htmlString = nodeMailer.renderTemplate({comment: comment}, '/comments/new_comment.ejs');
    // console.log('inside newComment mailer', comment);

    nodeMailer.transporter.sendMail({
       from: 'its.nishaojha@gmail.com',
       to: comment.user.email,
       subject: "New Comment Published!",
       html: htmlString
    }, (err, info) => {
        if (err){
            console.log('Error in sending mail', err);
            return;
        }

        console.log('Message sent', info);
        return;
    });
}