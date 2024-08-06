#from workers import celery
from mailjet_rest import Client
import os

#@celery.task()
def hello(name):
    print("In Task ",name)
    return "Hello"

#@celery.task()
def Daily_Reminder():
    pass

#@celery.task()
def Activity_Report():
    pass

#@celery.task()
def Issued():
    pass

def Mail():
    api_key = 'bf3ba7fb488285543023fb60704b8aaa'
    api_secret = '7b1b0eecd57868504aad16d4c4124293'
    mailjet = Client(auth=(api_key, api_secret), version='v3.1')
    data = {
    'Messages': [
        {
        "From": {
            "Email": "yayarohitrocks@gmail.com",
            "Name": "Me"
        },
        "To": [
            {
            "Email": "yayarohitrocks@gmail.com",
            "Name": "You"
            }
        ],
        "Subject": "My first Mailjet Email!",
        "TextPart": "Greetings from Mailjet!",
        "HTMLPart": "<h3>Dear passenger 1, welcome to <a href=\"https://www.mailjet.com/\">Mailjet</a>!</h3><br />May the delivery force be with you!"
        }
    ]
    }
    result = mailjet.send.create(data=data)
    print(result.status_code)
    print(result.json())

#Mail()