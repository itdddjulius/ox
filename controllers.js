var ticTacToe = angular.module('ticTacToe', []);

ticTacToe.controller('TicTacToeController', function ($scope) {
	
	$scope.boxes = [{},{},{},{},{},{},{},{},{}];

	$scope.turn = 0;

	$scope.players = [
		{
			name: "player1",
			row0: 0,
			row1: 0,
			row2: 0,
			column0: 0,
			column1: 0,
			column2: 0,
			diagonal0: 0,
			diagonal1: 0
		},
		{
			name: "player2",
			row0: 0,
			row1: 0,
			row2: 0,
			column0: 0,
			column1: 0,
			column2: 0,
			diagonal0: 0,
			diagonal1: 0
		}
	];

	$scope.box = function(cellIndex){
			var player = "players["+$scope.turn%2+"]";
			eval("$scope."+player+".row"+(Math.floor(cellIndex / 3))+"++");
			eval("$scope."+player+".column"+(cellIndex % 3)+"++");
			if (cellIndex % 4 == 0){
				eval("$scope."+player+".diagonal0++");
			}
			if ([2,4,6].indexOf(cellIndex) > -1 ){
				eval("$scope."+player+".diagonal1++");
			}
			console.log(eval("$scope."+player));
			$scope.boxes[cellIndex].isDisabled = true;
			$scope.boxes.player = player;
			console.log(player);
			$scope.turn++;
	};
	
});