import React from "react";
import { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import ProtectedRouteElement from './ProtectedRoute';
import Register from './Register';
import Login from './Login';
import ImagePopup from './ImagePopup';
import '../index.css';
import Header from './Header.js';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import Main from './Main.js'
import Footer from './Footer.js'
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { api } from '../utils/Api';
import * as auth from '../utils/auth';

function App() {
    const [currentUser, setCurrentUser] = useState({
        "name": '',
        "about": '',
        "avatar": '',
        "_id": '',
        "cohort": ''
    });
    const [loggedIn, setLoggedIn] = useState(false);
    const [cards, setCards] = useState([]);
    useEffect(() => {
        Promise.all([api.getUserInfoApi(), api.getInitialCards()])
            .then(([resUser, resCard]) => {
                setCurrentUser(resUser);

                setCards(resCard);
            })
            .catch((error) => alert(`Произошла ошибка ${error}`));
    }, []);

    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
        React.useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
        React.useState(false);
    const [isImagePopupOpen, setImagePopupOpen] = React.useState(false);
    const [selectedCard, setSelectedCard] = React.useState({});
    const navigate = useNavigate();
    function handleEditAvatarClick() {
        setIsEditAvatarPopupOpen(true);
    }

    function handleEditProfileClick() {
        setIsEditProfilePopupOpen(true);
    }

    function handleAddPlaceClick() {
        setIsAddPlacePopupOpen(true);
    }

    function handleCardClick(card) {
        setSelectedCard(card);
        setImagePopupOpen(true);
    }

    function closeAllPopups() {
        setIsEditAvatarPopupOpen(false);
        setIsEditProfilePopupOpen(false);
        setIsAddPlacePopupOpen(false);
        setImagePopupOpen(false);
        setSelectedCard({});
    }

    function handlePopupOverlayClick(evt) {
        if (evt.target === evt.currentTarget) {
            closeAllPopups();
        }
    }

    function handleCardLike(card) {
        const isLiked = card.likes.some(i => i._id === currentUser._id);

        api.handleLikeApi(card._id, !isLiked)
            .then((newCard) => {
                setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
            })
            .catch(err => {
                console.log(err.status);
                alert(`Ошибка при постановке 'Мне нравится':\n ${err.status}\n ${err.text}`);
            });
    }

    const handleCardDelete = (card) => {
        api.deleteCardApi(card._id)
            .then(res => {
                console.log(res);
                setCards((state) => state.filter((c) => c._id !== card._id));
                closeAllPopups();
            })
            .catch(err => {
                console.log(err.status);
                alert(`Ошибка удаления карточки:\n ${err.status}\n ${err.text}`);
            })
    }

    function handleUpdateUser(objUserInfo) {
        api.setUserInfoApi(objUserInfo)
            .then(updatedUser => {
                setCurrentUser(updatedUser);
                closeAllPopups();
            })
            .catch(err => {
                console.log(err.status);
                alert(`Ошибка обновления данных пользователя:\n ${err.status}\n ${err.text}`)
            })
    }

    function handleUpdateAvatar(link) {
        api.setUserAvatarApi(link)
            .then(updatedUser => {
                setCurrentUser(updatedUser);
                closeAllPopups();
            })
            .catch(err => {
                console.log(err.status);
                alert(`Ошибка обновления аватара пользователя:\n ${err.status}\n ${err.text}`)
            })
    }

    function handleAddPlace(card) {
        api.addCardApi(card)
            .then(newCard => {
                setCards([newCard, ...cards]);
                closeAllPopups();
            })
            .catch(err => {
                console.log(err.status);
                alert(`Ошибка добавления карточки:\n ${err.status}\n ${err.text}`);
            })
    }
    
    function handleLogin(data) {
        const {emailUser, password} = data;
        auth.authorizeUser(emailUser, password)
          .then((res)=>{
            localStorage.setItem("jwt", res.token);
            setLoggedIn(true);
            navigate('/', {replace: true})
            setUserEmail(emailUser)
          })
          .catch((err) => {
            alert(`Ошибка авторизации пользователя\n ${err.status}\n ${err.text}`);
          })
      }
    
      function handleRegister(data){
        const {emailUser, password} = data
        auth.registerUser(emailUser, password)
          .then(()=>{
            navigate('/sign-in', {replace: true})
          })
          .catch((err) => {
            alert(`Ошибка регистрации пользователя\n ${err.status}\n ${err.text}`);
          })
      }

    return (
        <CurrentUserContext.Provider value={currentUser}>
            <div className="page">
                <Header />
                <Routes>
                    <Route path="/sign-up" element={<Register title="Регистрация" name="register" handleRegister={handleRegister}/>} />
                    <Route path="/sign-in" element={<Login title="Вход" name="login" handleLogin={handleLogin} />} />
                    <Route path="/" element={
                        <ProtectedRouteElement
                            component={Main}
                            loggedIn={loggedIn}
                            cards={cards}
                            onEditProfile={handleEditProfileClick}
                            onAddPlace={handleAddPlaceClick}
                            onEditAvatar={handleEditAvatarClick}
                            onCardClick={handleCardClick}
                            onCardLike={handleCardLike}
                            onDeleteClick={handleCardDelete} />
                    } />
                </Routes>

                <Footer />

                <EditProfilePopup
                    isOpen={isEditProfilePopupOpen}
                    onClose={closeAllPopups}
                    onUpdateUser={handleUpdateUser}
                    onOverlayClick={handlePopupOverlayClick}
                />

                <AddPlacePopup
                    isOpen={isAddPlacePopupOpen}
                    onClose={closeAllPopups}
                    onAddPlace={handleAddPlace}
                    onOverlayClick={handlePopupOverlayClick}
                />

                <ImagePopup
                    card={selectedCard}
                    isOpen={isImagePopupOpen}
                    onClose={closeAllPopups}
                    onOverlayClick={handlePopupOverlayClick}
                ></ImagePopup>

                <EditAvatarPopup
                    isOpen={isEditAvatarPopupOpen}
                    onClose={closeAllPopups}
                    onUpdateAvatar={handleUpdateAvatar}
                    onOverlayClick={handlePopupOverlayClick}
                />
            </div>
        </CurrentUserContext.Provider>
    );
}

export default App;
