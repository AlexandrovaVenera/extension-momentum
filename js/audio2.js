

const playList = [
    {      
      title: 'A Thousand Years',
      src: './assets/sounds/A Thousand Years.mp3',
      duration: '00:19'
    }
    ,
    
    {      
      title: 'I Belong to you',
      src: './assets/sounds/I Belong to you.mp3',
      duration: '00:24'
    },
    
    {      
      title: 'Paramore - Decode',
      src: './assets/sounds/Paramore - Decode.mp3',
      duration: '03:50'
    }
  ]
  const playListContainer = document.querySelector('.play-list')
  document.querySelector('audio').addEventListener ('ended', next);
  /*Создание playlist*/
  playList.forEach((el,index) => {
    const li = document.createElement('li');
    playListContainer.append(li)
    li.textContent = el.title
    li.classList.add('play-item')
    li.setAttribute("data-index", index);
  })
  /*-----------------------------------*/
  
  //window.document.querySelector('.play').addEventListener('click', toggleAudio)
  var indexAudio = 0;
  
  function loadNewTrack(index){
    var player = document.querySelector('audio')
    player.src = playList[index].src
    document.querySelector('.name-music').innerHTML = playList[index].title
    this.currentAudio = player;
    this.currentAudio.load()
    this.toggleAudio()
    this.updateStylePlaylist(this.indexAudio,index)
    this.indexAudio = index;
  }
  
  var playListItems = document.querySelectorAll(".play-item");
  
  for (let i = 0; i < playListItems.length; i++){
    playListItems[i].addEventListener("click", getClickedElement.bind(this));
  }
  
  function getClickedElement(event) {
    for (let i = 0; i < playListItems.length; i++){
      if(playListItems[i] == event.target){
        var clickedIndex = event.target.getAttribute("data-index")
        if (clickedIndex == this.indexAudio ) { // alert('Same audio');
            this.toggleAudio()
        }else{
            loadNewTrack(clickedIndex);
        }
      }
    }
  }
  
  document.querySelector('audio').src = playList[indexAudio].src
  document.querySelector('.name-music').innerHTML = playList[indexAudio].title
  
  var currentAudio = document.querySelector('audio');
  
  currentAudio.load()
  
  currentAudio.onloadedmetadata = function() {
        document.querySelector('.controls .length').textContent = this.getMinutes(this.currentAudio.duration)
  }.bind(this);
  
  var interval1;
  
  function toggleAudio() {
    if (this.currentAudio.paused) {
      document.querySelector('.play').classList.add('pause');
      document.querySelectorAll('.play-item')[this.indexAudio].classList.add('item-active');  
      this.currentAudio.play();
    }else{
      document.querySelector('.play').classList.remove('pause')
      this.currentAudio.pause();
    }
  }
  
  function pauseAudio() {
    this.currentAudio.pause();
    clearInterval(interval1);
  }
  
  var timer = document.querySelector('.current')
  
  var barProgress = document.querySelector('.progress');
  
  
  var width = 0;
  
  function onTimeUpdate() {
    var t = this.currentAudio.currentTime
    timer.innerHTML = this.getMinutes(t);
    this.setBarProgress();
    if (this.currentAudio.ended) {
      if (this.indexAudio < playList.length-1) {
          var index = parseInt(this.indexAudio)+1
          this.loadNewTrack(index)
      }
    }
  }
  
  
  function setBarProgress(){
    var progress = (this.currentAudio.currentTime/this.currentAudio.duration)*100;
    document.querySelector('.progress').style.width = progress + "%";
  }
  
  
  function getMinutes(t){
    var min = parseInt(parseInt(t)/60);
    var sec = parseInt(t%60);
    if (sec < 10) {
      sec = "0"+sec
    }
    if (min < 10) {
      min = "0"+min
    }
    return min+":"+sec
  }
  
  var progressbar = document.querySelector('.timeline')
  progressbar.addEventListener("click", seek.bind(this));
  
  
  function seek(event) {
    var percent = event.offsetX / progressbar.offsetWidth;
    this.currentAudio.currentTime = percent * this.currentAudio.duration;
    barProgress.style.width = percent*100 + "%";
  }
  
  function forward(){
    this.currentAudio.currentTime = this.currentAudio.currentTime + 5
    this.setBarProgress();
  }
  
  function rewind(){
    this.currentAudio.currentTime = this.currentAudio.currentTime - 5
    this.setBarProgress();
  }
  
  
  function next(){
    var oldIndex = this.indexAudio
    this.indexAudio++;
    if (this.indexAudio == playList.length) {
      this.indexAudio = 0;
    }
        
        updateStylePlaylist(oldIndex,this.indexAudio)
        this.loadNewTrack(this.indexAudio);
    
  }
  
  function previous(){
    var oldIndex = this.indexAudio
    
    if (this.indexAudio==0) {
      this.indexAudio = playList.length-1;
    }else{
      this.indexAudio--;
    }
        updateStylePlaylist(oldIndex,this.indexAudio)
        this.loadNewTrack(this.indexAudio);
        
    
  }
  
  /*!!!!*/
  function updateStylePlaylist(oldIndex,newIndex){
    document.querySelectorAll('.play-item')[oldIndex].classList.remove('item-active');
    document.querySelectorAll('.play-item')[newIndex].classList.add('item-active');  
    //this.pauseToPlay(oldIndex);
   // this.playToPause(newIndex)
  }
  let newVolume 

  
  function toggleMute(){
     var btnMute = document.querySelector('.volume-button');
     var volUp = document.querySelector('.icono-volumeMedium');
     var volMute = document.querySelector('.icono-volumeMute');
     if (this.currentAudio.muted == false) {
        this.currentAudio.muted = true
        volUp.classList.add('icono-volumeMute')
        document.querySelector('audio').volume  = 0 
        document.querySelector(".controls  .volume-percentage").style.width = 0 * 100 + '%';
       // volUp.classList.remove()
        //btnMute.
        //volMute.style.display = "block"
    }else{
      this.currentAudio.muted = false
      volUp.classList.remove('icono-volumeMute')
      document.querySelector('audio').volume = newVolume;
      document.querySelector(".controls  .volume-percentage").style.width = newVolume * 100 + '%';
      
      
    }
  }
  

  
  const volumeSlider = document.querySelector(".controls .volume-slider");

  volumeSlider.addEventListener('click', e => {
    const sliderWidth = window.getComputedStyle(volumeSlider).width;
    newVolume = e.offsetX / parseInt(sliderWidth);
    document.querySelector('audio').volume = newVolume;
    document.querySelector(".controls  .volume-percentage").style.width = newVolume * 100 + '%';
    }, false)