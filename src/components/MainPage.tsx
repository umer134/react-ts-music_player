import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Playbar from './Playbar';

const url = 'https://deezerdevs-deezer.p.rapidapi.com/search?q=';
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'a3aced8c4emshee2074e5cda39d7p1e2a39jsn7c9813371431',
		'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
	}
};

export interface IData {  
  id: number
  title: string
  duration: number
  preview: string
  artist: {
  name: string
  tracklist: string
  }
  album:{
  id:number
  title: string
  cover_big: string
  tracklist: string
  }
  type: string
}

function MainPage() {
  const [search, setSearch] = useState(false)
  const [data, setData] = useState<IData[] | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [currentTrack, setCurrentTrack] = useState<IData | null>()
  const [trackIndex, setTrackIndex] = useState<number>(0)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)

  const handleChangeInputValue = (arg:string):void => {
    setInputValue(arg)
  }

  const handleGetSearchResult = () => {
    setSearch(!search)
  }

useEffect(() => {
    fetch(`${url}${inputValue}`, options)
    .then(response => response.json())
    .then(response => setData(response.data))
},[search])


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
    setTrackIndex(0)
}, [data])

  return (
    <div className='MainPage'>
        <div className='container'>
          <div className='search-block'>
            <input type="text" className='search-inp' value={inputValue}
             onChange={(e) => handleChangeInputValue(e.target.value)} />
            <FontAwesomeIcon icon={faSearch} className='search-btn' onClick={handleGetSearchResult}/>
          </div>
        </div>
      
        <Playbar currentTrack={currentTrack!}
                 setCurrentTrack={setCurrentTrack}
                 trackIndex={trackIndex}
                 setTrackIndex={setTrackIndex}
                 isPlaying={isPlaying}
                 setIsPlaying={setIsPlaying}
                 data={data}
        />
    </div>
  )
}

export default MainPage;