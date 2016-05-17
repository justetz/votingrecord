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
  $scope.modalVote = null;
  $scope.voteFilter = '';

  $scope.toggleModal = function (row) {
    $scope.modalVote = row;
    angular.element('#voteModal').modal('toggle');
  }

  $scope.shouldBeHighlighted = function (row) {
    return row.date.getTime() > (new Date().getTime() - (7 * 24 * 60 * 60 * 1000));
  }

  $scope.correctModalBody = function (row) {
    return $scope.modalVote && row.date === $scope.modalVote.date && row.order === $scope.modalVote.order;
  }

  var load = function() {
    $http.get(URL).then(function (response) {
      $scope.votes = [];

      var flatData = response.data.feed.entry;
      var prevDate = null, orderCount = 0;

      for(var i = 0; i < flatData.length; i++) {
        var cell = flatData[i]['gs$cell'];

        if(cell['row'] === '1')
          continue;

        if(cell['col'] === '1')
          $scope.votes.push({});

        switch(cell['col']) {
          case '1':
            $scope.votes[+cell['row'] - 2][MAPPINGS[cell['col']]] = new Date(cell['$t']);

            if(!prevDate || prevDate != cell['$t']) {
              prevDate = cell['$t'];
              orderCount = 0;
              $scope.votes[+cell['row'] - 2].order = orderCount;
            } else {
              $scope.votes[+cell['row'] - 2].order = ++orderCount;
            }

            break;
          case '6':
            $scope.votes[+cell['row'] - 2][MAPPINGS[cell['col']]] = $sce.trustAsHtml(cell['$t']);
            break;
          default:
            $scope.votes[+cell['row'] - 2][MAPPINGS[cell['col']]] = cell['$t'];
        }

        // if(cell['col'] === '6') {
        //   $scope.votes[+cell['row'] - 2][MAPPINGS[cell['col']]] = $sce.trustAsHtml(cell['$t']);
        // } else {
        //   $scope.votes[+cell['row'] - 2][MAPPINGS[cell['col']]] = cell['$t'];
        // }
      }
    });
  };
  load();
}]);
