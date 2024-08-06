var app=new Vue({
    el: "#app",
    delimiters: ['${','}'],
    data:{
        books:'',
        name:'',
        SID:''
    },
    created(){
        const url = window.location.href.split('/');
        this.SID = url[url.length - 1];
        fetch("http://127.0.0.1:5000/api/section/"+this.SID)
        .then(response=>response.json())
        .then(data=>{
            this.name=data.name
            this.books=data.books
        })
        .catch(error=>{
            console.error("Error",error);
        });
    },
    methods:{
        Edit(id){
            window.location.href="/admin/editb/"+id
        },
        Delete(id){
            fetch(`http://127.0.0.1:5000/api/books/${id}`, {
                method: 'DELETE'
              })
                .then(response => {
                })
                .then(data => {
                  console.log('Success:', data);
                  location.reload();
                })
                .catch(error => {
                  console.error('Error:', error);
                });
            console.log("Delete")
        },
        Add(){
            window.location.href="/admin/add/"+this.SID
        }
    }
    }
)