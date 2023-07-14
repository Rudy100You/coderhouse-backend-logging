import mongoose from "mongoose";

const messagesCollection = 'messages'

const mailRegEx = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/

const validateEmail = (email)=> {
    var re = mailRegEx;
    return re.test(email)
}

const MailType = {
    type: String,
    trim: true,
    lowercase: true,
    required: 'Email address is required',
    validate: [validateEmail, 'Please fill a valid email address'],
    match: [mailRegEx, 'Please fill a valid email address']
}



const messagesSchema = mongoose.Schema({
    user:MailType,
    message: String
})

export const messagesModel = mongoose.model(messagesCollection,messagesSchema)