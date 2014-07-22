var ticTacToe = angular.module('ticTacToe', []);

ticTacToe
	
	//Set gameboard styling directive

	.directive('gameboard', function() {
		return {
			restrict: 'A',
			template: '<div tile ng-repeat="b in boxes" ng-click="box($index)" ng-class="{tile : b.player == null, player1 : b.player == 0, player2 : b.player == 1, clicked : b.clicked}"><div class="symbol">{{boxes[$index].symbol}}</div></div>',
			link: function (s, e, attrs){
				e.addClass('gameboard');
			}
		};
	})

	//Set tile styling directive to make sizes scaleable

	.directive('tile', function() {

		return {
			restrict: 'A',
			link: function (s, e, attrs){
				boardWidth = Math.sqrt(s.boxes.length);

				e.css({
					width: (100 / boardWidth) - (boardWidth / 2) + "%",
					height: (100 / boardWidth) - (boardWidth / 2) + "%",
					margin: boardWidth * 1.3 + 'px',
					fontSize: (200 / (boardWidth * boardWidth)) + 'em'
				})
			}
		};
	})

	.controller('TicTacToeController', function ($scope) {
	
	// -------- Empty data array for boxes -------- //

	$scope.boxes = [];

	$scope.makeBoxes = function(num){
		for (i = 0; i < (num * num); i++){
			$scope.boxes.push({})
		}
	}

	$scope.makeBoxes(3);

	// -------- Turns -------- //

	$scope.turn = 0;

	// -------- Player Data -------- //

	$scope.players = [
		{
			name: "player1",
			symbol: "X"
		},
		{
			name: "player2",
			symbol: "O"
		}
	];



	// In order to start the game over with a clean board and player data, 
	// we make a copy of the first dataset.

	$scope.newPlayers = angular.copy($scope.players);
	$scope.newBoxes = angular.copy($scope.boxes);

	
	// -------- Game Logic ---------- //

	$scope.box = function(cellIndex){
			var playTurn = $scope.turn%2;
			var player = $scope.players[playTurn];
			var playerString = "players["+playTurn+"]";
			var boardWidth = Math.sqrt($scope.boxes.length);
			eval("$scope."+playerString+".row"+(Math.floor(cellIndex / boardWidth))+" ? $scope."+playerString+".row"+(Math.floor(cellIndex / boardWidth))+"++ : $scope."+playerString+".row"+(Math.floor(cellIndex / boardWidth))+" = 1" );
			eval("$scope."+playerString+".column"+(cellIndex % boardWidth)+" ? $scope."+playerString+".column"+(cellIndex % boardWidth)+"++ : $scope."+playerString+".column"+(cellIndex % boardWidth)+" = 1");

			if (cellIndex % (boardWidth + 1) == 0){
				eval("$scope."+playerString+".diagonal0 ? $scope."+playerString+".diagonal0++ : $scope."+playerString+".diagonal0 = 1");
			}
			if (cellIndex % (boardWidth - 1) == 0 && cellIndex > 0 && cellIndex < ($scope.boxes.length - 1)){
				eval("$scope."+playerString+".diagonal1 ? $scope."+playerString+".diagonal1++ : $scope."+playerString+".diagonal1 = 1");
			}
			$scope.boxes[cellIndex].clicked = true;
			$scope.boxes[cellIndex].player = playTurn;
			$scope.boxes[cellIndex].symbol = player.symbol;

			for (props in $scope.players[playTurn]){
					if($scope.players[playTurn][props] == Math.sqrt($scope.boxes.length)){
						$scope.currentPlayer = $scope.players[playTurn];
						$scope.gameOver = true;
					}
					else if($scope.turn == (boardWidth * boardWidth)){
						$scope.gameOver = true;
						$scope.tie = true;
					}
				};
			
			$scope.turn++;
	};



	// ------- Start New Game -------- //

	$scope.startOver = function(){
		$scope.players = $scope.newPlayers.reverse();
		$scope.boxes = $scope.newBoxes;
		$scope.gameOver = false;
		$scope.newPlayers = angular.copy($scope.players);
		$scope.newBoxes = angular.copy($scope.boxes);
		$scope.turn = 0;
		$scope.tie = false;
	}
	
});

