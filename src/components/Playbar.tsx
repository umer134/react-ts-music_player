import { FC, useRef, useState, useEffect } from "react";
import { IData } from "./MainPage";
import { faForward, faBackward, faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {Slider} from "@mui/material";


interface PlaybarProps {
    currentTrack : IData 
    trackIndex : number
    setTrackIndex: Function
    setCurrentTrack: Function
    isPlaying: boolean
    setIsPlaying: Function
    data: IData[] | null
}   


const Playbar: FC <PlaybarProps> = ({currentTrack, isPlaying,  trackIndex,
    setCurrentTrack, data,setIsPlaying, setTrackIndex }) => {
    const [currentTime, setCurrentTime] = useState(0)
    const audioRef = useRef<HTMLAudioElement>(null)

    const sliderCurrentTime = Math.round((currentTime / currentTrack?.duration) * 100)
    
    const handleChangeDuration = (_:any, value:any) => {
        if(audioRef.current){
            const timebar = Math.round(value * 100 / currentTrack?.duration)
            setCurrentTime(timebar)
            audioRef.current.currentTime = timebar
        }
    }

    const secondsToFormatTime = (duration:number) => {
        let m:number = Math.floor(duration % 3600 / 60);
        let s:number = Math.floor(duration % 3600 % 60);

        let minute:string = (m < 10 ? '0' : '') + m;
        let second:string = (s < 10 ? '0' : '') + s;
        
        return (minute + ':' + second)
    }

    const formattedDurationTime = secondsToFormatTime(currentTrack?.duration)
    const formattedCurrentTime = secondsToFormatTime(currentTime)

    useEffect(() => {
        const timer = setInterval(() => {
            if(audioRef.current){
                setCurrentTime(audioRef.current.currentTime)
            }
        }, 1000)

        return () => {
            clearInterval(timer)
        }
    }, [])


    const handlePlayAudio = async() => {
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

    const handleToNextAudio = async(currentTrack1:IData) => {     
                if(audioRef.current){
                await setTrackIndex(trackIndex + 1)
                setCurrentTrack(data![trackIndex + 1])
                await (audioRef.current.src = currentTrack1?.preview)
                await setIsPlaying(true)
                await audioRef.current.play()
                }
}
    const handleToPreviousAudio = async(currentTrack1:IData) => {     
        if(audioRef.current?.play()){
            setIsPlaying(true)
        }else{
            setIsPlaying(false)
        }
                if(audioRef.current){
                await setTrackIndex(trackIndex - 1)
                setCurrentTrack(data![trackIndex - 1])
                await (audioRef.current.src = currentTrack1?.preview)
                await setIsPlaying(true)
                await audioRef.current.play()
                }
}

    if(!currentTrack){return <p className="trakcs-state">No Tracks yet...</p>}
    return ( 
        <div className="PlayBar">
        <div className="track-info">
        <img width={450} height={400} src={currentTrack.album.cover_big} alt="" />
        <div className="track-name-art">
        <p className="track-title">{currentTrack.title}.</p>
        <audio ref={audioRef} src={currentTrack.preview}/>
        <p className="track-artist">{currentTrack.artist.name}</p>
        </div>
        
        <div className="play-slider">
            <p>{formattedCurrentTime}</p>
            <Slider value={sliderCurrentTime} 
            onChange={handleChangeDuration}
            step={1}
            min={0}
            max={100}
            className="slider-line" />
            <p>{formattedDurationTime}</p>
        </div>
        </div>
        <div className="play-menu">
        <FontAwesomeIcon icon={faBackward} className="fb-btn" onClick={() => handleToPreviousAudio(currentTrack)} />
        <br/>
        {isPlaying?
         (<FontAwesomeIcon icon={faPause} className="ps-btn"onClick={handlePlayAudio}  />
        )
        :(<FontAwesomeIcon icon={faPlay} className="pl-btn" onClick={handlePlayAudio} />
        )}<br/>
        <FontAwesomeIcon icon={faForward} className="fw-btn" onClick={() => handleToNextAudio(currentTrack)}  />
        </div>
        </div>
     );
}

export default Playbar;

