var app=new Vue({
    el: "#app",
    delimiters: ['${','}'],
    data:{
        sections:''
    },
    created(){
        fetch("http://127.0.0.1:5000/api/sections")
        .then(response=>response.json())
        .then(data=>{
            this.sections=data.sections
        })
        .catch(error=>{
            console.error("Error",error);
        });
    },
    methods:{
        View(id){
            window.location.href="/admin/view/"+id
        },
        AddB(id){
            window.location.href="/admin/add/"+id
        },
        Edit(id){
            window.location.href="/admin/edits/"+id
        },
        AddS(){
            window.location.href="/admin/adds"
        },
        Delete(id){
            fetch(`http://127.0.0.1:5000/api/sections/${id}`, {
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
        }
    }
    }
)