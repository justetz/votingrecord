var URL = 'https://spreadsheets.google.com/feeds/cells/1GdBFj_y4QXNt8H_ayvtBd9MBGoB9Unne7H9rwcHlRbE/od6/public/values?alt=json';
var MAPPINGS = {
  1: 'date',
  2: 'type',
  3: 'vote',
  4: 'decision',
  5: 'count'
}

var app = angular.module('votingRecord', []);

app.controller('MainController', ['$scope', '$http', function ($scope, $http) {
  var load = function() {
    $http.get(URL).then(function (response) {

      console.log(response.data.feed.entry);
      $scope.votes = [];

      var flatData = response.data.feed.entry;
      for(var i = 0; i < flatData.length; i++) {
        var cell = flatData[i]['gs$cell'];

        if(cell['row'] === '1')
          continue;

        if(cell['col'] === '1')
          $scope.votes.push({});

        $scope.votes[+cell['row'] - 2][MAPPINGS[cell['col']]] = cell['$t'];
      }
    });
  };
  load();
}]);
