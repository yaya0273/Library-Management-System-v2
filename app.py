from flask import Flask
from flask import render_template
from flask import request
from flask import redirect
from flask import make_response
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import or_
from datetime import date,timedelta
from flask_restful import Api, Resource,reqparse
#import workers
import tasks
import os

app=Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///C:/Users/yayar/Desktop/Documents/IITM/MAD II Project/database.sqlite3"
db=SQLAlchemy()
db.init_app(app)
api=Api(app)
app.app_context().push()
#celery=workers.celery
#celery.conf.update(broker_url="redis://localhost:6379/1",result_backend="redis://localhost:6379/2",broker_connection_retry_on_startup=True)
#celery.Task=workers.ContextTask
#Models

class Book(db.Model):
    __tablename__='book'
    ID=db.Column(db.Integer,primary_key=True, autoincrement=True)
    Name=db.Column(db.String)
    Author=db.Column(db.String)
    SID=db.Column(db.Integer, db.ForeignKey("section.ID"))

class Section(db.Model):
    __tablename__='section'
    ID=db.Column(db.Integer,primary_key=True, autoincrement=True)
    Name=db.Column(db.String)
    Desc=db.Column(db.String)

class Users(db.Model):
    __tablename__='users'
    ID=db.Column(db.Integer,primary_key=True)
    Password=db.Column(db.String)
    Email=db.Column(db.String)

class Issued(db.Model):
    __tablename__='issued'
    SL=db.Column(db.Integer,autoincrement=True,primary_key=True)
    BID=db.Column(db.Integer)
    UID=db.Column(db.Integer)
    Status=db.Column(db.String)
    DOI=db.Column(db.String)
    DOR=db.Column(db.String)

#Routes

@app.route('/')
def login():
    return render_template("Login.html")
        
@app.route('/register')
def register():
    return render_template("Register.html")
        
@app.route('/user/<id>')
def user(id):
    return render_template("My_Books.html")

@app.route('/return/<bid>/<uid>')
def return_book(bid,uid):
    return redirect("/user/")

@app.route('/<id>/books')
def books(id):
        return render_template("Books.html")

@app.route('/admin')
def admin():
    return render_template("L_Dash.html")

@app.route('/admin/add/<id>')
def add_book(id):
    return render_template("Add_Book.html")

@app.route('/admin/view/<id>')
def view(id):
    return render_template("View_Section.html")

@app.route('/admin/requests')
def requests():
    return render_template("Requests.html")

@app.route('/admin/issued')
def issued():
    return render_template("Issued.html")

@app.route('/admin/adds')
def add_section():
    return render_template("Add_Section.html")
    
@app.route('/admin/editb/<id>')
def edit_book(id):
    return render_template("Edit_Book.html")

@app.route('/admin/edits/<id>')
def edit_section(id):
    return render_template("Edit_Section.html")

@app.route('/hello/<name>')
def tell_hello(name):

    job=tasks.hello.delay(name)
    result=job.wait()
    return str(job),200


#API

class UserAPI(Resource):
    def get(self,id):
        data=Users.query.filter_by(ID=id).first()
        return {"User ID":data.ID,"Password":data.Password}
    def post(self):
        create_user_parser=reqparse.RequestParser()
        create_user_parser.add_argument('id')
        create_user_parser.add_argument('p1')
        create_user_parser.add_argument('p2')
        create_user_parser.add_argument('email')
        args=create_user_parser.parse_args()
        id=args.get("id")
        p1=args.get("p1")
        p2=args.get("p2")
        email=args.get("email")
        n=Users.query.filter_by(ID=id).count()
        if(n!=0):
            return {"Status":400},400
        elif(p1!=p2):
            return {"Status":401},401
        else:
            data=Users(ID=id,Password=p1,Email=email)
            db.session.add(data)
            db.session.commit()
            return {"Status":201},201
api.add_resource(UserAPI,'/api/user/<id>','/api/user')

class UserBooksAPI(Resource):
    def get(self,id):
        data=Issued.query.filter_by(Status="Current").filter(Issued.DOR<date.today()).all()
        for i in data:
            return_book(i.BID,i.UID)
        books=Issued.query.filter_by(UID=id).all()
        current=[]
        completed=[]
        requested=[]
        for i in books:
            if(i.Status=="Current"):
                current.append(i.BID)
            elif(i.Status=="Completed"):
                completed.append(i.BID)
            else:
                requested.append(i.BID)
        bcu=db.session.query(Book,Issued,Section).filter(Book.ID==Issued.BID).filter(Book.SID==Section.ID).filter(Issued.UID==id).filter(Book.ID.in_(current)).all()
        bco=Book.query.filter(Book.ID.in_(completed)).all()
        bre=Book.query.filter(Book.ID.in_(requested)).all()
        for i in bco+bre:
            i.SID=Section.query.filter_by(ID=i.SID).first().Name
        bcut=[]
        bcot=[]
        bret=[]
        for i in bcu:
            bcut.append({"Name1":i[0].Name,"Author":i[0].Author,"Name2":i[2].Name,"DOI":i[1].DOI,"DOR":i[1].DOR,"ID":i[0].ID})
        for i in bco:
            bcot.append({"Name":i.Name,"Author":i.Author,"SID":i.SID,"ID":i.ID})
        for i in bre:
            bret.append({"Name":i.Name,"Author":i.Author,"SID":i.SID,"ID":i.ID})
        return {"id":id,"bcu":bcut,"bco":bcot,"bre":bret}
    
    def put(self,uid,bid,status):
        if(status=="Requested"):
            n=Issued.query.filter_by(UID=uid).filter(Issued.Status.in_(['Current', 'Requested'])).count()
            if(n>=5):
                return {"Status":400},400
        try:
            data=db.session.query(Issued).filter_by(BID=bid).filter_by(UID=uid).first()
            data.Status=status
            if status=="Current":
                data.DOI=date.today()
                data.DOR=date.today()+timedelta(days=7)
        except:
            data=Issued(BID=bid,UID=uid,Status=status)
            db.session.add(data)
        db.session.commit()
        return {"Status":204},200
    
    def delete(self,uid,bid):
        data=db.session.query(Issued).filter_by(BID=bid).filter_by(UID=uid).first()
        db.session.delete(data)
        db.session.commit()
        return "",204

api.add_resource(UserBooksAPI,'/api/user/books/<id>','/api/user/books/<uid>/<bid>/<status>','/api/user/books/<uid>/<bid>')

class BookAPI(Resource):
    def get(self,id):
        book=Book.query.filter_by(ID=id).first()
        return {"book":{'Name':book.Name,'Author':book.Author}}
api.add_resource(BookAPI,'/api/book/<id>')

class BooksAPI(Resource):
    def get(self,id):
        books=Book.query.all()

        for i in books:
            i.SID=Section.query.filter_by(ID=i.SID).first().Name
        bookst=[]
        for i in books:
            bookst.append({"Name":i.Name,"Author":i.Author,"SID":i.SID,"ID":i.ID})
        return {"id":id,"books":bookst}
    def post(self,title,author,SID):
        data=Book(Name=title,Author=author,SID=SID)
        db.session.add(data)
        db.session.commit()
        print(title,author,SID)
        return "",201
    def put(self,id,title,author,sid):
        data=db.session.query(Book).filter_by(ID=id).first()
        data.Name=title
        data.Author=author
        data.SID=sid
        db.session.commit()
        return "",200
    def delete(self,id):
        data=db.session.query(Book).filter_by(ID=id).first()
        db.session.delete(data)
        db.session.commit()
        return "",204
api.add_resource(BooksAPI,'/api/books/<id>','/api/books/<title>/<author>/<SID>','/api/books/<id>/<title>/<author>/<sid>')

class SectionAPI(Resource):
    def get(self,id):
        books=Book.query.filter_by(SID=id).all()
        sect=Section.query.filter_by(ID=id).first().Name
        desc=Section.query.filter_by(ID=id).first().Desc
        bookst=[]
        for i in books:
            bookst.append({"Name":i.Name,"Author":i.Author,"BID":i.ID})
        return {"name":sect,"desc":desc,"books":bookst}
    def post(self,name,desc):
        data=Section(Name=name,Desc=desc)
        db.session.add(data)
        db.session.commit()
        return "",201
    
    
api.add_resource(SectionAPI,'/api/section/<id>','/api/section/<name>/<desc>')

class SectionsAPI(Resource):
    def get(self):
        data=Section.query.all()
        sections=[]
        for i in data:
            sections.append({"Name":i.Name,"Desc":i.Desc,"ID":i.ID})
        return {"sections":sections}
    
    def put(self,title,desc,SID):
        data=db.session.query(Section).filter_by(ID=SID).first()
        data.Name=title
        data.Desc=desc
        db.session.commit()
        return "",200

    def delete(self,id):
        data=db.session.query(Section).filter_by(ID=id).first()
        db.session.delete(data)
        db.session.commit()
        return "",204
api.add_resource(SectionsAPI,'/api/sections','/api/sections/<id>','/api/sections/<title>/<desc>/<SID>')

class IssuedAPI(Resource):
    def get(self):
        data=Issued.query.filter_by(Status="Current").order_by("UID").all()
        issued=[]
        for i in data:
            name=Book.query.filter_by(ID=i.BID).first().Name
            issued.append({"UID":i.UID,"BID":i.BID,"DOI":i.DOI,"DOR":i.DOR,"Name":name})
        return {"issued":issued}
api.add_resource(IssuedAPI,'/api/issued')

class RequestsAPI(Resource):
    def get(self):
        data=Issued.query.filter_by(Status="Requested")
        requests=[]
        for i in data:
            name=Book.query.filter_by(ID=i.BID).first().Name
            requests.append({"UID":i.UID,"BID":i.BID,"Name":name})
        return {"requests":requests}
api.add_resource(RequestsAPI,'/api/requests')


#Tasks

#@celery.task()
def Daily_Reminder():
    data=Issued.query.all()
    for issue in data:
        if issue.DOR==str(date.today()):
            email=Users.query.filter_by(ID=issue.UID).first().Email
            book=Book.query.filter_by(ID=issue.BID).first().Name
            print(email,book)

#@celery.task()
def Activity_Report():
    pass

#@celery.task()
def Issue():
    pass



if __name__=='__main__':
    #app.run(debug=True)
    Daily_Reminder()