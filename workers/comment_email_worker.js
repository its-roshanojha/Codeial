const queue = require('../config/kue');

const commentsMailer = require('../mailers/comments_mailer');

// Every worker has a process function and the process function tells the worker that whenever a new  task is added in a queue it need to run the cide in the process function 
queue.process('emails', function(job, done){
    console.log ('emails worker is processing a job ', job.data);

    commentsMailer.newComment(job.data);

    done();
});