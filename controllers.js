var ticTacToe = angular.module('ticTacToe', ["firebase"]);

ticTacToe
	
	//Set gameboard styling directive

	.directive('gameboard', function() {
		return {
			restrict: 'A',
			template: '<div tile ng-repeat="b in boxes" ng-click="b.clicked || gameOver || box($index)" ng-class="{tile : b.player == null, player1 : b.player == 0, player2 : b.player == 1, clicked : b.clicked, noClick : gameOver, winColor : b.colorMe}"><div class="symbol">{{boxes[$index].symbol}}</div></div>',
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
					width: (100 / boardWidth) - (boardWidth) + "%",
					height: (100 / boardWidth) - (boardWidth) + "%",
					margin: boardWidth * .5 + '%',
					fontSize: (18 / boardWidth) + 'em'
				})
			}
		};
	})

	.controller('TicTacToeController', function ($scope, $firebase) {
	
		var TicTacToeRef = new Firebase("https://nickmro-tic-tac-toe.firebaseio.com/") ;

	 		$scope.turnCounter = $firebase(new Firebase("https://nickmro-tic-tac-toe.firebaseio.com/" + '/turnCounter'));
	 		$scope.turnCounter.$add({turn: 0});

		// -------- Boxes and Box Data -------- //

		$scope.boxes = [];

		$scope.makeBoxes = function(num){
			for (i = 0; i < (num * num); i++){
				$scope.boxes.push({})
			}
		}

		$scope.makeBoxes(3);

		// -------- Turns and Other  -------- //

		$scope.begin = true;

		$scope.turn = 0; //will change every turn

		// -------- Player Data -------- //

		$scope.players = [
			{
				name: "",
				symbol: "X"
			},
			{
				name: "",
				symbol: "O"
			}
		];



		// In order to start the game over with a clean board and player data, 
		// we make a copy of the first dataset.

		$scope.newBoxes = angular.copy($scope.boxes);


		// -------- Enter the game -------- //

		$scope.gameEnter = function(){
			$scope.begin = false;
			$scope.newPlayers = angular.copy($scope.players);
		}

		
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
							$scope.win(playTurn, props); //Call the win function, which is created below
						}
						else if($scope.turn == (boardWidth * boardWidth - 1)){
							$scope.gameOver = true;
							$scope.tie = true;
						}
					};
				
				$scope.turn++;
				$scope.turnCounter.$set({turnCounter: $scope.turn});
		};


		// -------- Win function -------- //

		//This function will run every time a player wins.

		$scope.win = function(playTurn, props){
			$scope.currentPlayer = $scope.players[playTurn];
			$scope.gameOver = true;
			$scope.winningPlay = props;
			$scope.colorCombo(props);
		}


		// -------- Start New Game -------- //

		$scope.startOver = function(){
			$scope.players = $scope.newPlayers.reverse();
			$scope.boxes = $scope.newBoxes;
			$scope.gameOver = false;
			$scope.newPlayers = angular.copy($scope.players);
			$scope.newBoxes = angular.copy($scope.boxes);
			$scope.turn = 0;
			$scope.tie = false;
		}

		// -------- Color the Winning Combinations -------- //

		//Create an array of possible winning combos, which wll be checked against
		//the winning combo identified in the box function's win logic

		$scope.combos = {
			row0: [0,1,2],
			row1: [3,4,5],
			row2: [6,7,8],
			column0: [0,3,6],
			column1: [1,4,7],
			column2: [2,5,8],
			diagonal0: [0,4,8],
			diagonal1: [2,4,6]
		}


		//Create a for loop that sets a property (colorMe) in winning combo boxes.
		//When true, these boxes will get the class winColor, which will color the letters.

		$scope.colorCombo = function(prop){
			for (c in $scope.combos){
				if ($scope.winningPlay == c){
					$scope.winCombo = $scope.combos[c];
					for (d in $scope.winCombo){
						$scope.boxes[$scope.winCombo[d]].colorMe = true;
					}
				}
			}
		}
	
});

