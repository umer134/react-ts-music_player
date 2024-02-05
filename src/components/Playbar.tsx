import { FC, useRef, useEffect} from "react";
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
}   


const Playbar: FC <PlaybarProps> = ({
    currentTrack,
     isPlaying, 
    trackIndex,
    setCurrentTrack,
    data,
    setIsPlaying,
     setTrackIndex }) => {

    

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

    useEffect(() => {
        if(data){
             setCurrentTrack(data[trackIndex])
            setIsPlaying(false)
            if(trackIndex >= data.length){
                setTrackIndex(0)
                setCurrentTrack(data[trackIndex])
            }
            if(trackIndex < 0){
                setTrackIndex(0)
                setCurrentTrack(data[trackIndex])
            }
        }
           
        }, [trackIndex])
        
        useEffect(() => {
            setCurrentTrack(data?data[0]:null)
            setIsPlaying(false)
        }, [data])

    const handleToNextAudio = (currentTrack1:IData) => {     
           const nextTrack = async() => {
                if(audioRef.current){
                setTrackIndex(trackIndex + 1)
                setCurrentTrack(data![trackIndex])
                await (audioRef.current.src = currentTrack1?.preview)
                }
           }  
            if(currentTrack1.id === currentTrack.id){
                nextTrack()
            }
}
    const handleToPreviousAudio = (currentTrack1:IData) => {     
           const nextTrack = async() => {
                if(audioRef.current){
                setTrackIndex(trackIndex - 1)
                setCurrentTrack(data![trackIndex])
                (audioRef.current.src = currentTrack1?.preview)
                }
           }  
            if(currentTrack1.id === currentTrack.id){
                nextTrack()
            }
}

    if(!currentTrack){return <p className="trakcs-state">No Tracks yet...</p>}
    return ( 
        <div className="playBar">
        <img src={currentTrack.album.cover_big} alt="" />
        <div className="track-info">
        <p className="track-title">{currentTrack.title}</p>
        <audio ref={audioRef} src={currentTrack.preview}></audio>
        <p className="track-artist">{currentTrack.artist.name}</p>
        </div>
        <div className="play-menu">
        <FontAwesomeIcon icon={faBackward} onClick={() => handleToPreviousAudio(currentTrack)} />
        <br/>
        {isPlaying?
         (<FontAwesomeIcon icon={faPause} onClick={() =>handlePlayAudio(currentTrack)}  />
        )
        :(<FontAwesomeIcon icon={faPlay} onClick={() => handlePlayAudio(currentTrack)} />
        )}<br/>
        <FontAwesomeIcon icon={faForward} onClick={() => handleToNextAudio(currentTrack)}  />
        </div>
        </div>
     );
}

export default Playbar;

