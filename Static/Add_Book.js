var app=new Vue({
    el: "#app",
    delimiters: ['${','}'],
    data:{
        title:'',
        author:'',
        SID:'',
        section:''
    },
    created(){
      const url = window.location.href.split('/');
      this.SID = url[url.length - 1];
      this.section='abc'
      fetch(`http://127.0.0.1:5000/api/section/${this.SID}`)
        .then(response=>response.json())
        .then(data=>{
            this.section=data.name
        })
        .catch(error=>{
            console.error("Error",error);
        });
    },
    methods:{
        Add() {
            fetch(`http://127.0.0.1:5000/api/books/${this.title}/${this.author}/${this.SID}`, {
              method: 'POST'
            })
              .then(response => response.json())
              .then(data => {
                    console.log('Data submitted successfully:', data);
                    window.location.href='/admin/view/'+this.SID;
                
              })
              .catch(error => {
                console.error('Error submitting data:', error);
              });
        }
    }
    }
)