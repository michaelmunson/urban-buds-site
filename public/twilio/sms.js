import twilio from "twilio"

const client = twilio(accountSid, authToken);

export default function sendSMS(body,number){
    client.messages
        .create({ body, from: "+18336230323", to: `+1${number}` })
        //.then(message => console.log(message.sid));
}
