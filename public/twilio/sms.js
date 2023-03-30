import twilio from "twilio"

const accountSid = "ACc0bc0a98b030ce703f7d07dcc6b9d97e";
const authToken = "373f9147e7d75e07ae05ece7dca67cf2";
const client = twilio(accountSid, authToken);

export default function sendSMS(body,number){
    client.messages
        .create({ body, from: "+18336230323", to: `+1${number}` })
        //.then(message => console.log(message.sid));
}
