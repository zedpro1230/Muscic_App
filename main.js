const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const toggleButton = document.getElementById('toggle');
let audioButton = document.getElementById('audio_btn')

const heading = $('.content h1')
const cdThumb=$(' .CD_img')
const author=$('#author')
const audio=$('#audio')
const progress =$('#progress')
const nextBtn = $('.btn_next')
const prevBtn= $('.btn_prev')
const randomBtn=$('.btn_random span')
const repeatBtn = $('.btn_repeat span')
const volumeBtn=$('#audio_btn')
const playList = $('.playlist')
const volumeBar=$('.volume_bar')

const app ={

    currentIndex:0,
    isRandom : false,
    isRepeat : false,
    songs:[
        {
            name:'Di Di Di x Nevada',
            singer:'Daniel Mastro',
            img:'./assets/img/song1.jpg',
            path:'./assets/music/song1.mp3'
        },
        {
            name:'Sold Out',
            singer:'Hawk Nelson',
            img:'./assets/img/song2.jpg',
            path:'./assets/music/song2.mp3'
        },
        {
            name:'Unstoppable',
            singer:'Sia',
            img:'./assets/img/song3.jpg',
            path:'./assets/music/song3.mp3'
        },
        {
            name:'Señorita',
            singer:'Shawn Mendes',
            img:'./assets/img/song4.jpg',
            path:'./assets/music/song4.mp3'
        },
        {
            name:'Closer ',
            singer:'The Chainsmoker',
            img:'./assets/img/song5.jpg',
            path:'./assets/music/song5.mp3'
        }
       
    ],

    render: function(){
        const htmls = this.songs.map((song,index)=>{
            return `
            <div class="song ${index === this.currentIndex ? 'active':''}" data-index="${index}">
            <div class="thumb" style="background-image: url('${song.img}')">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>
            `
        })
        playList.innerHTML = htmls.join('')
    },

    defineProperties:function(){
        Object.defineProperty(this,'currentSong',{
            get:function(){
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvent:function(){
        const _this =this
        // CD animated
        const cdThumbAnimate=cdThumb.animate(
            [
                {
                    transform:'rotate(360deg)'
                }
            ],
            {
            duration:10000,
            iterations:Infinity
            }
        )
        cdThumbAnimate.pause()
        console.log(cdThumb)

        // Play/pause envent
        toggleButton.onclick = ()=>{
            if(toggleButton.innerText=='play_circle')
                {
                    toggleButton.innerText='pause'
                    audio.play()
                    cdThumbAnimate.play()
                }
            else if(toggleButton.innerText=='pause')
                {
                    toggleButton.innerText='play_circle'
                    audio.pause()
                    cdThumbAnimate.pause()
                }
            
            
        }
        // Song progress
        audio.ontimeupdate=function(){
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime/audio.duration*100)
                progress.value=progressPercent
            }
        }
        progress.oninput= function(e){
            const seekTime = audio.duration/100*e.target.value
            audio.currentTime=seekTime
        }

        // Set muted/unmuted state
        volumeBtn.onclick=function(){
            if(audioButton.innerText=='volume_up')
            {
                audioButton.innerText='volume_off'
                audio.muted= true
            }
            else if(audioButton.innerText=='volume_off')
            {
                audioButton.innerText='volume_up'
                audio.muted= false
                
            }
        }

        volumeBar.addEventListener("input",function(){
            audio.volume=volumeBar.value
        })

        // Click to the next song

        nextBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
                toggleButton.innerText='pause'
                audio.play()
                cdThumbAnimate.play()
                _this.render()
                _this.scrollToActiveSong()
            }
            else{
                _this.nextSong()
                toggleButton.innerText='pause'
                audio.play()
                cdThumbAnimate.play()
                _this.render() 
                
                _this.scrollToActiveSong()     
                }
            }
            
        // Click to the prev song
        prevBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
                toggleButton.innerText='pause'
                audio.play()
                cdThumbAnimate.play()
                _this.render()
                _this.scrollToActiveSong()  
            }
            else{
                _this.prevSong()
                toggleButton.innerText='pause'
                audio.play()
                cdThumbAnimate.play()
                _this.render() 
                _this.scrollToActiveSong() 
                     
                }      
        }
        // Handeled random event
        randomBtn.onclick =function(){
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active',_this.isRandom)
            
        }
        // Handeled repeat envent
        repeatBtn.onclick =function(){
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active',_this.isRepeat)
            
        }
        // play next song when aduio ended
       audio.onended= function(){
        if (_this.isRepeat){
            audio.play()
        }
        else{
            nextBtn.click()
        }
         
       }
       // Listen click event in play list
       playList.onclick =function(e){
        const songElement= e.target.closest('.song:not(.active)')
            if(songElement||e.target.closest('.option')){
                
                if(songElement){
                    _this.currentIndex =Number( songElement.dataset.index)
                    _this.loadCurrentSong()
                    toggleButton.innerText='pause'
                    cdThumbAnimate.play()
                    audio.play()
                    _this.render()
                }
            }
       }
    },

    

    scrollToActiveSong(){
        setTimeout(function(){
            $('.song .active').scrollIntoView()
        },500)
    },

    loadCurrentSong:function(){
        
        heading.textContent = this.currentSong.name
        author.textContent = this.currentSong.singer
        cdThumb.src =this.currentSong.img
        audio.src=this.currentSong.path
    },

    nextSong : function(){
        this.currentIndex++
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },

    prevSong : function(){
        this.currentIndex--
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length -1
        }
        this.loadCurrentSong()
    },

    playRandomSong: function(){
        let newIndex
        do{
            newIndex = Math.floor(Math.random()* this.songs.length)
            console.log(newIndex)
        }
        while(newIndex === this.currentIndex )
            this.currentIndex = newIndex
            this.loadCurrentSong()
        
    },

    start: function(){
        // Listen and start DOM events
        this.handleEvent()

        //Define properties for objects
        this.defineProperties()

        // Load current song to UI when loading app
        this.loadCurrentSong()

        // Render playlist
        this.render()
    }
}

app.start()



