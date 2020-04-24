import '/imports/startup/server/Accounts';
import '/imports/startup/server/Publications';
import '/imports/startup/server/Mongo';
import { Email } from 'meteor/email';

Meteor.methods({
  // eslint-disable-next-line meteor/audit-argument-checks
  registerEmail: function (email, firstName) {
    process.env.MAIL_URL = 'smtps://uhclublounge%40gmail.com:clublounge2020@smtp.gmail.com:465/';

    let message = `Hello ${firstName},<br>`;
    message += 'Thank you for registering in the Club Lounge website, hope you find all the future clubs and events ' +
        'enjoyable';
    message += 'To access your account you can click' +
        '<a href=\'http://clublounge.meteorapp.com/#/signin\'> this link</a>.<br>';
    this.unblock();
    Email.send({
      to: email,
      from: 'clublounge@gmail.com',
      subject: 'Registration Confirmation',
      text: message,
    });
  },
});
