var URL = 'https://spreadsheets.google.com/feeds/cells/1GdBFj_y4QXNt8H_ayvtBd9MBGoB9Unne7H9rwcHlRbE/od6/public/values?alt=json';
var MAPPINGS = {
  1: 'date',
  2: 'desc',
  3: 'vote',
  4: 'decision',
  5: 'count',
  6: 'details'
}

$.material.init();

var app = angular.module('votingRecord', []);

app.controller('MainController', ['$scope', '$http', '$sce', function ($scope, $http, $sce) {
  $scope.modalVoteIndex = -1;
  $scope.voteFilter = '';

  $scope.toggleModal = function (index) {
    $scope.modalVoteIndex = index;
    angular.element('#voteModal').modal('toggle');
  }

  var load = function() {
    $http.get(URL).then(function (response) {
      $scope.votes = [];

      var flatData = response.data.feed.entry;
      for(var i = 0; i < flatData.length; i++) {
        var cell = flatData[i]['gs$cell'];

        if(cell['row'] === '1')
          continue;

        if(cell['col'] === '1')
          $scope.votes.push({});

        if(cell['col'] === '6') {
          $scope.votes[+cell['row'] - 2][MAPPINGS[cell['col']]] = $sce.trustAsHtml(cell['$t']);
        } else {
          $scope.votes[+cell['row'] - 2][MAPPINGS[cell['col']]] = cell['$t'];
        }
      }
    });
  };
  load();
}]);
