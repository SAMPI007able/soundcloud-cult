import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import SongCard from "./SongCard";
import API_CONST from "../utility/api.json";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const ChartWrapper = () => {
  const [value, setValue] = useState(0);
  const [songData, setSongData] = useState([]);
  const [songDataPageNum, setSongDataPageNum] = useState(1);
  const [topArtists, setTopArtists] = useState([]);
  const songDataLimit = 10;
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  useEffect(() => {
    switch (value) {
      case 0: {
        getTopTracks();
        break;
      }
      case 1: {
        getTopArtists();
        break;
      }
      default:
        break;
    }
  }, [value]);

  useEffect(() => {
    if (songDataPageNum > 1) {
      getTopTracks();
    }
  }, [songDataPageNum]);

  useEffect(() => {
    window.addEventListener('scroll', handleDocumentScroll)
  }, [])

  const handleDocumentScroll = e => {
    if(window.innerHeight + Math.ceil(document.documentElement.scrollTop) === document.documentElement.scrollHeight) {
      handleSongDataPagination()
    }
  }

  const getTopTracks = () => {
    const methodName = "geo.gettoptracks";
    const URL = `${API_CONST.base_url}?method=${methodName}&api_key=${API_CONST.api_key}&limit=${songDataLimit}&page=${songDataPageNum}&country=india&location=kolkata&format=json`;
    fetch(URL, {})
      .then((response) => response.json())
      .then((data) => {
        if ("tracks" in data) {
          const len = data.tracks.track.length;
          const currentSongDataLen = songData.length;
          if (len > songDataLimit) {
            data.tracks.track = data.tracks.track.slice(songDataLimit * -1);
          }
          let songs = data.tracks.track.map((song) => ({
            ...song,
            coverPic: "",
          }));
          setSongData((prevList) => [...prevList, ...songs]);
          // Now fetch cover pic for each track
          const updateSongInformation = async () => {
            const songInfo$ = [];
            for (let i = 0; i < songs.length; i++) {
              const song = songs[i];
              const infoURL = `${API_CONST.base_url}?method=track.getInfo&artist=${song.artist?.name}&track=${song.name}&api_key=${API_CONST.api_key}&format=json`;
              const info$ = await fetch(infoURL);
              const infoJSON = await info$.json();
              songInfo$.push(infoJSON);
            }
            return songInfo$;
          };
          updateSongInformation().then((data) => {
            const updatedSongData = songs.map((song) => {
              let songDataItemToUpdate = data.find(
                (songInfo) =>
                  songInfo.track.name === song.name &&
                  songInfo.track.artist.name === song.artist.name
              );
              song.coverPic =
                songDataItemToUpdate?.track.album?.image.find(
                  ({ size }) => size === "extralarge"
                )["#text"] ?? "--";
              return song;
            });
            setSongData((prev) => {
              prev.splice(currentSongDataLen, len);
              return [...prev, ...updatedSongData];
            });
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getTopArtists = () => {
    const methodName = "geo.gettopartists";
    const URL = `${API_CONST.base_url}?method=${methodName}&api_key=${API_CONST.api_key}&limit=10&country=india&format=json`;
    fetch(URL, {})
      .then((response) => response.json())
      .then((data) => {
        if ("topartists" in data) {
          let artists = data.topartists.artist.map((artist) => ({
            ...artist,
            coverPic: "",
            summary: "",
          }));
          setTopArtists(artists);

          // Now fetch cover pic for each track

          const updateSongInformation = async () => {
            const artistInfo$ = [];
            for (let i = 0; i < artists.length; i++) {
              const artist = artists[i];
              const infoURL = `${
                API_CONST.base_url
              }?method=artist.getInfo&artist=${encodeURIComponent(
                artist?.name
              )}&api_key=${API_CONST.api_key}&format=json`;
              const info$ = await fetch(infoURL);
              const infoJSON = await info$.json();
              artistInfo$.push(infoJSON);
            }
            return artistInfo$;
          };
          updateSongInformation().then((data) => {
            const updatedArtistData = artists.map((artist) => {
              let songDataItemToUpdate = data.find(
                (artistInfo) => artistInfo.artist.name === artist.name
              );
              artist.coverPic =
                songDataItemToUpdate?.artist?.image[2]["#text"] ?? null;
              artist.summary =
                songDataItemToUpdate?.artist?.bio.summary.slice(0, 100) + "...";
              return artist;
            });
            setTopArtists(updatedArtistData);
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSongDataPagination = () => {
    setSongDataPageNum((prev) => prev + 1);
  };
  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="All Recomendations" {...a11yProps(0)} />
          <Tab label="Top Artists" id={1} {...a11yProps(1)} />
        </Tabs>
        <CustomTabPanel value={value} index={0}>
          <div className="song-grid" value={value} index={0}>
            {songData.map((song, i) => {
              return <SongCard key={`${song.name}_${i}`} details={song}></SongCard>;
            })}
          </div>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <div className="song-grid">
            {topArtists.map((artist) => {
              return <SongCard key={artist.name} details={artist}></SongCard>;
            })}
          </div>
        </CustomTabPanel>
      </Box>
    </Box>
  );
};

export default ChartWrapper;
