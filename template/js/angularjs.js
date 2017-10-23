(function() {
    
      var app = angular.module('app', ['ngMessages', 'gridster', 'ngSanitize','angular.filter','googlechart']);
    
      app.run(function($rootScope, $http) {
    
        $http.get("template/php/preveriSejo.php")
          .then(function(odlicno) {
            if(odlicno.data != "gtfo") {
              $rootScope.user = odlicno.data;
            } else {
              $("#regLog")
                .modal("toggle");
            }
          });
        
      });

      app.service('todoUntil', function() {
      var vm=this;
        vm.Until = function (todo) {
          var one_day=1000*60*60*24;
          var one_hour=1000*60*60;
          var one_minute=1000*60;
          
          for(var i=0;i<todo.length;i++){
            vm.left=todo[i].deadline;
            
            vm.zdaj=new Date();
            vm.zdaj=vm.zdaj.getTime();
         
          vm.left=new Date(vm.left); 
          vm.left=vm.left.getTime();
     
           vm.ostane=vm.left-vm.zdaj;
          vm.ostane2=Math.round(vm.ostane/one_day)+ " dni"; 
         
            if(vm.ostane2=="0 dni"){
            
              vm.ostane2=Math.round(vm.ostane/one_hour)+ " ur"; 
            }
             if(vm.ostane2=="0 ur"){
              vm.ostane2=Math.round(vm.ostane/one_minute)+ " minut"; 
            }
             todo[i]["until"]=vm.ostane2;
           }
           return todo;
          }
    });
    
      app.controller("LoginRegisterController", function($http, $rootScope, $timeout) {
        var vm = this;
        vm.nomatch=false;

        vm.checkpass = function(){
          vm.neuspeh=null;
          if(vm.newPass == vm.confPass) {
          vm.nomatch=false;
          }else{
            vm.nomatch=true;
          }
        }
        vm.submit = function() {
          if(vm.newPass == vm.confPass) {
            
            $http({
                method: "POST",
                url: "template/php/registracija.php",
                data: "email=" + vm.email + "&password=" + vm.newPass + "&password2=" + vm.confPass,
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                }
              })
              .then(function(res) {
                if(res.data == "exist"){
                  vm.neuspeh="Uporabnik s to e-pošto že obstaja!";
                }else if(res.data) {
                
                  vm.neuspeh = false;
                  vm.uspeh = true;
                  $timeout(function() {
                    angular.element('#prijavaTab')
                      .trigger('click');
    
                  }, 1000);
                } else {
                  vm.neuspeh = true;
                 
                }
              });
          } else {
            vm.uspeh = false;
            vm.neuspeh = true;
          }
        };
    
        vm.prijava = function() {
          $http({
              method: "POST",
              url: "template/php/prijava.php",
              data: "email=" + vm.email + "&password=" + vm.password,
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            })
            .then(function(res) {
              if(res.data!="!user" && res.data != "!pass") {
                $rootScope.user = res.data;
                location.reload();
              } else {
                if(res.data=="!user"){
                  vm.error="Uporabnik ne obstaja!";
                }else{
                  vm.error="Napačno geslo!"
                }
               
              }
    
            });
        };
        vm.reset = function(){
          vm.error=null;
        }
    
      });
    
      app.controller("WidgetController", function($http, $rootScope, $scope) {
        var vm = this;
    
        $http.get("template/php/widgetinit.php")
          .then(function(res2) {
            vm.widgetdata = res2.data;
            $rootScope.widgets = res2.data;
          });
    
        function updateXYpos() {
 
          $http({
              method: "POST",
              url: "template/php/widgetupdate.php",
              data: "asd=" + JSON.stringify($rootScope.widgets),
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            })
            .then(function(res) {
              if(res.data != "error") {
    
              }
            });
        }
    
        $rootScope.gridsterOpts = {
          columns: 50, // the width of the grid, in columns
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
          maxRows: 50,
          resizable: {
            enabled: false,
            handles: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],
            start: function(event, $element, widget) {
    
            }, // optional callback fired when resize is started,
            resize: function(event, $element, widget) {}, // optional callback fired when item is resized,
            stop: function(event, $element, widget) {
              updateXYpos();
            } // optional callback fired when item is finished resizing
          },
          draggable: {
            enabled: false, // whether dragging items is supported
            start: function(event, $element, widget) {
    
            }, // optional callback fired when drag is started,
            drag: function(event, $element, widget) {}, // optional callback fired when item is moved,
            stop: function(event, $element, widget) {
              updateXYpos();
            } // optional callback fired when item is finished dragging
          }
        };
      });
     
      app.controller("WeatherWidgetController", function($http, $attrs, $rootScope) {
        var vm = this;
    
        initialize($attrs.widget);
    
        function initialize(widget_id) {
          vm.id = widget_id;
    
          $http.get("template/php/widgetConfig.php?id=" + vm.id + "&test=" + $rootScope.user.id + "")
            .then(function(res) {
              vm.widgetConfig = res.data;
              vm.config = JSON.parse(vm.widgetConfig.config);
              vm.kraj = vm.config.kraj;
              $http.get("http://api.openweathermap.org/data/2.5/weather?q=" + vm.kraj + "&units=metric&APPID=7aca27cc40dfc3d5208fc94b6afda6db")
                .then(function(vreme) {
                  if(vreme.data.cod == "404") {
                    vm.mesto = "Mesto ne obstaja gtfo";
                  } else {
                    vm.vreme = vreme.data;
                    vm.mesto = vm.vreme['name'];
                    vm.temp = Math.round(vm.vreme['main']['temp']);
                    if(vm.config.enota == "kelvin") {
                      vm.temp = vm.temp + 273 + " K";
                    } else if(vm.config.enota == "fahrenheit") {
                      vm.temp = vm.temp * 9 / 5 + 32 + " °F";
                    } else {
                      vm.temp += " °C";
                    }
                    vm.stanje = vm.vreme['weather'][0]['main'];
                  }
    
                });
            });
        }
      });

      app.controller("GrafWidgetController", function($http, $rootScope,$scope,$timeout,$filter) {
        var vm = this;
        var skup=[];
       
        $http.get("template/php/getVrste.php")
        .then(function(res) {
          vm.vrste=res.data;
        });
        $http.get("template/php/getGrafMonthAndYear.php")
        .then(function(res) {
        
         
          vm.zgodovina=res.data;
        console.log(res.data);
       
        
        });
        

   

        vm.whenZgoSelected = function (){
         
          $http.get("template/php/test.php?mesec="+vm.izberiZgo.mesec_id+"&leto="+vm.izberiZgo.leto)
          .then(function(res) {
            $scope.myChartObject.options = {
              'title':"Poraba za mesec "+ vm.izberiZgo.mesec+" " + vm.izberiZgo.leto,
              
            backgroundColor: 'transparent'
              
          };
          
           
            if(res.data!="vnesi podatke"){
            $scope.myChartObject.data = res.data;
            console.log(res.data);
            }else{
              $scope.myChartObject.data = [["ni podatkov","ni podatkov"]];
            }
            
          
          
          });
        };




        $http.get("template/php/test.php")
        .then(function(res) {
        
         
          if(res.data!="vnesi podatke"){
          $scope.myChartObject.data = res.data;
          console.log(res);
          }else{
            $scope.myChartObject.data = [["ni podatkov","ni podatkov"]];
          }
          
        
        
        });
        
        
        $scope.myChartObject = {};
        
        $scope.myChartObject.type = "PieChart";
        
        $scope.onions = [
            {v: "Onions"},
            {v: 3},
        ];
    
       
        var mesec=new Date();
        var leto=new Date();
        mesec = $filter('date')( mesec,'MMMM');
        leto = $filter('date')( leto,'yyyy');
        
        $scope.myChartObject.options = {
            'title':"Poraba za mesec "+ mesec+" "+leto,
            
            backgroundColor: 'transparent'
        };
        
       
      
  
      
       
        vm.editEnabled = false;
        vm.shraniPorabo = function(choices){
          
             var poraba={};
       
                //for(var i=0;i<choices.length;i++){
                 
                  // delo[i]["delo"]=vm.choice[i];
                 //  delo[i]["cas"]=vm.choice2[i];
                 poraba.znesek=vm.znesek;
                 poraba.datum=vm.date;
                 poraba.user=$rootScope.user.id; 
                 poraba.vrsta=vm.izberiVrsto.id;
                alert(vm.znesek);
                 
            
                  // delo.push({delo:vm.choice[i],deadline:vm.choice2[i],level:1,id:vm.id})
                //}
              //  console.log(delo);
                $http({
                 method: "POST",
                 url: "template/php/addPoraba.php",
                 data: "poraba=" + JSON.stringify(poraba),
                 headers: {
                   'Content-Type': 'application/x-www-form-urlencoded'
                 }
               })
               .then(function(res) {
               
               vm.znesek="";
               vm.date="";
               vm.izberiVrsto.id="";
                $http.get("template/php/test.php")
                .then(function(res) {
                  $scope.myChartObject.data = res.data;
                  // POSODOBI PORABO
                 
                  //POSODOBI PORABO

                });
                
               });
            
        
         };
         vm.edit = function() {
          if(vm.editEnabled) {
            vm.editEnabled = false;
          } else {
            vm.editEnabled = true;
          }
        };

        vm.delPoraba = function(item){
          alert(item.id_poraba);
          $http({
           method: "POST",
           url: "template/php/deletePoraba.php",
           data: "id=" + item.id_poraba,
           headers: {
             'Content-Type': 'application/x-www-form-urlencoded'
           }
         })
         .then(function(res) {
          if(res.data==1){
            alert("uspešno");
            $http.get("template/php/getAllPoraba.php")
            .then(function(res) {
              
              console.log(res.data);
              $rootScope.poraba=res.data;
              vm.currentPage = 0;
              vm.pageSize = 3;
              vm.stevilo=[];
             
               
                vm.pages= Math.ceil($rootScope.poraba.length/vm.pageSize);  
                for(var i=0;i<vm.pages;i++){
                  vm.stevilo.push({
                   id:i,
                   text:i+1
                });        
                }         
                  
              
           
            });
          }
         });
         };

         vm.allPoraba = function(){
           
          $http.get("template/php/getAllPoraba.php")
          .then(function(res) {
            
            console.log(res.data);
            $rootScope.poraba=res.data;
            vm.currentPage = 0;
            vm.pageSize = 3;
            vm.stevilo=[];
           
             
              vm.pages= Math.ceil($rootScope.poraba.length/vm.pageSize);  
              for(var i=0;i<vm.pages;i++){
                vm.stevilo.push({
                 id:i,
                 text:i+1
              });        
              }         
                
            
         
          });
        };

      

      });

      app.controller("NoviceWidgetController", function($http, $attrs, $rootScope) {
        var vm = this;
    //api key d3a535b2afa9418b836401eb613f02e3,8fb771b1531b4b4b990a84eb12b46f0e
    https://newsapi.org/v1/articles?source=the-next-web&sortBy=latest&apiKey=d3a535b2afa9418b836401eb613f02e3
        initialize($attrs.widget);
    
        function initialize(widget_id) {
          vm.id = widget_id;
  
  
          $http.get("template/php/widgetConfig.php?id=" + vm.id + "&test=" + $rootScope.user.id + "")
            .then(function(res) {

              vm.widgetConfig = res.data;
              vm.config = JSON.parse(vm.widgetConfig.config);
              vm.datum=vm.config.date;
              vm.opis=vm.config.opis;
              vm.slika=vm.config.slika;
              vm.order=vm.config.vrstni_red;
              vm.source=vm.config.source;
              $http.get("https://newsapi.org/v1/articles?source="+vm.source+"&sortBy="+vm.order+"&apiKey=8fb771b1531b4b4b990a84eb12b46f0e")
              .then(function(res) {
              //  console.log(res.data["articles"][0]["title"]);
               
              vm.novice=res.data["articles"];
            }, function (error) {
              if(error.data["code"]=="sourceUnavailableSortedBy"){
                vm.error="Izbrana razvrstitev novic ni navoljo prosimo uredite pod Nastavitve->uredi"
              }
            
            
              });
              
             
            });
        }
      });

      app.controller("TodoWidgetController", function($http, $attrs, $rootScope,$scope,$filter,todoUntil) {
        var vm = this;
        vm.editEnabled = false;
        
        vm.id=$attrs.widget;
      //  var one_day=1000*60*60*24;
      //  var one_hour=1000*60*60;
     //   var one_minute=1000*60;
        $http.get("template/php/getTodo.php?id="+vm.id)
        .then(function(res) {
          vm.todo = res.data;
         vm.todo=todoUntil.Until(vm.todo); //service todoUntil funkcija Until
        
        });
        
      
       

        vm.edit = function() {
          if(vm.editEnabled) {
            vm.editEnabled = false;
          } else {
            vm.editEnabled = true;
          }
        }

        vm.shraniNovaDela = function(choices){
         
            var delo={};
      
               //for(var i=0;i<choices.length;i++){
                
                 // delo[i]["delo"]=vm.choice[i];
                //  delo[i]["cas"]=vm.choice2[i];
                delo.delo=vm.name;
                delo.deadline=vm.date;
                delo.id=vm.id; 
                delo.level=vm.level;
                 // delo.push({delo:vm.choice[i],deadline:vm.choice2[i],level:1,id:vm.id})
               //}
             //  console.log(delo);
               $http({
                method: "POST",
                url: "template/php/addTodo.php",
                data: "delo=" + JSON.stringify(delo),
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                }
              })
              .then(function(res) {


                $http.get("template/php/getTodo.php?id="+vm.id)
                .then(function(res) {
                  vm.todo = res.data;
                  vm.name = null;
                  vm.date = null;
                  vm.id=$attrs.widget;
                
                    vm.todo = res.data;
                    vm.todo=todoUntil.Until(vm.todo);
                }); //good old copy paste
      
              });
           
       
        };
        vm.deleteTodo = function (todo) {

        $http({
            method: "POST",
            url: "template/php/deleteTodo.php",
            data: "id=" + todo.id_todo,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          })
          .then(function (res) {
            $http.get("template/php/getTodo.php?id=" + vm.id)
              .then(function (res) {
                vm.todo = res.data;
                vm.name = null;
                vm.date = null;
                vm.todo=todoUntil.Until(vm.todo);
              }); //good old copy paste
          });
        };

        vm.doneTodo = function (todo) {
          
                  $http({
                      method: "POST",
                      url: "template/php/doneTodo.php",
                      data: "id=" + todo.id_todo,
                      headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                      }
                    })
                    .then(function (res) {
                      $http.get("template/php/getTodo.php?id=" + vm.id)
                        .then(function (res) {
                          vm.todo = res.data;
                          vm.name = null;
                          vm.date = null;
                          vm.todo=todoUntil.Until(vm.todo);
                        }); //good old copy paste
                    });
                  };


        });
        app.controller("EventWidgetController", function($http, $attrs, $rootScope,$scope,$filter,todoUntil) {

          var vm = this;
          vm.editEnabled = false;
          
          vm.id=$attrs.widget;
          var mesec=new Date();
          mesec = $filter('date')( mesec,'MM');
     
          $http.get("template/php/getDogodki.php?id="+vm.id+"&mesec="+mesec)
          .then(function(res) {
            vm.dogodki = res.data;
         
          
          });
          
        
         
  
          vm.edit = function() {
            if(vm.editEnabled) {
              vm.editEnabled = false;
            } else {
              vm.editEnabled = true;
            }
          }
  
          vm.shraniDogodek = function(dogodek){
           
              var dogodek={};
        
                 //for(var i=0;i<choices.length;i++){
                  
                   // delo[i]["delo"]=vm.choice[i];
                  //  delo[i]["cas"]=vm.choice2[i];
                  dogodek.title=vm.title;
                  dogodek.opis=vm.opis;
                  dogodek.id=vm.id; 
                  dogodek.start=vm.start; 
             
                   // delo.push({delo:vm.choice[i],deadline:vm.choice2[i],level:1,id:vm.id})
                 //}
               //  console.log(delo);
               
                 $http({
                  method: "POST",
                  url: "template/php/addDogodek.php",
                  data: "dogodek=" + JSON.stringify(dogodek),
                  headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                  }
                })
                .then(function(res) {
                  
  
                  $http.get("template/php/getDogodki.php?id="+vm.id+"&mesec="+mesec)
                  .then(function(res) {
                    vm.dogodki = res.data;
                    dogodek.title=null;
                    dogodek.opis=null;
                  
                    dogodek.start=null; 

                  }); //good old copy paste
                  
        
                });
                
             
         
          };
          vm.deleteDogodek = function (todo) {
  /*
          $http({
              method: "POST",
              url: "template/php/deleteDogodek.php",
              data: "id=" + dogodek.id,
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            })
            .then(function (res) {
              $http.get("template/php/getDogodki.php?id="+vm.id+"&mesec"+mesec)
              .then(function(res) {
                vm.dogodki = res.data;
                dogodek.title=null;
                dogodek.opis=null;
                dogodek.kraj=null;
                dogodek.start=null; 
                dogodek.length=null;
               
              }); //good old copy paste
            });*/
          };
  
     
  
  
          });
          
        
     
    
      app.controller("NastavitveController", function($http, $rootScope, $timeout,$filter) {
        var vm = this;
        vm.buttonName = "Odkleni polje";
        vm.widgetTypes = [];
    
        initialize();
    
        function initialize() {
    
          $http.get("template/php/listWidgetTypes.php")
            .then(function(res) {
              vm.widgetTypes = res.data;
           //   console.log(res.data);
         
            });
    
        }
    
        vm.loadWidgetOptions = function(item) {
    
          vm.widgetTypes.forEach(function(el) {
            el.selected = false;
            vm.name = null;
          });
    
          item.selected = true;
        };
    
        vm.submitWidgetAdd = function(item) {
          var widget = {};
    
          var config = {};
          item.options.forEach(function(el) {
            config[el.field] = vm.options[el.field];
          });
    
          widget.config = JSON.stringify(config);
          widget.posX = 0;
          widget.posY = 0;
          widget.x = 10;
          widget.y = 10;
          widget.active = 1;
          widget.user = $rootScope.user.id;
          widget.widget_type = item.id;
          widget.imeWidget = vm.name;
    
          $http({
              method: "POST",
              url: "template/php/addWidget.php",
              data: "asd=" + JSON.stringify(widget),
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            })
            .then(function(res) {
              $http.get("template/php/widgetinit.php")
                .then(function(res2) {
                  $rootScope.widgets = res2.data;
                });
    
            });
    
        };
    
        vm.loadWidgetSettings = function(item) {
    
          $rootScope.widgets.forEach(function(el) {
            el.selected = false;
          });
          item.selected = true;
          console.log($rootScope.widgets);
        };
    
        vm.updateWidgetConfig = function(item) {
          var widget = {};
    
          var config = {};
          for(var key in item.config) {
            config[key] = vm.options2[key];
          }
    
          widget.config = JSON.stringify(config);
          widget.imeWidget = vm.updateName;
          widget.id_widget = item.id_widget;
    
          $http({
              method: "POST",
              url: "template/php/updateWidgetConfig.php",
              data: "asd=" + JSON.stringify(widget),
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            })
            .then(function(res) {
              $http.get("template/php/widgetinit.php")
                .then(function(res2) {
                  $rootScope.widgets = res2.data;
                  location.reload();
                });
            });
        };
        vm.deleteWidget = function(item) {

          if(confirm("Are you sure?")) {
    
            $http({
                method: "POST",
                url: "template/php/deleteWidget.php",
                data: "id=" + item.id_widget + "&type=" + item.widget_type,
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                }
              })
              .then(function(res) {
              
                if(res) {
                  vm.ifDelete = "uspešno";
                  $http.get("template/php/widgetinit.php")
                    .then(function(res2) {
                      $rootScope.widgets = res2.data;
                    });
                  $timeout(function() {
                    vm.ifDelete = "";
                  }, 2000);
                }else{
                  vm.ifDelete="Ta widget ima narejene todo";
                }
              });
          }
        };
        vm.reset = function(){


          $http({
            method: "POST",
            url: "template/php/resetPoraba.php",
            data: "id=" + $rootScope.user.id,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          })
          .then(function(res) {
          alert(res.data);

          location.reload();


          //  alert("Podatki so bili uspešno izbrisani!");
          });

      

        };
 
        
        

    
    
        vm.test = function() {
          if($rootScope.gridsterOpts.draggable.enabled == true) {
            $rootScope.gridsterOpts.draggable.enabled = false;
            $rootScope.gridsterOpts.resizable.enabled = false;
            vm.buttonName = "Odkleni polje";
          } else {
            $rootScope.gridsterOpts.draggable.enabled = true;
            $rootScope.gridsterOpts.resizable.enabled = true;
            vm.buttonName = "Zakleni polje";
          }
        };
        vm.buttonClass = function() {
          if(vm.buttonName == "Odkleni polje") {
            return 'btn-success';
          } else {
            return 'btn-danger';
          }
        }
    
        vm.prikaziskrij = function(item) {
          if(item.active == 1) {
            item.active = 0;
          } else {
            item.active = 1;
          }
          $http({
              method: "POST",
              url: "template/php/widgetVisUpdate.php",
              data: "id=" + item.id_widget + "&active=" + item.active,
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            })
            .then(function(res) {
              if(res.data != "error") {
    
              }
            });
        }
    
        vm.odjava = function() {
          $http.get("template/php/odjava.php")
            .then(function(res) {
              $rootScope.user = null;
              $rootScope.widgets = null;
              location.reload();
    
            });
        }
    
      });
    
      app.directive('dynamicController', ['$controller', function($controller) {
        return {
          restrict: 'A',
          scope: true,
          link: function(scope, elem, attrs) {
            attrs.$observe('dynamicController', function(name) {
              if(name) {
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
    
    })();