//test audio links
//https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3
//spotify links that have preview_url
//https://api.spotify.com/v1/tracks/2ThslNnPGmK82KFcCF2Lxm?market=SE
//https://open.spotify.com/track/3a4eV7Wk18qpeMCc4RZSgQ
//https://open.spotify.com/track/0WxPrrwF0njkHgN35TzSMs
//https://open.spotify.com/track/2dwyNCNGyW86bnELor3ZJf
//https://open.spotify.com/track/1fmDKfeOAVy924OhthCLYP


//---------------------------------------------------------------------------------------------------------------------
//constants

var spotURL = "/spot"
var audio = document.getElementById("song");
var songTime = document.getElementById("songTime");
var newMP3 = document.getElementById("newMP3");
var playButton = document.getElementById("playButton");
var preButton = document.getElementById("previous");
var nextButton = document.getElementById("next");
var ranButton =  document.getElementById("random");
var spotLink = document.getElementById("spotLink");

//---------------------------------------------------------------------------------------------------------------------
//JukeBox

/*jukebox object
play function checks if song playing, pause if true and play if false
changeSong function changes the song forward if input is true previous if false
add function adds from newMP3 input if no URL is input else adds from spotify when its called from that function
addSpot function gets a preview mp3 link and adds it using function above
randomPlay function plays a song by random choosing a rand int. if it has input then it chages to song with that index
changeTimer changes the timer to remaining time or time elapse
*/
var JukeBox = {
  songs:["songs/DMX Make Me Lose My Mind.mp3","songs/Rise Against - From Heads Unworthy.mp3","songs/bensound-buddy.mp3","https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"],
  nameSongs:['DMX Make Me Lose My Mind','Rise Against - From Heads Unworthy','bensound-cute','bensound-buddy','SoundHelix-Song-1'],
  firstTime:true,
  playing:false,
  timer:true,
  curr:0,
  play:function(){
    if(this.firstTime){
      this.firstTime=false;
      audio.setAttribute("src",JukeBox.songs[this.curr]);
      document.getElementById(""+this.curr).style.color="red";
    }
    if(this.playing){
      audio.pause();
      this.playing = false;
    }
    else {
      audio.play();
      this.playing = true;
    }
  },
  changeSong:function(forward){
    document.getElementById(""+this.curr).style.color="black";
    if(forward) {
      this.curr = (this.curr+1)%JukeBox.songs.length;
    }
    else {
      this.curr = (this.curr-1)%JukeBox.songs.length;
      if(this.curr<0) this.curr = JukeBox.songs.length-1;
    }
    this.playing =false;
    document.getElementById(""+this.curr).style.color="red";
    audio.setAttribute("src",JukeBox.songs[this.curr]);
    JukeBox.play();
  },
  addSong:function(url=""){
    if(url===""){
      //need to check if it is playable or nah (is mp3?)
      JukeBox.songs.push(newMP3.value);
      var n = newMP3.value.split("/")
      JukeBox.nameSongs.push(n[n.length-1]);
      newMP3.value = "";
    }
    else{
      this.songs.push(url);
    }
    JukeBox.initQueue();
  },
  addSpot:function(){
    //post url first
    var data = {"song":spotLink.value}
    $.ajax({
      type:"POST",
      url:spotURL,
      processData: false,
      contentType: 'application/json',
      data: JSON.stringify(data)
    })
    spotLink.value ="";
    //get the data
    $.ajax({
      type:"GET",
      url:spotURL,
      success:function(r){
        if(r.preview_url){ //must have preview_url
          JukeBox.nameSongs.push(r.name)
          JukeBox.addSong(r.preview_url);
        }
        else alert("No Preview Found");
      }
    })

  },
  randomPlay:function(next=-1){
    document.getElementById(""+this.curr).style.color="black";
    if(next==-1) this.curr = Math.floor(Math.random()*JukeBox.songs.length);
    else this.curr=next;
    document.getElementById(""+this.curr).style.color="red";
    audio.setAttribute("src",JukeBox.songs[this.curr]);
    this.playing = false;
    JukeBox.play();
  },
  changeTimer:function(change){
    this.timer = change;
    setInterval(function(){
      if(JukeBox.timer){
        var sTime = audio.duration - audio.currentTime

      }
      else var sTime = audio.currentTime
      var sec = Math.floor(sTime%60)
      if(sec<10) sec = "0" + sec
      var min = Math.floor(sTime/60);
      songTime.innerText = min + ":" + sec;
    },500)
  },
  initQueue:function(){
    var list = "";
    for(i = 0; i < JukeBox.songs.length; i++){
      list += '<li class="noBullets" id="' + i + '" onclick="JukeBox.randomPlay('+i+')"'
      if(i%2 == 0) list += 'style="background-color:lightgray"> ' + JukeBox.nameSongs[i] + '</li>';
      else list+= '> ' + JukeBox.nameSongs[i] + '</li>';
    };
    document.getElementById("queue").innerHTML = list;
  }
}

//---------------------------------------------------------------------------------------------------------------------
//other functions for ui and keys stuff non JukeBox related... sort of

function hideKey(hide){
  if(hide){
    $("#overlayBox").hide();
    $("#keyBox").hide();
  }
  else {
    $("#overlayBox").show();
    $("#keyBox").show();
  }
}

//will assume all keys are correct just cause i dont want to check for numbers return from api
//or maybe just add it later easy peasy just run JukeBox.addSpot() but add a parameter and then check if it returns error
function keysSubmit(){
  var clientID = document.getElementById("clientID").value;
  var clientSecret = document.getElementById("clientSecret").value;
  var data = {"clientID":clientID, "clientSecret":clientSecret}
  hideKey(true);
  $('#spotify').hide();
  $('#spotIn').show();

  $.ajax({
    type:"POST",
    url:"/keys",
    contentType: 'application/json',
    data: JSON.stringify(data),
  })

}

//---------------------------------------------------------------------------------------------------------------------
//initial first load

JukeBox.changeTimer();
JukeBox.initQueue();
//$('#box').click(hideKey(true));


//---------------------------------------------------------------------------------------------------------------------
//eventlistener

//document.getElementById("box").onclick = hideKey(true);
//document.getElementById("box").addEventListener("click",hideKey(true));

//play pause image changes
playButton.addEventListener("mousedown",function(event){
  playButton.setAttribute("src","images/playpauseonclick.png")
})
playButton.addEventListener("mouseup",function(event){
  playButton.setAttribute("src","images/playpause.png")
})

//previouse image change
preButton.addEventListener("mousedown",function(event){
  preButton.setAttribute("src","images/prevOnclick.png")
})
preButton.addEventListener("mouseup",function(event){
  preButton.setAttribute("src","images/previous.png")
})

//next image change
nextButton.addEventListener("mousedown",function(event){
  nextButton.setAttribute("src","images/nextOnclick.png")
})
nextButton.addEventListener("mouseup",function(event){
  nextButton.setAttribute("src","images/next.png")
})

//random image change
ranButton.addEventListener("mousedown",function(event){
  ranButton.setAttribute("src","images/randomOnclick.png")
})
ranButton.addEventListener("mouseup",function(event){
  ranButton.setAttribute("src","images/random.png")
})
