import React, { useState } from 'react';

import MyProfileView from './myProfile/MyProfileView.react';
import FrienderView from './friender/FrienderView.react';
import ChatView from './chat/ChatView.react';
import EventView from './event/EventView.react';

const Menu = (props) => {
    if (props.choixPage == 'myprofile') {
      return (<MyProfileView></MyProfileView>)
    } 
    if (props.choixPage == 'chat') {
      return (<ChatView></ChatView>)
    }
    if (props.choixPage == 'friender') {
        return (<FrienderView authToken={props.authToken}></FrienderView>)
    }
    if (props.choixPage == 'event') {
        return (<EventView></EventView>)
    }
  }

export default Menu;