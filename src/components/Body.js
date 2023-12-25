import {
  Divider,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import img1 from "../assets/iconsvg/banner-1.jpg";
import img2 from "../assets/iconsvg/banner-2.png";
import img3 from "../assets/iconsvg/banner-3.png";
import ChartWrapper from "./ChartWrapper";
import { useCallback, useEffect, useRef, useState } from "react";
import { Search } from "@mui/icons-material";
import API_CONST from "../utility/api.json";

const Body = () => {
  const [suggestionList, setSuggestionList] = useState([]);
  const [searchString, setSearchString] = useState("");
  const debounceFn = useCallback((fn, delay) => {
    let timer;
    return function (...args) {
      let ctx = this;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        fn.apply(ctx, args);
      }, delay);
    };
  }, []);
  const searchTrack = useCallback(async (search_str) => {
    const URL = `${API_CONST.base_url}?method=track.search&track=${search_str}&api_key=${API_CONST.api_key}&limit=5&country=india&format=json`;
    const searchRes$ = await fetch(URL);
    const searchRes = await searchRes$.json();
    setSuggestionList(searchRes.results?.trackmatches?.track ?? []);
    setIsOpenSuggestion(searchRes.results?.trackmatches?.track.length > 0);
  }, []);
  const debouncedSearch = useCallback(debounceFn(searchTrack, 300), [
    searchTrack,
  ]);
  const searchWrapper = useRef();
  const [isOpenSuggestion, setIsOpenSuggestion] = useState(false);
  useEffect(() => {
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("keydown", handleKeyDown);
  }, []);
  const handleMouseDown = (e) => {
    if (searchWrapper.current && !searchWrapper.current.contains(e.target))
      setIsOpenSuggestion(false);
    if (
      !isOpenSuggestion &&
      typeof e.target.value === "string" &&
      e.target.value
    )
      debouncedSearch(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsOpenSuggestion(false);
    }
  };

  return (
    <>
      <div className="banner-container">
        {[img3, img2, img1].map((image, i) => {
          return <img key={`${image}_${i}`} src={image} alt={image} />;
        })}
      </div>
      <div className="search-wrapper" ref={searchWrapper}>
        <TextField
          fullWidth
          className="search-textfield"
          id="global-search-input"
          placeholder="Search for music.."
          variant="outlined"
          autoFocus
          autoComplete="off"
          value={searchString}
          onChange={(e) => {
            setSearchString(e.target.value);
            debouncedSearch(e.target.value);
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  className="search-icon"
                  aria-label="toggle password visibility"
                  edge="end"
                >
                  <Search />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {suggestionList.length > 0 && isOpenSuggestion && (
          <section>
            <ul className="suggested-ul">
              {suggestionList.map((list) => (
                <li key={list.name}>
                  <Link
                    href={list.url}
                    target="_blank"
                    variant="body2"
                    underline="none"
                  >
                    <Typography variant="subtitle1">{list.name}</Typography>
                    <Typography variant="subtitlecaption" gutterBottom>
                      {list.artist}
                    </Typography>
                  </Link>
                  <Divider />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
      <div className="chartwrapper-container">
        <ChartWrapper></ChartWrapper>
      </div>
    </>
  );
};

export default Body;
