package {
	import flash.external.ExternalInterface;
	import flash.media.Sound;
	import flash.media.SoundChannel;
	import flash.events.Event;
	import flash.system.Security;
	import flash.net.URLLoader;
    import flash.net.URLRequest;
    import flash.utils.Timer;
	import flash.events.*;
	import flash.media.SoundTransform;
	
	
	/*Security.allowDomain("entropiahost.com");
	Security.allowDomain("http://entropiahost.com/ionut/flash/test/");
	Security.allowDomain("http://entropiahost.com");*/
	Security.LOCAL_TRUSTED;
	
	public class player {
		var mysong:Sound;
		var mychannel:SoundChannel;
		var req:URLRequest;
		var positionTimer:Timer;			
		var auxMax:Number = 0;
		var pausePosition:Number = 0;
		var transformation:SoundTransform;
		var stateOfPlayer:Number;
		
		//stateOfPlayer = 1 ( play ) = 2 ( pause ) 
		
		public function player() {
			// constructor code		
							
		}
		
		public function playSong(url:String):void {
			
			try {
			this.mysong = new Sound();		
			req = new URLRequest(url);
			this.mysong.load(req);		
            this.mychannel = new SoundChannel();
			
			this.mysong.addEventListener(Event.COMPLETE, completeHandler);
            this.mysong.addEventListener(Event.ID3, id3Handler);
            this.mysong.addEventListener(IOErrorEvent.IO_ERROR, ioErrorHandler);
            this.mysong.addEventListener(ProgressEvent.PROGRESS, progressHandler);
			
			this.mychannel = mysong.play();			
            this.mychannel.addEventListener(Event.SOUND_COMPLETE, soundCompleteHandler);

            this.positionTimer = new Timer(50);
            this.positionTimer.addEventListener(TimerEvent.TIMER, positionTimerHandler);
            this.positionTimer.start();
			
			this.stateOfPlayer = 1;
       			
            }
            catch (err:Error) {
                
            }
			
		}
		
		public function pauseSong():void{
			
			 this.pausePosition = this.mychannel.position;
			 this.mychannel.stop();
			 
			 this.stateOfPlayer=2;			 
			 

		}
		
		public function pausePlaySong():void{
			try{
				if (this.stateOfPlayer == 2 ) 
				{
					this.mychannel = this.mysong.play(this.pausePosition);
				    this.stateOfPlayer=1;
				}
				
				
				this.mychannel.soundTransform = this.transformation;
				
			}catch (err:Error) {
                
            }
		}
		public function pauseSliderSong():void{
			this.mychannel.stop();
			this.positionTimer.stop();
		}
		
		public function playSliderSong(positionSlider:Number):void{
			try{			
			if (this.stateOfPlayer != 3 )	{
				
			this.mychannel = this.mysong.play(positionSlider);
			this.positionTimer.start();
			
			if (this.stateOfPlayer == 2 )	
			{	
				 pauseSong();
				
			}
			
			this.mychannel.soundTransform = this.transformation;
			
			}
			
			}catch (err:Error) {
                
            }
		}
		
		public function stopSong():void{
			
			this.mychannel.stop();
			this.positionTimer.reset();
			this.auxMax = 0 ;
			this.stateOfPlayer = 3;
			
			try {
                    this.mysong.close();
                }
                catch (err:Error) {
                    
                }

		}
		
		public function changeVolume(vol:String):void
			{
			this.transformation = this.mychannel.soundTransform;
			this.transformation.volume = Number(vol)/100;
			this.mychannel.soundTransform = this.transformation;
			}
		 
        

        private function positionTimerHandler(event:TimerEvent):void {
          // trace("positionTimerHandler: " + mychannel.position.toFixed(2));		
		  
		    var loadTime:Number = this.mysong.bytesLoaded / this.mysong.bytesTotal;
            var loadPercent:uint = Math.round(100 * loadTime);
            var estimatedLength:int = Math.ceil(this.mysong.length / (loadTime));
//            var playbackPercent:uint = Math.round(100 * (this.mychannel.position / estimatedLength));
//			ExternalInterface.call("afisTimer",playbackPercent);		  
		  
			ExternalInterface.call("MusicPlayer.showTimer",this.mychannel.position.toFixed(2));
			
			if ( estimatedLength > auxMax ) {
			ExternalInterface.call("MusicPlayer.setMaxPosition",estimatedLength);
			auxMax = estimatedLength ;
			}			
			
			if ( auxMax > 10000 ) 
					if (( auxMax - 100 ) < this.mychannel.position )  {
						  positionTimer.stop();			
						  ExternalInterface.call("MusicPlayer.finishedSong",1);
					}
			
			//if ( this.mysong.length > auxMax ) {
//			ExternalInterface.call("setMaxPosition",this.mysong.length.toFixed(2));
//			auxMax = this.mysong.length ;
//			}
			
        }

        private function completeHandler(event:Event):void {
           // trace("completeHandler: " + event);
		   
        }

        private function id3Handler(event:Event):void {
          //  trace("id3Handler: " + event);
        }

        private function ioErrorHandler(event:Event):void {
           // trace("ioErrorHandler: " + event);
            positionTimer.stop();       
        }

        private function progressHandler(event:ProgressEvent):void {
          //  trace("progressHandler: " + event);
        }

        private function soundCompleteHandler(event:Event):void {
          //  trace("soundCompleteHandler: " + event);
		    positionTimer.stop();
			
		  	ExternalInterface.call("MusicPlayer.finishedSong",1);
           
			
        }
    

	}

}










