var app=new Vue({
    el: "#app",
    delimiters: ['${','}'],
    data:{
        title:'',
        desc:'',
        SID:'',
        section:''
    },
    created(){
      const url = window.location.href.split('/');
      this.SID = url[url.length - 1];
      fetch(`http://127.0.0.1:5000/api/section/${this.SID}`)
      .then(response=>response.json())
      .then(data=>{
          this.title=data.name
          this.desc=data.desc
      })
      .catch(error=>{
          console.error("Error",error);
      });
    },
    methods:{
        Edit() {
            fetch(`http://127.0.0.1:5000/api/sections/${this.title}/${this.desc}/${this.SID}`, {
              method: 'PUT'
            })
              .then(response => response.json())
              .then(data => {
                    console.log('Data updated successfully:', data);
                    window.location.href='/admin';
              })
              .catch(error => {
                console.error('Error updating data:', error);
              });
        }
    }
    }
)