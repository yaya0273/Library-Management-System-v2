var app=new Vue({
    el: "#app",
    delimiters: ['${','}'],
    data:{
        name:'',
        desc:'',
    },
    methods:{
        Add() {
            fetch(`http://127.0.0.1:5000/api/section/${this.name}/${this.desc}`, {
                method: 'POST'
              })
                .then(response => response.json())
                .then(data => {
                      console.log('Data submitted successfully:', data);
                      window.location.href='/admin';
                  
                })
                .catch(error => {
                  console.error('Error submitting data:', error);
                });
        }
    }
    }
)