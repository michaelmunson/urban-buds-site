// const mailjet = require ('node-mailjet')
// .connect('a509ccc4aad53ed0fd319cf303243d33','e4b6207bfae4dd136f4e97f49a693dd5');
import Mailjet from "node-mailjet";

const mailjet = Mailjet.apiConnect('a509ccc4aad53ed0fd319cf303243d33','e4b6207bfae4dd136f4e97f49a693dd5');


export default function sendEmail(emailArray){
    const request = mailjet
    .post("send", {'version': 'v3.1'})
    .request({
    "Messages":[
        ...emailArray.map(emailObj => {
            return {
                "From": {
                    "Email": "urbanbuds420@gmail.com",
                    "Name": "Urban Buds"
                },
                "To": [
                    {
                    "Email": emailObj.email,
                    "Name": "Michael"
                    }
                ],
                "Subject": emailObj.subject,
                "TextPart": "Urban Buds Email",
                "HTMLPart": emailObj.body,
                "CustomID": "MyCustomID"
            }
        })
    ]
    })
    request
    .then((result) => {
        // console.log(result.body)
    })
    .catch((err) => {
        console.log(err.statusCode)
    })

}
