# Angular Acestudio Redux

#### Something like Redux and Flux, without ES6
Something like Redux, when we have one store for application, when data changing only copy of store and data changing by action
##[DEMO](https://plnkr.co/IsxJ8g6u7S5cfYkYlsEH)

## Building Angular Acestudio Redux


1. Install [NodeJS](http://nodejs.org/).
2. Install [Bower](http://bower.io/) globally (`npm install -g bower`).
3. Install `bower install acestudio-redux --save`.

##Examples

###Set debug flag by provider for watch log messages in console
```javascript
var app = angular.module('acereduxExample', ['acestudio-redux']);

app.config(['acestudioReduxProvider', function(acestudioReduxProvider) {

  acestudioReduxProvider.setDebug(true);
}]);
```


###Define RootController
```javascript

app.controller('HeadController', HeadController);

HeadController.$inject = ['$scope', 'aceredux'];

function HeadController($scope, aceredux) {

  var storeName = 'HeadOrRootStore';

  var reducers = {
    setPageTitle: 'pageTitle',
    setPageDescription: 'pageDescription'
  };
  var markLikeRootStore = true;

  $scope.store = {
    mainProperty: 'this property you could get in some controller by ace.get("mainProperty", "HeadOrRootStore")'
  };

  var ace = aceredux(storeName, reducers, $scope, markLikeRootStore);

}


```



###Define some controller
```javascript

app.controller('MyController', MyController);

MyController.$inject = ['$scope', 'aceredux'];

function MyController($scope, aceredux) {

  $scope.store = {
    age: 26,
    sex: 'Male',
    firstname: '',
    lastname: '',
    fullname: ''
  };

  var storeName = 'MyStore';

  var reducers = {
    setFullname: 'fullname',
    setFullname2: function(copyOfStore, newValue) {
      copyOfStore.fullname = newValue;
      return copyOfStore;
    }
  };

  var ace = aceredux(storeName, reducers, $scope);


  $scope.makeFullname = function() {
    ace.$d('setFullname', $scope.store.firstname + ' ' + $scope.store.lastname);
  };

  $scope.makeFullname2 = function() {
    ace.$d('setFullname2', $scope.store.firstname + ' ' + $scope.store.lastname);
  };

  $scope.getSomePropertyFromSomeStore = function() {
    alert(ace.get('mainProperty', 'HeadOrRootStore'));
  };

  $scope.callReducerFromSomeStore = function() {
    ace.$d('setPageTitle', 'I am RootController', 'HeadOrRootStore');
  };

  $scope.callUndefinedReducer = function() {
    //call reducer which undefined in current store, then it will try call this reducer in rootStore.
    ace.$d('setPageDescription', 'I am RootController description');
  };
  $scope.watchGlobalStore = function() {
    //call reducer which undefined in current store, then it will try call this reducer in rootStore.
    $scope.globstore = JSON.stringify(window.acestudioReduxGlobalStore, null, '\t');
  }
}

```

###Template
```html
<!DOCTYPE html>
<html>

  <head>
    <link data-require="bootstrap-css@3.3.6" data-semver="3.3.6" rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.css" />
    <script data-require="lodash.js@4.6.1" data-semver="4.6.1" src="https://cdn.jsdelivr.net/lodash/4.6.1/lodash.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.3/angular.min.js"></script>
   <script src="https://rawgit.com/ClockwiseSoftware/acestudio-redux/master/acestudio-redux.js"></script>
    <link rel="stylesheet" href="style.css" />
    <script src="script.js"></script>
  </head>

  <body ng-app="acereduxExample" ng-controller="HeadController">
    <h1>Hello Angular Acestudio Redux!</h1>
    MainProperty: {{store.mainProperty}} <br>
    Title: {{store.pageTitle}} <br>
    Desc: {{store.pageDescription}}
    <div ng-controller="MyController">
    <input class="form-control" placeholder="firstname" ng-model="store.firstname" type="text" />
    <br/>
    <input class="form-control" placeholder="lastname"  ng-model="store.lastname" type="text" />
    <br/>
    <button class="btn btn-success" ng-click="makeFullname()">make fullname and save in store</button>
    <button class="btn btn-warning"  ng-click="makeFullname2()">make fullname and save in store using reducer function declaration</button>
    <button class="btn btn-warning"  ng-click="callReducerFromSomeStore()">callReducerFromSomeStore</button>
    <button class="btn btn-warning"  ng-click="callUndefinedReducer()">callUndefinedReducer</button>
    <button class="btn btn-warning"  ng-click="watchGlobalStore()">watchGlobalStore</button>
    <br/>
    <br/>
    I am {{store.fullname}}, my age - {{store.age}}  Sex: {{store.sex}}

    GlobalStore: <br>
   <pre> {{globstore}}</pre>
  </div>

  </body>

</html>

```

## License

The MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
