/* 
 * © 2015 Kunskapsskolan Education AB all rights reserved
 * including all other voodoo lawyering terms and conditions.
 */
"use strict";

// Init variables

var correctAnswer=0;
var currentTable=0;
var maxFactor=10;
var playerTotalScore=0;
var multiplier=1;
var tableCount=0;
var powerUp=0;
//              1 2 3 4  5  6 7 8 9 10 11 12
var tableOrder=[1,2,5,4,10,11,3,6,12,9,8,7];

var doneNumbers = [];
var commitedErrors = [];

// load up some sounds

var yaySound = document.createElement('audio');
yaySound.setAttribute('src', 'sounds/yay.wav');

var noesSound = document.createElement('audio');
noesSound.setAttribute('src', 'sounds/noes.wav');

var levelupSound = document.createElement('audio');
levelupSound.setAttribute('src', 'sounds/levelup2.wav');

var leveldownSound = document.createElement('audio');
leveldownSound.setAttribute('src', 'sounds/leveldown2.wav');

var highScoreSound = document.createElement('audio');
highScoreSound.setAttribute('src', 'sounds/leveldown2.wav');


var backgroundMusic = document.createElement('audio');
backgroundMusic.setAttribute('src', 'sounds/l3go_Rolemusic.mp3');
backgroundMusic.load();

// Load them all!

$.get();
    
// **********************************************
   
   
// Set up some functions

function normalizeUserInput(){
    $( "#userInput" ).stop(true, true).animate({
    opacity: 0.6,
    backgroundColor: "#201020"
  }, 500 ); 
    
}

    
function createNewProblem(){
	console.log("Create New Problem");
	var type = getUrlVars()["type"];

	var cookieName="multipluttiHighScore"+type;
	var highScore = $.cookie(cookieName);
	console.log("Highscore cookie ("+cookieName+") = " + highScore)

	document.getElementById("hiscore").innerHTML=playerTotalScore;
	
	
	var numA = parseInt(getUrlVars()["multiA"]);
	var numB = parseInt(getUrlVars()["multiB"]);
	
	var numC = parseInt(getUrlVars()["multiC"]);
	var numD = parseInt(getUrlVars()["multiD"]);
	
	//var type = getUrlVars()["type"];
	
	console.log("type=" +type );
	console.log("Mutliplying " +numA+" to " +numB+" x " +numC+" to " +numD+".");
    
    normalizeUserInput();
    var factorB=Math.floor(Math.random()*(numB-numA+1)+numA);
	var factorA=Math.floor(Math.random()*(numD-numC+1)+numC);
   
    var newNumber=null;
    
	if (type=="*"){
	document.getElementById("factorA").innerHTML=factorB;
    document.getElementById("sign").innerHTML="&times;";
    document.getElementById("factorB").innerHTML=factorA;
	var sum = factorA * factorB;
	} 
	
	if (type=="+"){
	document.getElementById("factorA").innerHTML=factorB;
    document.getElementById("sign").innerHTML="&plus;";
    document.getElementById("factorB").innerHTML=factorA;
	var sum = factorA + factorB;
	} 
	
	if (type=="-"){
	document.getElementById("factorA").innerHTML=factorB;
    document.getElementById("sign").innerHTML="&minus;";
    document.getElementById("factorB").innerHTML=factorA;
	var sum = factorA - factorB;
	} 
	
	if (type=="/"){
	document.getElementById("factorA").innerHTML=factorB;
    document.getElementById("sign").innerHTML="&divide;";
    document.getElementById("factorB").innerHTML=factorA;
	var sum = factorA / factorB;
	} 
	
    return (sum);
}

function addScore(){
    
    
    
    
    // Calculate score
    
   var score=10;
   
   // Adjust according to current table
   score=score*(1+(currentTable/10));
   
   // Adjust according to current factorB
   var bValue=document.getElementById("factorB").innerHTML;
   score=score*(1+(bValue/20));;
   
   score=Math.round(score*10);
   
   $( "#modal" ).css("color","#69009E");
   $( "#modal" ).css("text-shadow","0 0 1vw #69009E");
   
   // Adjust according to multiplier
   score=score*multiplier;
   
   $( "#modal" ).html("+"+score); 
    
    playerTotalScore=playerTotalScore+Math.round(score);
    
    //currentTable = playerTotalScore;
   
    // count up table
    
    tableCount=tableCount+1;
    
    if(tableCount>=24) {
        currentTable=currentTable+1;
        tableCount=0;
    }
    
    document.getElementById("score").innerHTML=playerTotalScore;
    
    // if score higher than highscore store score as high score!
    
	var type = getUrlVars()["type"];
	
	var cookieName="multipluttiHighScore"+type;
	
    var highScore = $.cookie(cookieName);
   
    console.log("Highscore cookie ("+cookieName+") = " + highScore)
	
    if (highScore==="undefined"){
        highScore=0;
    }
    
    if(playerTotalScore>highScore) {
    
      
       $( "#modal" ).css("color","#69FF9E");
       $( "#modal" ).css("text-shadow","0 0 1vw #69FF9E");

      
    document.getElementById("hiscore").innerHTML=playerTotalScore;
    $.cookie(cookieName, playerTotalScore, {expires : 10000, path : '/'});
    $( "#hiscore" ).addClass( "newHighScore" );
    $( "#hiScoreName" ).addClass( "newHighScore" );
    }
}

// This function is copied of Stackoverflow 
function hex2rgba(hex, opacity)
{
    //extract the two hexadecimal digits for each color
    var patt = /^#([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})$/;
    var matches = patt.exec(hex);

    //convert them to decimal
    var r = parseInt(matches[1], 16);
    var g = parseInt(matches[2], 16);
    var b = parseInt(matches[3], 16);

    //create rgba string
    var rgba = "rgba(" + r + "," + g + "," + b + "," + opacity + ")";

    //return rgba colour
    return rgba;
}

function initMultiplutti() {
	
	console.log("Init");
	
	
    correctAnswer = createNewProblem();
    console.log("Testar om användaren matar in " + correctAnswer);
}

function checkCorrect (key,answer){
    
    if(key.toString()===answer.toString()) {

       // Update score
       addScore();
       addSome();
       
       // Change css for #userInput
       //$( "#userInput" ).addClass( "correctAnswer", 0, "easeInOutQuad" );
       $( "#userInput" ).css("background-color","#00ff00");
           
       // Create a new problem
       correctAnswer = createNewProblem(tableOrder[currentTable],maxFactor);

       // Be happy
       yaySound.play();

       // Remove content for input feild
       $('#userInput').html("");

    } else {

       // Change css for #userInput
       //$( "#userInput" ).addClass( "wrongAnswer", 0, "easeInOutQuad" );
       $( "#userInput" ).css("background-color","#ff0000");

       $( "#modal" ).html(document.getElementById("factorA").innerHTML + " " +  document.getElementById("sign").innerHTML + " " + document.getElementById("factorB").innerHTML  + " = " +correctAnswer); 
       $( "#modal" ).css("color","#ff0000");
       $( "#modal" ).css("text-shadow","0 0 1vw #ff0000");


       // create a new problem
       correctAnswer = createNewProblem(tableOrder[currentTable],maxFactor);

       // Be sad
       noesSound.play();

       // Remove previous user input
       $('#userInput').html("");
   }
    
}
   
function addSome(){
    
    powerUp=powerUp+10;
    
    if (powerUp > 100) {
      powerUp=100;
    }
  
  
}

// count down the value of the powerUpBar

function countDownPowerBar() {
     
    if (powerUp>0){
        powerUp=powerUp-0.05;
        
        powerUp=Math.round(powerUp * 100) / 100;
        
        $( "#powerUpBar" ).css("width",powerUp + "%");
        
        if (powerUp<25){   
        $("#multiplier").html("Score x1");
        multiplier=1;
        $( "#powerUpBar" ).css("background-color","#ff0000");
        $( "#powerUpBar" ).css("box-shadow","0 0 2vw 0 rgba(255, 0, 0, 1)");
         
        } 
        
        if (powerUp>=25){   
        $("#multiplier").html("Score x2");
        multiplier=2;
        $( "#powerUpBar" ).css("background-color","#00ff00");
        $( "#powerUpBar" ).css("box-shadow","0 0 2vw 0 rgba(0, 255, 0, 1)");
   
        } 
        if (powerUp>=50){
           
        $("#multiplier").html("Score x3");
        multiplier=3;
        $( "#powerUpBar" ).css("background-color","#ffff00");
        $( "#powerUpBar" ).css("box-shadow","0 0 2vw 0 rgba(255, 255, 0, 1)");
        } 
        if (powerUp>=75){
        $( "#powerUpBar" ).css("background-color","#04DBCB");    
        $( "#powerUpBar" ).css("box-shadow","0 0 2vw 0 rgba(98, 239, 196, 1)");
        $("#multiplier").html("Score x4");
        multiplier=4;
        } 
        
        
        if (powerUp===25 || powerUp===50 || powerUp===75 ) {
            leveldownSound.play();
        }
     
    }
}

function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

      
// Check if everything is in place

$( document ).ready(function() {
	
	var highScore = $.cookie("multipluttiHighScore");
    
	
	if(highScore==="undefined") {
        highScore=0;
    }
    document.getElementById("hiscore").innerHTML=highScore;
    // set powerbar values
    $( "#powerUpBar" ).css("width","0%");
    $( "#multiplier" ).html("Score x1");
    
    // activate count down on power bar
    countDownPowerBar();
    setInterval(countDownPowerBar, 50);

$('#start').click(function() {
        $( "#splash" ).css("display","none");
        $( "#title" ).css("display","none");
        $( "#credit" ).css("display","none");
        $( "#start" ).css("display","none");
    });


$('.button').click(function() {
        addSome();
    });


    // Show the virtualKeyboard on tablets and phones
    
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        $('#screenKeyboard').show();
    } else {
        $('#screenKeyboard').hide();
    }
    
    // Not so loud please
    
    backgroundMusic.volume=.6;
    
    // Check if music ended then re-load (too big to just cache...)
    
    backgroundMusic.addEventListener("ended", function() {
        console.log("Nu var det slut");
        backgroundMusic.load();
        backgroundMusic.currentTime = 0.01;
        backgroundMusic.play();
    }, false);

    // assign controlls for music

    $('.play').click(function() {
        console.log("Spelar");
        backgroundMusic.play();
        $('.play').hide();
        $('.pause').show();
    });

    $('.key').click(function() {
       var currentHTML=$('#userInput').html();
       var pressedKey=$(this).html();
       currentHTML=currentHTML+pressedKey;
       $('#userInput').html(currentHTML);
    });

    $('#userInput').click(function() {
        var currentHTML=$('#userInput').html();
        checkCorrect(currentHTML,correctAnswer); 
    });

    $('.equalKey').click(function() {
        var currentHTML=$('#userInput').html();
        checkCorrect(currentHTML,correctAnswer); 
    });

    $('.delKey').click(function() {
        var currentHTML=$('#userInput').html();
        currentHTML=currentHTML.slice(0,[currentHTML.length-1]);
        $('#userInput').html(currentHTML);
    });

    $('.pause').click(function() {
        console.log("Pausar");
        backgroundMusic.pause();
        $('.play').show();
        $('.pause').hide();
    });
    
   
    
    // Hide pause button (play still visible)
    
    $('.pause').hide();
    
    // start the fun...
    
    initMultiplutti();
    
    // Start keyboard listners
    
    $(document).keydown(function (e) {
        
        var currentHTML=$('#userInput').html();
        var pressed=e.keyCode;
        
        // handle numeric keys
        
        if (e.keyCode >= 48 && e.keyCode <= 57){
            currentHTML=currentHTML+[e.keyCode-48];
            $('#userInput').html(currentHTML);
        }
        
        // handle keypad
        
        if (e.keyCode >= 96 && e.keyCode <= 105){
            currentHTML=currentHTML+[e.keyCode-96];
            $('#userInput').html(currentHTML);
        }
        
        // Delete function
        
        if (e.keyCode === 8){
            currentHTML=currentHTML.slice(0,[currentHTML.length-1]);
            $('#userInput').html(currentHTML);
        }
        
        // Handle return / Check if correct
        
        if (e.keyCode === 13){
            checkCorrect(currentHTML,correctAnswer); 
        }
        
 
    }); // /keyDown
    
    }); // /Document Ready