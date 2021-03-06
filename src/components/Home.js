import React, { useContext, useEffect } from 'react';
import {ReactComponent as Background} from "./Test.svg";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { AppContext } from "../AppContext";
import HandleApiCall from "./HandleApiCall";
import ArtistList from "./ArtistList";
import AlbumList from "./AlbumList";
import TrackList from './TrackList';
import Lyrics from './Lyrics';
import './../App.css';
import Card from 'react-bootstrap/Card';
import SingleList from "./SingleList";
import Modal from './Modal.js';


function Home() {
  const { artistList, search, setSearch, setAlbumList, animationState, setSingleList, setAnimationState, setSearchMethod, setQueryType, currentList, setCurrentList, counter, setCounter, backBtn, setBackBtn, prevState, setPrevState, setArtistList, error, setError, setModalShow, modalShow, lyrics, setLyrics, setTrackList} = useContext(AppContext);

  let currentlyVisibleState = null;
  let modalVisible = null;

  const handleSearch = e => {
    e.preventDefault();
    setSearchMethod("artist.search");
    setQueryType("q_artist");
    searchBarAnimation(e.target.search.value);
    let artist = e.target.search.value.replace(" ", "%20");
    setSearch(artist);
    setCounter(counter + 1);
    renderArtists();
  }

  const renderArtists = () => {
    if(search === null) {
      return <></>
    } else {
      return <HandleApiCall/>
    }
  }

  if(currentList === 'home') {
    setAnimationState(false);
    setArtistList(null);
    if(error === "noArtists") {
      modalVisible = true;
    }
    console.log(modalVisible + "home");
  }

  useEffect(() => {
    if (error === "noArtists") {
      setCurrentList('home')
    } else if(currentList === "artistList" && error === "noTracks") {
      setCurrentList('artistList')
    }
    // if (error !== null) {
    //   modalVisible = true
    // }
  }, [error]);

 


  if (currentList === "artistList") {
    setPrevState('home');
    setLyrics(null);
    currentlyVisibleState = <ArtistList/>;
    modalVisible = error !== null ? true : null;
  } else if(currentList === "albumList") {
    setPrevState('artistList')
    currentlyVisibleState = <AlbumList/>;
    modalVisible = error !== null ? true : null;
  } else if (currentList === "singleList") {
    setPrevState("artistList");
    currentlyVisibleState = <SingleList/>
    modalVisible = error !== null ? true : null;
  } else if(currentList === "trackList") {
    modalVisible = null
    setPrevState('albumList')
    currentlyVisibleState = <TrackList/>;
  } else if(error !== "error" && currentList === "lyrics") {
      modalVisible = null;
      if(prevState === 'artistList') {
        setPrevState('singleList');
      } else if(prevState === 'albumList') {
        setPrevState('trackList');
      } 
      currentlyVisibleState = <Lyrics/>;
    }

    const backButton = (prevState) => {
      if (error !== "error" && currentList === "lyrics") {
        setLyrics(null);
        setCurrentList(prevState); 
      } else if(currentList === 'trackList' || currentList === 'singleList') {
        setTrackList(null);
        setCurrentList(prevState);
      } else if (currentList === 'albumList') {
        setAlbumList(null);
        setCurrentList(prevState);
      } else {
        setAlbumList(null);
        setCurrentList(prevState);
      }
    }

    const searchBarAnimation = (search) => {
      if(search !== undefined) {
        setAnimationState(true);
      } else if(currentList !== 'home') {
        setAnimationState(true);
      } 
    }

  if (currentList === "home") {
    return(
      <>
        <Background />
        <Container className="container-position">
          <Row>
            <Col lg={12}>
              <Form className="form-style" id={animationState ? 'move' : 'move-back'} onSubmit={handleSearch}>
                <Form.Group controlId="formBasicSearch">
                  <Form.Control size="lg" type="text" placeholder="Search..." name="search" className="input-color" required></Form.Control>
                  <Form.Text className="form-text">
                    Search by Artist
                  </Form.Text>
                </Form.Group>                                
                <Button size="lg" type="submit" id="button-color" onClick={() => searchBarAnimation(), () => setModalShow(true)}>                                                            
                  Enter
                </Button>
              </Form>
              {modalVisible ? <Modal show={modalShow} onHide={() => setModalShow(false)}/> : <></>}
            </Col>
          </Row>
          <Row>
            {renderArtists()}  
          </Row>
        </Container>
      </>
    );
  } else {
    return(
      <>
        <Background />
        <Container className="container-position">
          <Row>
            <Col lg={12}>
              <Form className="form-style" id={animationState ? 'move' : ''} onSubmit={handleSearch}>
                <Form.Group controlId="formBasicSearch">
                  <Form.Control size="lg" type="text" placeholder="Search..." name="search" className="input-color"></Form.Control>
                  <Form.Text className="form-text">
                    Search by Artist
                  </Form.Text>
                </Form.Group>                                
                <Button size="lg" type="submit" id="button-color" className={animationState ? 'fade' : ''} onClick={() => searchBarAnimation()}>                                                            
                  Enter
                </Button>
              </Form>
            </Col>
          </Row>
          <Row>
            <Card className="list-card mt-2 pb-4">
            <Button className="back-btn mt-3 mb-1" onClick={() => backButton(prevState)}>Back</Button>
              <Card.Text className="mb-3">
                {currentlyVisibleState}
                {modalVisible ? <Modal show={modalShow} onHide={() => setModalShow(false)}/> : <></>}
              </Card.Text>
            </Card>
          </Row>
          <Row>
            {renderArtists()}  
          </Row>
        </Container>
      </>
    );
  }
}


export default Home;


// How I got the modal to work correctly:
// The conditional in the onclicks wasn't working because the error state wasn't being changed fast enough. 
// I realized that if the response throws an error, the lyrics state slice doesn't get updated and remains at null
// So instead of checking if error === 'error' I checked if lyrics === 'null'
// This worked for the if and I was able to get into the first block instead of always hitting the else
// Then once we get to the home component, the call will have been made and the error state slice changed. 
// So i added a conditional inside of both track list and single list to check if error === 'error' and if it does show the modal and it worked!