import '/imports/startup/server/Accounts';
import '/imports/startup/server/Publications';
import '/imports/startup/server/Mongo';
import { Email } from 'meteor/email';

process.env.MAIL_URL = 'smtps://uhclublounge%40gmail.com:clublounge2020@smtp.gmail.com:465/';

let message = 'Hello ,<br>';
message += 'Thank you for registering in the Club Lounge website, hope you find all the future clubs and events ' +
    'enjoyable';
Email.send({
  to: 'boque.rabang@gmail.com',
  from: 'uhclublounge@gmail.com',
  subject: 'Registration Confirmation',
  text: message,
});
