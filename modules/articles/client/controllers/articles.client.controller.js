'use strict';

// Articles controller
angular.module('articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Articles',
  function ($scope, $stateParams, $location, Authentication, Articles) {
    $scope.authentication = Authentication;

      // on user inputs
    $scope.similarQues = function(query) {
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200){
          var res_data = []; 
          var response_text = xmlHttp.responseText;
          var answer = JSON.parse(response_text);
          $scope.answer = answer.answer;
          for(var i=0, len=$scope.answer.length; i<len; i++){ 
            var item = {};
            item.name = $scope.answer[i];
            res_data.push(item);
          }
          $scope.categories = res_data;
        }
      };
      //var url = 'https://nameless-badlands-89767.herokuapp.com/nlp/qa?almodel=0&code=0&query=' + $scope.search;
      var url = 'padl.paic.com.cn/app/xiaoan/nlp/qa?almodel=0&code=0&query=' + $scope.search;
      xmlHttp.open('GET', url, true); // true for asynchronous 
      xmlHttp.send(null);
    };

    function arrayObjectIndexOf(myArray, searchTerm) {
      for(var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i] === searchTerm) return i;
      }
      return -1;
    }


    $scope.searchStanQuestion = function(standard_question, m, l) {
      var idx = arrayObjectIndexOf($scope.answer, l);
      var url = 'padl.paic.com.cn/app/xiaoan/nlp/qa?almodel=0&code=1&query=' + idx;
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200){
          var res_data = []; 
          var response_text = xmlHttp.responseText;
          var answer = JSON.parse(response_text);
          answer = answer.answer;
          $scope.standard_answer = answer;
          $scope.$apply();
        }
      }; 
      xmlHttp.open('GET', url, true); // true for asynchronous 
      xmlHttp.send(null);
    };



    $scope.customQues = function(custom_question) {
      var url = '';
      if(document.getElementByName("algorithm").value === 'index'){
        url = 'padl.paic.com.cn/app/xiaoan/nlp/qa?almodel=0&code=2&query=' + $scope.search;
      }
      else{
        url = 'padl.paic.com.cn/app/xiaoan/nlp/qa?almodel=1&code=2&query=' + $scope.search;
      }
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200){
          var res_data = []; 
          var response_text = xmlHttp.responseText;
          var answer = JSON.parse(response_text);
          answer = answer.answer;
          $scope.standard_answer = answer;
          $scope.$apply();
        }
      }; 
      xmlHttp.open('GET', url, true); // true for asynchronous 
      xmlHttp.send(null);
    };

    // Create new Article
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'articleForm');

        return false;
      }

      // Create new Article object
      var article = new Articles({
        title: this.title,
        content: this.content
      });

      // Redirect after save
      article.$save(function (response) {
        $location.path('articles/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Article
    $scope.remove = function (article) {
      if (article) {
        article.$remove();

        for (var i in $scope.articles) {
          if ($scope.articles[i] === article) {
            $scope.articles.splice(i, 1);
          }
        }
      } else {
        $scope.article.$remove(function () {
          $location.path('articles');
        });
      }
    };

    // Update existing Article
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'articleForm');

        return false;
      }

      var article = $scope.article;

      article.$update(function () {
        $location.path('articles/' + article._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Articles
    $scope.find = function () {
      $scope.articles = Articles.query();
    };

    // Find existing Article
    $scope.findOne = function () {
      $scope.article = Articles.get({
        articleId: $stateParams.articleId
      });
    };
  }
]);
