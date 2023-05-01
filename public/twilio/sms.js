import twilio from "twilio"

const accountSid = "ACc0bc0a98b030ce703f7d07dcc6b9d97e";
const authToken = "099a225c0c23f8e5ff4807ae8c253e7f";
const client = twilio(accountSid, authToken);

export default function sendSMS(body,number){
    client.messages
        .create({ body, from: "+18336230323", to: `+1${number}` })
        //.then(message => console.log(message.sid));
}
