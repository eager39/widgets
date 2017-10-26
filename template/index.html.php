<?php $title="Očistimo Slovenijo" ; ?><?php ob_start(); ?>
<!DOCTYPE html>
<html>
<head>
    <title></title>
</head>
<body>
    <div class="container">
      <!-- Static navbar -->
      <nav class="navbar navbar-default">
        <div class="container-fluid">
          <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
              <span class="sr-only">Toggle navigation</span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="?stran=index">Dashboard</a>
          </div>
          <div id="navbar" class="navbar-collapse collapse">
            <ul class="nav navbar-nav">
              <li class="active"><a href="#">Home</a></li>
              <li><a href="#">About</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
            <ul class="nav navbar-nav navbar-right" ng-controller="NastavitveController as vm">
            <li>
                <a data-target="#nastavitveModal" data-toggle="modal" href="#" ng-click="vm.prikaziWidNast()"><i class="glyphicon glyphicon-cog"></i> Nastavitve</a>
            </li>
            <li ng-if="user"><span class="menu-item"><i class="glyphicon glyphicon-user"></i> {{user.user}}</span></li>
            <li ng-if="user">
                <a href="#" ng-click="vm.odjava()">Odjava</a>
            </li>
            <li ng-if="!user">
                <a data-target="#regLog" data-toggle="modal" href="#"><i class="glyphicon glyphicon-user"></i> Prijava</a>
            </li>
        </ul>
          </div><!--/.nav-collapse -->
        </div><!--/.container-fluid -->
      </nav>

    </div> 




    <div ng-controller="WidgetController as vm">
        <div gridster="gridsterOpts">
            
                <li col="item.position[1]" dynamic-controller="{{item.controller}} as vm" gridster-item="" ng-hide="item.active == 0" ng-include='item.template' ng-repeat="item in widgets track by $index" row="item.position[0]" size-x="item.size.x" size-y="item.size.y" widget="{{item.id_widget}}"></li>
           
        </div>
    </div><!-- konec polja -->
    <div class="container">
        <!-- Modal -->
        <div class="modal fade" id="nastavitveModal" role="dialog">
            <div class="modal-dialog modal-lg">
                <!-- Modal content-->
                <div class="modal-content">
                    <div class="modal-header">
                        <button class="close" data-dismiss="modal" type="button">&times;</button>
                        <h4 class="modal-title"><i class="glyphicon glyphicon-wrench"></i> Nastavitve ploščic</h4>
                    </div>
                    <div class="modal-body">
                        <!-- NASTAVITVE CONTENT -->
                        <ul class="nav nav-tabs">
                            <li class="active">
                                <a data-toggle="tab" href="#splosnoTab">Splošno</a>
                            </li>
                            <li>
                                <a data-toggle="tab" href="#dodajTab">Dodaj</a>
                            </li>
                            <li>
                                <a data-toggle="tab" href="#vremeTab">Uredi</a>
                            </li>
                            <li>
                                <a data-toggle="tab" href="#PorabaTab">Poraba</a>
                            </li>
                        </ul>
                        <div class="tab-content" ng-controller="NastavitveController as vm">
                            <div class="tab-pane fade in active" id="splosnoTab">
                                <div class="splosnoCon">
                                    <h1 ng-if="widgets.length == 0">DODAJ WIDGETE</h1>
                                    <h1 ng-if="widgets.length &gt; 0">Skrij/Pokaži</h1>
                                    <ul class="list-group" ng-repeat="item in widgets track by $index">
                                        <li class="list-group-item" ng-class="{'list-group-item-success':item.active == 1,'list-group-item-danger':item.active == 0}"><label class="widgetLab"><span aria-hidden="true" class="glyphicon glyphicon-eye-close" ng-if="item.active == 0 ? true : false"></span> <span aria-hidden="true" class="glyphicon glyphicon-eye-open" ng-if="item.active == 1 ? true : false"></span> <input class="skrijCh" data-toggle="toggle" ng-checked="item.active == 0 ? true : false" ng-click="vm.prikaziskrij(item)" type="checkbox"> {{item.ImeWidget}}</label></li>
                                    </ul><button class="btn" data-placement="right" data-toggle="tooltip" ng-class="vm.buttonClass()" ng-click="vm.test();" ng-if="widgets.length &gt; 0" title="Omogoči premikanje in spremembo velikosti!" type="button">{{vm.buttonName}}</button>
                                </div>
                            </div><!--
                <div ng-repeat="item in widgets">
                  <label class="widgetLab" ng-class="{'skrito': item.active == 0,'pokazano':item.active == 1}">
                    <span ng-if="item.active == 0 ? true : false" class="glyphicon glyphicon-eye-close" aria-hidden="true"></span>
                    <span ng-if="item.active == 1 ? true : false" class="glyphicon glyphicon-eye-open" aria-hidden="true"></span>
                    <input class="skrijCh" type="checkbox" data-toggle="toggle" ng-click="vm.prikaziskrij(item)" ng-checked="item.active == 0 ? true : false" /> {{item.ImeWidget}}
                  </label>
                </div>
              </div>
              <button ng-if="widgets.length > 0" ng-click="vm.test();" data-toggle="tooltip" ng-class="vm.buttonClass()" title="Omogoči premikanje in spremembo velikosti!" data-placement="right" type="button" class="btn">{{vm.buttonName}}</button>
            </div>-->
                            <div class="tab-pane fade" id="dodajTab" style="padding-top:15px">
                                <div class="panel" ng-class="{'panel-success': item.selected, 'panel-default': !item.selected}" ng-repeat="item in vm.widgetTypes">
                                    <div class="panel-heading" ng-click="vm.loadWidgetOptions(item)">
                                        <h3 class="panel-title">{{item.name}}</h3>
                                    </div>
                                    <div class="panel-body">
                                        {{item.description}}
                                        <div ng-if="item.selected" style="padding-top:10px;">
                                            <form id="dodajWidgetForm" name="dodajWidgetForm">
                                                <div class="form-group">
                                                    <label>Ime widgeta</label> <input class="form-control" ng-model="vm.name" required="" type="text">
                                                </div>
                                                <div ng-repeat="option in item.options | unique:'field'">
                                                    <div ng-if="option.inputType == 'text'">
                                                        <div class="form-group">
                                                            <label>{{option.name}}</label> <input class="form-control" ng-model="vm.options[option.field]" required="" type="text">
                                                        </div>
                                                    </div>
                                                  
                                                    <div class="form-group" ng-if="option.inputType == 'dropdown'">
                                                        <label>{{option.name}}</label> <select class="form-control" ng-init="vm.options[option.field] = option.dropdownOptions[0].option" ng-model="vm.options[option.field]">
                                                            <option ng-repeat="opt in option.dropdownOptions" value="{{opt.option}}">
                                                                {{opt.name}}
                                                            </option>
                                                        </select>
                                                    </div>
                                                    <div class="form-group" ng-if="option.inputType == 'dropdown_news'" ng-repeat="opt in option.dropdownOptions" ng-show="!$first">
                                                        <label>{{option.name}}</label> <select class="form-control" ng-init="vm.options[option.field] = opt.source_option[0].id_source" ng-model="vm.options[option.field]">
                                                            <optgroup label="{{opt1.name}}" ng-repeat="opt1 in opt.source_option | unique:'typeName'">
                                                                <option ng-repeat="opt in opt.source_option | filter:{typeName:opt1.typeName}" value="{{opt.id_source}}">
                                                                    {{opt.sourceName}}
                                                                </option>
                                                            </optgroup>
                                                        </select>
                                                    </div>
                                                    <div class="list-group" id="list1" ng-if="option.inputType=='boolean'" ng-show="$last">
                                                        <a class="list-group-item active" href="#">Izberi:</a> <label class="list-group-item" ng-if="option.inputType=='boolean'" ng-repeat="option in item.options | unique:'field'">{{option.name}}<input class="all pull-right" ng-init="vm.options[option.field] = false" ng-model="vm.options[option.field]" title="toggle all" type="checkbox"></label>
                                                    </div>
                                                </div><!--
                        <div class="form-group" ng-if="option.inputType == 'boolean'">
                          <label>{{option.name}}</label>
                          <input type="checkbox"  ng-init="vm.options[option.field] = false" ng-model="vm.options[option.field]"  />
                        </div>-->
                                                <button class="btn btn-success" ng-click="vm.submitWidgetAdd(item)" ng-disabled="!dodajWidgetForm.$valid">Add</button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div><!-- defaulkt
                        <div ng-repeat="item in vm.widgetTypes" ng-click="vm.loadWidgetOptions(item)">
                          <h1>{{item.name}}</h1>
                          <div ng-if="item.selected">
                            <form name="dodajWidgetForm">
                              <div class="form-group">
                                <label> Ime widgeta </label><input required class="form-control" type="text" ng-model="vm.name" />
                              </div>
                              <div ng-repeat="option in item.options">
                                <div ng-if="option.inputType == 'text'">
                                  <div class="form-group">
                                    <label>  {{option.name}}</label>
                                    <input required class="form-control" type="text" ng-model="vm.options[option.field]"/>
                                  </div>
                                </div>
                                <div ng-if="option.inputType == 'boolean'">
                                  <label>{{option.name}}</label>
                                  <input type="checkbox" class="form-group" ng-init="vm.options[option.field] = false" ng-model="vm.options[option.field]"/>
                                </div>
                                <div class="form-group" ng-if="option.inputType == 'dropdown'">
                                <label>{{option.name}}</label>
                                  <select ng-model="vm.options[option.field]" class="form-control" ng-init="vm.options[option.field] = option.dropdownOptions[0].option">
                                      <option ng-repeat="opt in option.dropdownOptions" value="{{opt.option}}">{{opt.name}}</option>
                                    </select>
                                   
                                </div>
                              </div>
                              <button ng-disabled="!dodajWidgetForm.$dirty" ng-click="vm.submitWidgetAdd(item)" class="btn btn-success">Add</button>
                            </form>
                          </div>
                        </div>
                        </div>
                        </div>-->
                            <div class="tab-pane fade" id="vremeTab">
                            {{vm.ifDelete}}
                                <div class="panel" ng-class="{'panel-success': item.selected, 'panel-default': !item.selected}" ng-click="vm.loadWidgetSettings(item)" ng-repeat="item in widgets track by $index">
                                    <div class="panel-heading">
                                        <h3 class="panel-title">{{item.ImeWidget}}<span  class="glyphicon glyphicon-trash" ng-click="vm.deleteWidget(item);"></span><span class="glyphicon glyphicon-edit" ng-click="vm.loadWidgetSettings(item)"></span></h3>
                                    </div>
                                    <div class="panel-body" ng-if="item.selected">
                                        <form id="updateForm" name="updateForm">
                                            <div class="form-group">
                                                <label>Ime pripomočka</label> <input class="form-control" ng-init="vm.updateName = item.ImeWidget" ng-model="vm.updateName">
                                            </div>
                                            <div ng-repeat="(key,value) in item.config">
                                                <div class="form-group" ng-if="value.inputType == 'text'">
                                                    <label>{{value.name}}</label> <input class="form-control" ng-init="vm.options2[value.field] = value.value" ng-model="vm.options2[value.field]" type="text" value="">
                                                </div>

                                               
                                                <div class="form-group" ng-if="value.inputType == 'dropdown'">
                                                    <label>{{value.name}}</label> <select class="form-control" ng-init="vm.options2[value.field] = value.value" ng-model="vm.options2[value.field]">
                                                        <option ng-repeat="opt in value.options" value="{{opt.option}}">
                                                            {{opt.name}}
                                                        </option>
                                                    </select>
                                                </div>
                                                <div class="form-group" ng-if="value.inputType == 'boolean'">
                                                    <input ng-init="vm.options2[value.field] = value.value" ng-model="vm.options2[value.field]" type="checkbox"> <label>{{value.name}}</label>
                                                </div>
                                                <div class="form-group" ng-if="value.inputType == 'dropdown_news'">
                                                    <label>{{value.name}}</label> <select class="form-control" ng-init="vm.options2[value.field] =value.value" ng-model="vm.options2[value.field]">
                                                        <optgroup label="{{opt1.name}}" ng-repeat="opt1 in value.source_option | unique:'typeName'">
                                                            <option ng-repeat="opt in value.source_option | filter:{typeName:opt1.typeName}" value="{{opt.id_source}}">
                                                                {{opt.sourceName}}
                                                            </option>
                                                        </optgroup>
                                                    </select>
                                                </div>
                                                <div ng-if="item.widget_type==9">
                                               <button class="btn btn-success" ng-click="vm.reset()" >reset</button>
                                                </div>
                                            </div><button class="btn btn-success" ng-click="vm.updateWidgetConfig(item)" ng-disabled="updateForm.$pristine">Posodobi</button>
                                        </form>
                                    </div>
                                </div>
                            </div><!--

              <div  ng-repeat="item in widgets" ng-click="vm.loadWidgetSettings(item)">
                <h1>{{item.ImeWidget}}<span ng-click="vm.deleteWidget(item);" class="glyphicon glyphicon-trash"></span></h1>

                <div ng-if="item.selected">
                  <form name="updateForm">
                    ImeWidget
                    <input ng-model="vm.updateName" ng-init="vm.updateName = item.ImeWidget" />
                    <div ng-repeat="(key,value) in item.config">
                      <div ng-if="value.inputType == 'text'">
                        {{key}}
                        <input ng-model="vm.options2[value.field]" ng-init="vm.options2[value.field] = value.value" type="text" value="" />
                      </div>
                      <div ng-if="value.inputType == 'dropdown'">
                        <select ng-model="vm.options2[value.field]" ng-init="vm.options2[value.field] = value.value">
                          <option ng-repeat="opt in value.options" value="{{opt.option}}">{{opt.name}}</option>
                        </select>
                      </div>
                      <div ng-if="value.inputType == 'boolean'">
                        <input type="checkbox" ng-init="vm.options2[value.field] = value.value" ng-model="vm.options2[value.field]" />
                        <label>{{value.name}}</label>
                      </div>
                    </div>
                    <button ng-disabled="updateForm.$pristine" ng-click="vm.updateWidgetConfig(item)" class="btn btn-success">Posodobi</button>
                  </form>
                </div>
              </div>
              <h1 ng-if="vm.ifDelete"> Widget je bil uspešno odstranjen!</h1>
            </div>
-->
                            <div class="tab-pane fade" id="PorabaTab" ng-init="vm.allPoraba()">
                            <ul class="list-group" >
                                <li class="list-group-item" ng-repeat="item in poraba  | limitTo:vm.pageSize:vm.currentPage*vm.pageSize">Znesek: {{item.znesek}} Datum: {{item.datum}} Vrsta:{{item.ime_vrste}}<span ng-click="vm.delPoraba(item)">DELETE</span></li>
                            </ul>

               

    <ul class="pagination">
  <li ng-repeat="item in vm.stevilo"><a ng-click="vm.currentPage=item.id"  href="#">{{item.text}}</a></li>
</ul>




                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-default" data-dismiss="modal" type="button">Zapri</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="container">
        <!-- Modal PRIJAVA / REGISTRACIJA -->
        <div class="modal fade" data-backdrop="static" data-keyboard="false" id="regLog" ng-controller="LoginRegisterController as vm" role="dialog">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-body">
                        <!-- MODAL CONTENT -->
                        <ul class="nav nav-tabs">
                            <li class="active">
                                <a data-toggle="tab" href="#tab-prijava" id="prijavaTab">Prijava</a>
                            </li>
                            <li>
                                <a data-toggle="tab" href="#tab-regis">Registracija</a>
                            </li>
                        </ul>
                        <div class="tab-content">
                            <div class="tab-pane fade in active" id="tab-prijava">
                                <!-- PRIJAVA PRIJAVA PRIJAVA PRIJAVA -->
                                <div class="modalCon">
                                    <form class="form-horizontal" id="prijava" name="prijava" ng-submit="vm.prijava()" role="form">
                                        <div class="form-group">
                                            <label class="control-label col-sm-3" for="email">E-Pošta:</label>
                                            <div class="col-sm-8">
                                                <input class="form-control" name="email" ng-change="vm.reset()" ng-model="vm.email" placeholder="Vnesi elektronski naslov" required="" type="email">
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label class="control-label col-sm-3" for="pwd">Geslo:</label>
                                            <div class="col-sm-8">
                                                <input class="form-control" name="password" ng-change="vm.reset()" ng-model="vm.password" placeholder="Vnesi geslo" required="" type="password">
                                            </div>
                                        </div>
                                        <div class="alert alert-danger" ng-if="vm.error">
                                            {{vm.error}}
                                        </div>
                                        <div class="alert alert-success" id="uspesnoReg" style="display:none;">
                                            Registracija je bila uspešna! Zdaj se lahko prijavite.
                                        </div>
                                      
                                        <div class="modal-footer">
                                        <div
                                       
                                        vc-recaptcha
                                        key="'6LdW2jUUAAAAAJZxrQHMJiIYot5ge4La96eZIoxn'"
                                        ng-model="vm.captchaRes"
                                        on-create="setWidgetId(widgetId)"
                                        
                                    ></div>
                                            <button class="btn btn-default" ng-disabled="vm.error || prijava.$invalid" type="submit">Prijava</button>
                                        </div>
                                      
                                    </form>
                                </div><!-- KONEC TAB PRIJAVA -->
                            </div>
                            <div class="tab-pane fade" id="tab-regis">
                                <!-- TAB REGISTRACIJA -->
                                <div class="modalCon">
                                    <form class="form-horizontal" id="register" name="regForm" ng-submit="vm.registracija()" role="form">
                                        <div class="form-group" ng-class="{'has-error has-feedback': regForm.userEmail.$invalid && regForm.userEmail.$dirty, 'has-success has-feedback': regForm.userEmail.$valid}">
                                            <label class="control-label col-sm-3" for="email">E-Pošta:</label>
                                            <div class="col-sm-8">
                                                <input class="form-control" id="email2" name="userEmail" ng-change="vm.checkpass()" ng-model="vm.email" placeholder="Vnesi elektronski naslov" required="" type="email">
                                                <div ng-if="regForm.userEmail.$dirty" ng-messages="regForm.userEmail.$error">
                                                    <div ng-message="required">
                                                        Elektronski naslov je obvezen!
                                                    </div>
                                                    <div ng-message="email">
                                                        Prosim popravite vaš naslov!
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-group" ng-class="{'has-error has-feedback': regForm.newPassword.$invalid && regForm.newPassword.$dirty, 'has-success has-feedback': regForm.newPassword.$valid}">
                                            <label class="control-label col-sm-3" for="pwd">Geslo:</label>
                                            <div class="col-sm-8">
                                                <input class="form-control" id="pwd1" name="newPassword" ng-change="vm.checkpass()" ng-minlength="3" ng-model="vm.newPass" placeholder="Vnesi geslo" required="" type="password">
                                                <div ng-if="regForm.newPassword.$dirty" ng-messages="regForm.newPassword.$error">
                                                    <div ng-message="minlength">
                                                        Vnesite vsaj 8 znakov
                                                    </div>
                                                    <div ng-message="required">
                                                        Geslo je obvezno!
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-group" ng-class="{'has-error has-feedback':vm.newPass != vm.confPass, 'has-success has-feedback': vm.newPass == vm.confPass && regForm.confirmPassword.$valid}">
                                            <label class="control-label col-sm-3" for="pwd">Ponovite geslo:</label>
                                            <div class="col-sm-8">
                                                <input class="form-control" id="pwd2" name="confirmPassword" ng-change="vm.checkpass()" ng-minlength="3" ng-model="vm.confPass" placeholder="Ponovite geslo" required="" type="password">
                                                <div ng-messages="regForm.confirmPassword.$error">
                                                    <div ng-if="vm.newPass!=vm.confPass">
                                                        Gesli se ne ujemata!
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="alert alert-danger" ng-if="vm.error">
                                            {{vm.error}}
                                        </div>
                                        <div class="alert alert-danger" id="regNapaka" ng-show="vm.neuspeh">
                                            {{vm.neuspeh}}
                                        </div>
                                        <div class="alert alert-success" id="uspesnoReg" ng-show="vm.uspeh">
                                            Registracija je bila uspešna! Zdaj se lahko prijavite.
                                        </div>
                                        <div class="modal-footer">
                                        <div
                                       
                                        vc-recaptcha
                                        key="'6LdW2jUUAAAAAJZxrQHMJiIYot5ge4La96eZIoxn'"
                                        ng-model="vm.captchaRes2"
                                        on-create="setWidgetId(widgetId)"
                                        
                                    ></div>
                                            <button class="btn btn-default" ng-disabled="regForm.$invalid || vm.nomatch || vm.neuspeh" type="submit">Registracija</button>
                                        </div>
                                    </form>
                                </div><!-- KONEC TAB REGISTRACIJA -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div><?php $content=ob_get_clean() ?><?php require 'template/layout.html.php' ?>
</body>
</html>