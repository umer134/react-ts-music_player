import { FC, useRef, useState } from "react";
import { IData } from "./MainPage";
import { faForward, faBackward, faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


interface PlaybarProps {
    currentTrack : IData 
    trackIndex : number
    setTrackIndex: Function
    setCurrentTrack: Function
    isPlaying: boolean
    setIsPlaying: Function
    data: IData[] | null
    audioRef : HTMLAudioElement
}   


const TimeControl: FC <PlaybarProps> = ({audioRef, currentTrack}) => {

    const [currentTime, setCurrentTime] = useState(0)
    

    const sliderCurrentTime = Math.round((currentTime / currentTrack?.duration) * 100)

    const handleChangeCurrentTime = (_, value) => {
    const timebar = Math.round(value / 100 * currentTrack?.duration)
    setCurrentTime(timebar)
    audioRef.current.currentTime = timebar
    }

    const secondsToformatTime = (duration) => {
    duration = Number(duration)
    let m = Math.floor(duration % 3600 / 60);
    let s = Math.floor(duration % 3600 % 60);
    
    m = (m < 10 ? '0' : '') + m;
    s = (s < 10 ? '0' : '') + s;
    return (m + ':' + s);
    }


const formattedDurationTime = secondsToformatTime(currentTrack?.duration);
const formattedCurrentTime = secondsToformatTime(currentTime);

        useEffect(() => {
            
            const timer = setInterval(() => {
                setCurrentTime(audioRef.current.currentTime)
            }, 1000)

            return () => {
                clearInterval(timer)
            }
        }, [currentTime])

    return(
        <div className="Timer">
            <p>{formattedCurrentTime}</p>
            <Slider value={sliderCurrentTime}
                onChange={handleChangeCurrentTime}
                step={1}
                min={0}
                max={100}
                className="Slider"/>
            <p>{currentTrack ? formattedDurationTime : formattedCurrentTime}</p>
        </div>)
        }



const Playbar: FC <PlaybarProps> = ({currentTrack, isPlaying,  trackIndex,
    setCurrentTrack, data,setIsPlaying, setTrackIndex }) => {

    const audioRef = useRef<HTMLAudioElement>(null)

    const handlePlayAudio = async(currentTrack: IData) => {
        if(audioRef.current){
            if(isPlaying){
                audioRef.current.pause()
                setIsPlaying(false)
            }else{
                audioRef.current.play()
                setIsPlaying(true)
            }
        }
    }

    const handleToNextAudio = (currentTrack1:IData) => {     
           const nextTrack = async() => {
                if(audioRef.current){
                await setTrackIndex(trackIndex + 1)
                setCurrentTrack(data![trackIndex + 1])
                await (audioRef.current.src = currentTrack1?.preview)
                await setIsPlaying(true)
                await audioRef.current.play()
                }
           }  
            if(currentTrack1.id === currentTrack.id){
                nextTrack()
            }
}
    const handleToPreviousAudio = (currentTrack1:IData) => {     
        if(audioRef.current?.play()){
            setIsPlaying(true)
        }else{
            setIsPlaying(false)
        }
           const previousTrack = async() => {
                if(audioRef.current){
                await setTrackIndex(trackIndex - 1)
                setCurrentTrack(data![trackIndex - 1])
                await (audioRef.current.src = currentTrack1?.preview)
                await setIsPlaying(true)
                await audioRef.current.play()
                }
           }  
            if(currentTrack1.id === currentTrack.id){
                previousTrack()
            }
}

    if(!currentTrack){return <p className="trakcs-state">No Tracks yet...</p>}
    return ( 
        <div className="PlayBar">
        <div className="track-info">
        <img width={450} height={400} src={currentTrack.album.cover_big} alt="" />
        <p className="track-title">{currentTrack.title}</p>
        <audio ref={audioRef} src={currentTrack.preview}/>
        <p className="track-artist">{currentTrack.artist.name}</p>
        <div className="play-slider">
        <TimeControl currentTrack={currentTrack} audioRef={audioRef} />
        </div>
        </div>
        <div className="play-menu">
        <FontAwesomeIcon icon={faBackward} className="fb-btn" onClick={() => handleToPreviousAudio(currentTrack)} />
        <br/>
        {isPlaying?
         (<FontAwesomeIcon icon={faPause} className="ps-btn"onClick={() =>handlePlayAudio(currentTrack)}  />
        )
        :(<FontAwesomeIcon icon={faPlay} className="pl-btn" onClick={() => handlePlayAudio(currentTrack)} />
        )}<br/>
        <FontAwesomeIcon icon={faForward} className="fw-btn" onClick={() => handleToNextAudio(currentTrack)}  />
        </div>
        </div>
     );
}

export default Playbar;

