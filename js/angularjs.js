(function () {

  var app = angular.module('app', ['ngMessages', 'gridster', 'ngSanitize', 'angular.filter', 'googlechart', 'vcRecaptcha','ui.router','ngCookies']);

  app.config(function($stateProvider,$locationProvider,$urlRouterProvider,$qProvider) {
    var home = {
      name: 'home',
      url: '/home',
      templateUrl: 'main.html'
    }
  
    var login = {
      name: 'login',
      url: '/login',
      templateUrl: 'login.html'
    }
    var register = {
      name: 'register',
      url: '/register',
      templateUrl: 'register.html'
    }
    var test = {
      name: 'test',
      url: '/test',
      templateUrl: 'error.html'
    }
  
    $stateProvider.state(home);
    $stateProvider.state(login);
    $stateProvider.state(register);
    $stateProvider.state(test);

    $locationProvider.html5Mode(true);
    $qProvider.errorOnUnhandledRejections(false);
    
    $urlRouterProvider.otherwise("/home");
    
  });


  app.run(function ($rootScope, $http,PostService,$cookies,$location,$state,$timeout) {
    if($cookies.get("forever")){
      var loginCookie = $cookies.get('forever');
   }
   
   
    $rootScope.$on('$locationChangeStart', function (event,next,current) {
      
      $http.get("php/preveriSejo.php")
      .then(function (odlicno) {
        if (odlicno.data != 0) {
          
          $rootScope.user = odlicno.data;
          if($location.path()=="/"){
            $state.go("home");
          }
          else if($location.path()=="/login" || $location.path()=="/register"){
           
            $timeout(function(){
              $state.go("home");
           });
            
          }
         
          
        } else if($cookies.get("forever")) {
          $http.get("php/preveriCookie.php?cookie="+loginCookie)
          .then(function (res) {
           
           $rootScope.user=res.data;
            $state.go("home");
          });
        
        
        }
        else{
        
          if($location.path()=="/register"){
           $state.go("register");
          }else{
           
          
              $timeout(function(){
              $state.go("login");
              });
          }
      
        }
      });
            
              });
  
 

    
      
           /*
      var asd=[{}];
      $http.get("https://newsapi.org/v1/sources?language=en")
      .then(function (res) {
       console.log(res.data);
       var a=0;
        for(var i=0;i<res.data["sources"].length;i++){
          asd[a]={};                                                   ADDING NEWS SOURCES AUTOMATICLY FROM API
          asd[a]["name"]=res.data["sources"][i].name;
          asd[a]["id"]=res.data["sources"][i].id;
          asd[a]["category"]=res.data["sources"][i].category;
          asd[a]["sortBysAvailable"]=JSON.stringify(res.data["sources"][i].sortBysAvailable);
          a++;
        }
      console.log(asd);
    //  console.log(res.data["sources"][0].id);
   //   console.log(res.data["sources"][0].name);
    //  console.log(res.data["sources"][0].category);
    var url = "php/addSources.php";
    var data = "sources="+JSON.stringify(asd);
    PostService.Post(url, data).then(function(res){
      console.log(res);
    });
      });
      */
      
       
  });

  app.service('todoUntil', function ($http) {
    var vm = this;
    vm.Until = function (todo) {
      var one_day = 1000 * 60 * 60 * 24;
      var one_hour = 1000 * 60 * 60;
      var one_minute = 1000 * 60;
      vm.zdaj = new Date();
      vm.zdaj = vm.zdaj.getTime();

      for (var i = 0; i < todo.length; i++) {
        vm.left = todo[i].deadline;

        vm.left = new Date(vm.left);
        vm.left = vm.left.getTime();

        vm.ostane = vm.left - vm.zdaj;
        vm.ostane2 = Math.round(vm.ostane / one_day) + " dni";

        if (vm.ostane2 == "0 dni") {

          vm.ostane2 = Math.round(vm.ostane / one_hour) + " ur";
        }
        if (vm.ostane2 == "0 ur") {
          vm.ostane2 = Math.round(vm.ostane / one_minute) + " minut";
        }
        todo[i]["until"] = vm.ostane2;
      }
      return todo;
    }

  });
  app.service('PostService', function ($http) {
  
    this.Post = function (url, data) {

      return $http({
        method: "POST",
        url: url,
        data: data,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
    }

  });

  app.controller("LoginRegisterController", function ($http, $rootScope, $timeout, $scope, vcRecaptchaService, PostService,$cookies,$state) {
 
    var vm = this;
    vm.nomatch = false;
    vm.captchaRes = "";
    vm.checkpass = function () {
      vm.neuspeh = null;
      if (vm.newPass == vm.confPass) {
        vm.nomatch = false;
      } else {
        vm.nomatch = true;
      }
    }
    $scope.setWidgetId = function (widgetId) {

      $scope.widgetId = widgetId;
    };
    vm.registracija = function () {

      if (vm.captchaRes2 != "") {
        $http.get("php/preveriCaptcho.php?response=" + vm.captchaRes2)
          .then(function (res) {

            if (res.data.success) {

              if (vm.newPass == vm.confPass) {
  
                var url = "php/registracija.php";
                var data = "email=" + vm.email + "&password=" + vm.newPass + "&password2=" + vm.confPass;
                PostService.Post(url, data)
                  .then(function (res) {
                    if (res.data == "exist") {
                      vcRecaptchaService.reload(1);
                     
                      vm.neuspeh = "Uporabnik s to e-pošto že obstaja!";

                    } else if (res.data) {
                      
                      vm.neuspeh = false;
                      vm.uspeh = true;
                      $timeout(function(){
                      $state.go("login");
                    },2000);
                      vcRecaptchaService.reload(1);
                      
                    } else {
                      vm.neuspeh = true;
                      vcRecaptchaService.reload(1);
                    }
                  });
              } else {
                vm.uspeh = false;
                vm.neuspeh = true;
                vcRecaptchaService.reload(1);
              }
            } else {
              vm.error = res.data["error-codes"][0];
              vcRecaptchaService.reload(1);
            }



          });



      } else {
        vm.error = "Reši captcho!";
      }


    };


    vm.prijava = function () {

   //   if (vm.captchaRes != "") {
     //   $http.get("php/preveriCaptcho.php?response=" + vm.captchaRes)
     //     .then(function (res) {

           // if (res.data.success) {
              if(vm.cookie){
                var now = new Date(),
                // this will set the expiration to 12 months
                exp = new Date(now.getFullYear(), now.getMonth()+1, now.getDate());
                $cookies.put('forever', vm.email,{
                  expires: exp
                });
              }
              /*
              $http({
                method: "POST",
                url: "php/prijava.php",
                data:"email=" + vm.email + "&password=" + vm.password,
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                }
              })
              */
              var url = "php/prijava.php";
              var data = "email=" + vm.email + "&password=" + vm.password;
              PostService.Post(url, data)
                .then(function (res) {


                  if (res.data == "1") {
                    $state.go("home");
                  } else {
                    if (res.data == "3") {
                      vm.error = "Uporabnik ne obstaja!";
                      vcRecaptchaService.reload(0);
                    } else {
                      vm.error = "Napačno geslo!"
                      vcRecaptchaService.reload(0);
                    }

                  }

                });

          //  } else {


         //     vm.error = res.data["error-codes"][0];
         //     vcRecaptchaService.reload(0);
         //   }

        //  });
     // } else {
     //   vm.error = "Reši captcho!";
   //   }


    };
    vm.reset = function () {
      vm.error = null;
    }

  });

  app.controller("WidgetController", function ($http, $rootScope, $scope, PostService) {
    var vm = this;
   
    $http.get("php/widgetinit.php")
      .then(function (res2) {
        $rootScope.widgets = res2.data;
      
      });

    function updateXYpos() {
   
      var url = "php/widgetupdate.php";
      var data = "widgetData=" + JSON.stringify($rootScope.widgets);
      PostService.Post(url, data)
        .then(function (res) {
         //do nothing,has to always work
        });
    }

    $rootScope.gridsterOpts = {
      columns: 20, // the width of the grid, in columns
      pushing: true, // whether to push other items out of the way on move or resize
      floating: true, // whether to automatically float items up so they stack (you can temporarily disable if you are adding unsorted items with ng-repeat)
      width: 'auto', // can be an integer or 'auto'. 'auto' scales gridster to be the full width of its containing element
      colWidth: 'auto', // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
      rowHeight: 'match', // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
      margins: [20, 20], // the pixel distance between each widget
      outerMargin: true, // whether margins apply to outer edges of the grid
      sparse: true, // "true" can increase performance of dragging and resizing for big grid (e.g. 20x50)
      isMobile: false, // stacks the grid items if true
      mobileBreakPoint: 600, // if the screen is not wider that this, remove the grid layout and stack the items
      mobileModeEnabled: true, // whether or not to toggle mobile mode when screen width is less than mobileBreakPoint
      minSizeX: 5, // minimum column width of an item
      maxSizeX: null, // maximum column width of an item
      minSizeY: 5, // minumum row height of an item
      maxRows: 40,
      resizable: {
        enabled: false,
        handles: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],
        start: function (event, $element, widget) {

        }, // optional callback fired when resize is started,
        resize: function (event, $element, widget) {}, // optional callback fired when item is resized,
        stop: function (event, $element, widget) {
          updateXYpos();
        } // optional callback fired when item is finished resizing
      },
      draggable: {
        enabled: false, // whether dragging items is supported
        start: function (event, $element, widget) {

        }, // optional callback fired when drag is started,
        drag: function (event, $element, widget) {}, // optional callback fired when item is moved,
        stop: function (event, $element, widget) {
          updateXYpos();
        } // optional callback fired when item is finished dragging
      }
    };
  });

  app.controller("WeatherWidgetController", function ($http, $attrs, $rootScope) {
    var vm = this;
  vm.id = $attrs.widget;
      $http.get("php/widgetConfig.php?id=" + vm.id)
        .then(function (res) {
          vm.widgetConfig = res.data;
          vm.config = JSON.parse(vm.widgetConfig.config);
          vm.kraj = vm.config.kraj;
          //AIzaSyCUi_xtONMcAhv--hJBhLq0sEYw8s3Q6l4
         
          $http.get("php/getIDSlika.php?kraj="+vm.kraj)
          .then(function(slika){
            console.log(slika.data);
            $http.get("php/getSlika.php?id="+slika.data.results[0].photos[0].photo_reference)

           .then(function(slika){
           //  console.log(slika.data);
              vm.test=slika.data;
              
           });
          },function(error){
            $http.get("php/getGenericPhoto.php")
            .then(function(slika){
              vm.test=slika.data;
            });
          });
          
        //  $http.get("php/getGenericPhoto.php")
        //  .then(function(slika){
       //     vm.test=slika.data;
       //   });
        
          if(angular.isDefined(vm.kraj)){
          $http.get("http://api.openweathermap.org/data/2.5/weather?q=" + vm.kraj + "&units=metric&APPID=7aca27cc40dfc3d5208fc94b6afda6db&lang=sl")
            .then(function (vreme) {
            
             console.log(vreme.data);
                vm.vreme = vreme.data;
                vm.mesto = vm.vreme['name'];
                vm.ikona="owf owf-"+vm.vreme['weather'][0]['id']+" owf-5x";
                vm.temp = Math.round(vm.vreme['main']['temp']);
                if (vm.config.enota == "kelvin") {
                  vm.temp = vm.temp + 273 + " K";
                } else if (vm.config.enota == "fahrenheit") {
                  vm.temp = vm.temp * 9 / 5 + 32 + " °F";
                } else {
                  vm.temp += " °C";
                }
                vm.stanje = vm.vreme['weather'][0]['description'];
              

            }, function error(vreme) {
              if (vreme.data.cod == "404") {
                vm.mesto = "Mesto ne obstaja gtfo";
                alert("haha");
              }
             });
            }
        });
    
  });

  app.controller("GrafWidgetController", function ($http,$attrs, $rootScope, $scope, $timeout, $filter, PostService) {
  
    var vm = this;
    var skup = [];
    vm.widget=$attrs.widget;
    var mesec = new Date();
    
   // $http.get("php/getVrste.php")
     // .then(function (res) {
    //    vm.vrste = res.data;
       
   //   });
    $http.get("php/getGrafMonthAndYear.php?widget="+vm.widget)
      .then(function (res) {
        vm.zgodovina = res.data;
        
      });


      var trenutniMesec = $filter('date')(mesec, 'MM');
    
    vm.whenZgoSelected = function () {
   
      $http.get("php/getPoraba.php?mesec=" + vm.izberiZgo.mesec_id + "&leto=" + vm.izberiZgo.leto + "&widget="+vm.widget+"&tMesec="+trenutniMesec)
        .then(function (res) {
          $scope.myChartObject.options = {
            'title': "Poraba za mesec " + vm.izberiZgo.mesec + " " + vm.izberiZgo.leto,

            backgroundColor: 'transparent',
             pieHole: 0.4,
             legend: { position: 'bottom'},
             titleTextStyle: {
              color: 'white'
          }, legend: {
            textStyle: {
                color: 'white'
            }
        }

          };


          if (res.data != "vnesi podatke") {
            $scope.myChartObject.data = res.data;
           
          } else {
            $scope.myChartObject.data = [
              ["ni podatkov", "ni podatkov"]
            ];
          }



        });
    };


   
    
    $http.get("php/getPoraba.php?widget="+vm.widget+"&tMesec="+trenutniMesec)
      .then(function (res) {


        if (res.data != "vnesi podatke") {
          $scope.myChartObject.data = res.data;
          
        } else {
          $scope.myChartObject.data = [
            ["ni podatkov", "ni podatkov"]
          ];
        }



      });


    $scope.myChartObject = {};

    $scope.myChartObject.type = "PieChart";



    
    var leto = new Date();
    mesec = $filter('date')(mesec, 'MMMM');
    leto = $filter('date')(leto, 'yyyy');

    $scope.myChartObject.options = {
      'title': "Poraba za mesec " + mesec + " " + leto,

      backgroundColor: 'transparent',
      pieHole: 0.4,
      legend: { position: 'bottom'},
      titleTextStyle: {
       color: 'white'
   }, legend: {
     textStyle: {
         color: 'white'
     }
 }
    };






    vm.editEnabled = false;
    vm.shraniPorabo = function (poraba) {
     
      var poraba = {};
      poraba.znesek = vm.znesek;
      poraba.datum =  $filter('date')(vm.date, 'yyyy-MM-dd');
      poraba.widget = vm.widget;
      poraba.vrsta = angular.lowercase(vm.izberiVrsto);
      trenutniMesec =  $filter('date')(poraba.datum, 'MM');
      trenutniMesecBeseda =  $filter('date')(poraba.datum, 'MMMM');
      trenutnoLeto=$filter('date')(poraba.datum, 'yyyy');
      var url = "php/addPoraba.php";
      var data = "poraba=" + JSON.stringify(poraba);
      PostService.Post(url, data)
        .then(function (res) {

         // vm.znesek = "";
       //   vm.date = "";
        //  vm.izberiVrsto.id = "";
          $http.get("php/getPoraba.php?widget="+vm.widget+"&tMesec="+trenutniMesec)
            .then(function (res) {
              $scope.myChartObject.data = res.data; // POSODOBI PORABO
              $scope.myChartObject.options = {
                'title': "Poraba za mesec " + trenutniMesecBeseda + " " + trenutnoLeto,
          
                backgroundColor: 'transparent',
                pieHole: 0.4,
                legend: { position: 'bottom'},
                titleTextStyle: {
                 color: 'white'
             }, legend: {
               textStyle: {
                   color: 'white'
               }
           }
                
              };
              $http.get("php/getGrafMonthAndYear.php?widget="+vm.widget) //POSODOBI ZGODOVINO
              .then(function (res) {
                vm.zgodovina = res.data;
               
              });
              //POSODOBI ZGODOVINO

            });

        });


    };
    vm.edit = function () {
      if (vm.editEnabled) {
        vm.editEnabled = false;
      } else {
        vm.editEnabled = true;
      }
    };

    vm.delPoraba = function (item) {
     
      var url = "php/deletePoraba.php";
      var data = "id=" + item.id_poraba;
      PostService.Post(url, data)
        .then(function (res) {
          if (res.data == 1) {
        
            $http.get("php/getAllPoraba.php?widget="+vm.widget+ "&mesec="+trenutniMesec) // posodobi prikazano porabo za urejanje
              .then(function (res) {

                $http.get("php/getPoraba.php?widget="+vm.widget+"&tMesec="+trenutniMesec) // posodobi graf
                .then(function (res) {
          
          
                  if (res.data != "vnesi podatke") {
                    $scope.myChartObject.data = res.data;
                    
                  } else {
                    $scope.myChartObject.data = [
                      ["ni podatkov", "ni podatkov"]
                    ];
                  }
          
          
          
                });
                $http.get("php/getGrafMonthAndYear.php?widget="+vm.widget) //posodobi mesece za zgodovino
                .then(function (res) {
                  vm.zgodovina = res.data;
                  
                });

               
                $rootScope.poraba = res.data;
                vm.currentPage = 0;
                vm.pageSize = 3;
                vm.stevilo = [];


                vm.pages = Math.ceil($rootScope.poraba.length / vm.pageSize);
                for (var i = 0; i < vm.pages; i++) {
                  vm.stevilo.push({
                    id: i,
                    text: i + 1
                  });
                }



              });
          }
        });
    };

    vm.allPoraba = function (graf) {
      if(angular.isDefined(vm.izberiZgo)){
        
        trenutniMesec=vm.izberiZgo.mesec_id;
      }

      if(graf){ //da ne kličemo funkcije dvakrat oz jo pokličemo ko gremo iz prednje na zadnjo stran
      $http.get("php/getAllPoraba.php?widget="+vm.widget+ "&mesec="+trenutniMesec)
        .then(function (res) {

          
          $rootScope.poraba = res.data;
          vm.currentPage = 0;
          vm.pageSize = 3;
          vm.stevilo = [];


          vm.pages = Math.ceil($rootScope.poraba.length / vm.pageSize);
          for (var i = 0; i < vm.pages; i++) {
            vm.stevilo.push({
              id: i,
              text: i + 1
            });
          }



        });
      }

    };



  });

  

  app.controller("NoviceWidgetController", function ($http, $attrs, $rootScope, $scope,$timeout) {
   
    var vm = this;
    vm.test = false;
    //api key d3a535b2afa9418b836401eb613f02e3,8fb771b1531b4b4b990a84eb12b46f0e
    //  https: //newsapi.org/v1/articles?source=the-next-web&sortBy=latest&apiKey=d3a535b2afa9418b836401eb613f02e3
   
   
  //  initialize($attrs.widget);
var widget_id=$attrs.widget;
  //  function initialize(widget_id) {
      vm.id = widget_id;
      
     
   
        $http.get("php/widgetConfig.php?id=" + vm.id + "&test=" + $rootScope.user.id)
        .then(function (res) {

          vm.widgetConfig = res.data;
          vm.config = JSON.parse(vm.widgetConfig.config);
          vm.datum = vm.config.date;
          vm.opis = vm.config.opis;
          vm.slika = vm.config.slika;
          vm.order = vm.config.vrstni_red;
          vm.source = vm.config.source;
         
        if(angular.isDefined(vm.source)){

            $http.get("https://newsapi.org/v1/articles?source=" + vm.source + "&sortBy=" + vm.order + "&apiKey=8fb771b1531b4b4b990a84eb12b46f0e")
              .then(function (res) {
                  

                vm.novice = res.data["articles"];
                vm.source=res.data["source"];
              }, function (error) {
                if (error.data["code"] == "sourceUnavailableSortedBy") {
                  vm.error = "Izbrana razvrstitev novic ni navoljo prosimo uredite pod Nastavitve->uredi"
                }

              
              });
            }
            
          


        });
      });

  app.controller("TodoWidgetController", function ($http, $attrs, $rootScope, $scope, $filter, todoUntil, PostService) {
   
    var vm = this;
    vm.editEnabled = false;

    vm.id = $attrs.widget;
    
    $http.get("php/getTodo.php?id=" + vm.id)
      .then(function (res) {
        vm.todo = res.data;
        vm.todo = todoUntil.Until(vm.todo); //service todoUntil funkcija Until

      });




    vm.edit = function () {
      if (vm.editEnabled) {
        vm.editEnabled = false;
      } else {
        vm.editEnabled = true;
      }
    }

    vm.shraniNovaDela = function (choices) {

      var delo = {};

    
      
      
      
      delo.delo = vm.name;
      delo.deadline = vm.date;
      
      delo.id = vm.id;
      delo.level = vm.level;

      if(vm.name && vm.date && vm.level ){
        var url = "php/addTodo.php";
        var data = "delo=" + JSON.stringify(delo);
        PostService.Post(url, data)
          .then(function (res) {
          delete vm.napaka;
  
            $http.get("php/getTodo.php?id=" + vm.id)
              .then(function (res) {
                vm.todo = res.data;
                vm.name = null;
                vm.date = null;
                vm.id = $attrs.widget;
  
                vm.todo = res.data;
                vm.todo = todoUntil.Until(vm.todo);
              }); //good old copy paste
  
          });

       }else{
       vm.napaka="Izpolni vse!";
       }
    


    };
    vm.deleteTodo = function (todo) {
     
      var url = "php/deleteTodo.php";
      var data = "id=" + todo.id_todo;
      PostService.Post(url, data)
        .then(function (res) {
          $http.get("php/getTodo.php?id=" + vm.id)
            .then(function (res) {
              vm.todo = res.data;
              vm.name = null;
              vm.date = null;
              vm.todo = todoUntil.Until(vm.todo);
            }); //good old copy paste
        });
    };

    vm.doneTodo = function (todo) {
      
      var url = "php/doneTodo.php";
      var data = "id=" + todo.id_todo;
      PostService.Post(url, data)
        .then(function (res) {
          $http.get("php/getTodo.php?id=" + vm.id)
            .then(function (res) {
              vm.todo = res.data;
              vm.name = null;
              vm.date = null;
              vm.todo = todoUntil.Until(vm.todo);
            }); //good old copy paste
        });
    };


  });
  app.controller("EventWidgetController", function ($http, $attrs, $rootScope, $scope, $filter, todoUntil, PostService,$sanitize) {
   
    var vm = this;
    vm.editEnabled = false;

    vm.id = $attrs.widget;
    var datum = new Date();
    var nMesec = new Date();
    mesec = $filter('date')(datum, 'MM');

    $http.get("php/getDogodki.php?id=" + vm.id + "&mesec=" + mesec)
      .then(function (res) {
        vm.dogodki = res.data;
        if(vm.dogodki==""){
          nMesec.setMonth(datum.getMonth()+1);
          nMesec = $filter('date')(nMesec, 'MM');
          $http.get("php/getDogodki.php?id=" + vm.id + "&mesec=" + nMesec)
          .then(function (res) {
            vm.dogodki=res.data;
          });
          
        }


      });




    vm.edit = function () {
      if (vm.editEnabled) {
        vm.editEnabled = false;
      } else {
        vm.editEnabled = true;
      }
    }

    vm.shraniDogodek = function (dogodek) {

      var dogodek = {};
      dogodek.title = vm.title;
      dogodek.opis = $sanitize(vm.opis);
      dogodek.id = vm.id;
      dogodek.start = vm.start;

     
      var url = "php/addDogodek.php";
      var data = "dogodek=" + JSON.stringify(dogodek);
      PostService.Post(url, data)
        .then(function (res) {


          $http.get("php/getDogodki.php?id=" + vm.id + "&mesec=" + mesec)
            .then(function (res) {
              vm.dogodki = res.data;
              dogodek.title = null;
              dogodek.opis = null;

              dogodek.start = null;

            }); //good old copy paste


        });



    };
    vm.deleteDogodek = function (dogodek) {
     
      var url = "php/deleteDogodek.php";
      var data = "id=" + dogodek.id_event;
      PostService.Post(url, data)
        .then(function (res) {
          $http.get("php/getDogodki.php?id=" + vm.id + "&mesec=" + mesec)
            .then(function (res) {
              vm.dogodki = res.data;
              dogodek.title = null;
              dogodek.opis = null;

              dogodek.start = null;


            }); //good old copy paste
        });
    };




  });




  app.controller("NastavitveController", function ($http, $rootScope, $timeout, $filter, PostService,$scope,$cookies,$state,$location) {
  
    var vm = this;
    vm.buttonName = "Odkleni polje";
    vm.widgetTypes = [];

    initialize();

    function initialize() {

      $http.get("php/listWidgetTypes.php")
        .then(function (res) {
          vm.widgetTypes = res.data;
         

        });

       

    }

    vm.loadWidgetOptions = function (item) {

      vm.widgetTypes.forEach(function (el) {
        el.selected = false;
        vm.name = null;
      });

      item.selected = true;
    };
   $scope.getSorting = function(opt){

    $http.get("php/getSorting.php?id="+opt)
    .then(function (res) {
    
      vm.sort=JSON.parse(res.data.sorting);
       
    });

vm.izbrano=true;

   };
    vm.submitWidgetAdd = function (item) {
      
      var widget = {};
      var config = {};
      
      item.options.forEach(function (el) {
        config[el.field] = vm.options[el.field];
        
      });
    
      if(angular.isDefined(vm.source)){
        if(angular.isDefined(vm.sorted)){
          
          config["vrstni_red"]=vm.sorted;
        config["source"]=vm.source.id_source;
        }
      }else{
        vm.qwe=false;
      }
    
      vm.qwe=true;
    
      widget.config = JSON.stringify(config);
      widget.posX = item.dposX;
      widget.posY = item.dposY;
      widget.x = 10;
      widget.y = 10;
      widget.active = 1;
      widget.user = $rootScope.user.id;
      widget.widget_type = item.id;
      widget.imeWidget = vm.name;
      
      var url = "php/addWidget.php";
      var data = "asd=" + JSON.stringify(widget);
      
      PostService.Post(url, data)
        .then(function (res) {
          $http.get("php/widgetinit.php")
            .then(function (res2) {
              $rootScope.widgets = res2.data;
              
              delete vm.options;
              delete vm.source;
            delete vm.sorted;
              vm.name="";
              item.selected=false;
            

            });

        });
        
        
      


    };


    vm.loadWidgetSettings = function (item) {

      $rootScope.widgets.forEach(function (el) {
        el.selected = false;
      });
      item.selected = true;
     
    };

    vm.updateWidgetConfig = function (item) {
      var widget = {};

      var config = {};
      for (var key in item.config) {
        config[key] = vm.options2[key];
      }
      config.vrstni_red=vm.sorted;

      widget.config = JSON.stringify(config);
      widget.imeWidget = vm.updateName;
      widget.id_widget = item.id_widget;
     
      var url = "php/updateWidgetConfig.php";
      var data = "data=" + JSON.stringify(widget);
      PostService.Post(url, data)
        .then(function (res) {
          $http.get("php/widgetinit.php")
            .then(function (res2) {
              $rootScope.widgets = res2.data;
              location.reload();
            });
        });
    };
    vm.deleteWidget = function (item) {

      if (confirm("Brisanje widgeta bo trajno izbrisalo podatke!")) {
        
        var url = "php/deleteWidget.php";
        var data = "id=" + item.id_widget + "&type=" + item.widget_type;
        PostService.Post(url, data)
          .then(function (res) {

            if (res) {
              vm.ifDelete = "Ploščica "  + item.ImeWidget+" je odstranjena";
              $http.get("php/widgetinit.php")
                .then(function (res2) {
                  $rootScope.widgets = res2.data;
                });
              $timeout(function () {
                vm.ifDelete = "";
              }, 2000);
            }
          });
      }
    };
    
    vm.toggleButton = function () {
      if ($rootScope.gridsterOpts.draggable.enabled == true) {
        $rootScope.gridsterOpts.draggable.enabled = false;
        $rootScope.gridsterOpts.resizable.enabled = false;
        vm.buttonName = "Odkleni polje";
      } else {
        $rootScope.gridsterOpts.draggable.enabled = true;
        $rootScope.gridsterOpts.resizable.enabled = true;
        vm.buttonName = "Zakleni polje";
      }
    };
    vm.buttonClass = function () {
      if (vm.buttonName == "Odkleni polje") {
        return 'btn-success';
      } else {
        return 'btn-danger';
      }
    }

    vm.prikaziskrij = function (item) {
      if (item.active == 1) {
        item.active = 0;
      } else {
        item.active = 1;
      }
    
      var url = "php/widgetVisUpdate.php";
      var data = "id=" + item.id_widget + "&active=" + item.active;
      PostService.Post(url, data)
        .then(function (res) {
          if (res.data != "error") {

          }
        });
    }

    vm.odjava = function () {
      $http.get("php/odjava.php")
        .then(function (res) {
      //    $rootScope.user = null;
        //  $rootScope.widgets = null;
       
          $cookies.remove("forever");
         
       
          $state.go("login");

        });
    }

  });

  app.directive('dynamicController', ['$controller', function ($controller) {
    return {
      restrict: 'A',
      scope: true,
      link: function (scope, elem, attrs) {
        attrs.$observe('dynamicController', function (name) {
          if (name) {
            elem.data('$Controller', $controller(name, {
              $scope: scope,
              $element: elem,
              $attrs: attrs
            }));
          }
        });
      }
    };
  }]);
  app.directive('tooltip', function(){
    return {
        restrict: 'A',
        link: function(scope, element, attrs){
            $(element).hover(function(){
                // on mouseenter
                $(element).tooltip('show');
                
            }, function(){
                // on mouseleave
                $(element).tooltip('hide');
            });
        }
    };
});

})();
