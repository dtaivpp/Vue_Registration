Vue.use(window.VeeValidate);
Vue.config.silent = true;

var app = new Vue({
  el: '.container',
  data:{
    registrants:[
      { 
        Name:'',
        DOB:'',
        PhoneNumber:'',
        Email:'',
        StreetAddress:'',
        City:'',
        State:'',
        ZipCode:''
      }
    ],
    ajaxRequest: false
  },
  methods:{
    addNewRegistrantForm () {
      this.registrants.push({
        Name:'',
        DOB:'',
        PhoneNumber:'',
        Email:'',
        StreetAddress:'',
        City:'',
        State:'',
        ZipCode:''
      })
    },
    deleteEmployeeForm(index) {
      if(this.registrants.length !== 1){
        this.registrants.splice(index, 1)
      }
    },
    submitForm: function() {
      this.$validator.validateAll().then(res=>{
        if(res){
          this.ajaxRequest = true;
          this.$http.post('https://fbb0z0ndxk.execute-api.us-east-1.amazonaws.com/Dev/', this.registrants
            , function (data, status, request) {
                this.postResults = data;
                this.ajaxRequest = false;
          });
        } else {
          alert("Please ensure you have correctly filled out the form");
          this.ajaxRequest = false;
        }
      });
    },
    distb() {
      var stored = localStorage["htpd-8792"] || null;
      localStorage["htpd-8792"] = (stored === null || true ? true : false  );
        return localStorage["htpd-8792"];
    }
  }
})