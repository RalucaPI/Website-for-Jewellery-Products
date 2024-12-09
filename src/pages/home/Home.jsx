import React, {useContext, useEffect, useState } from 'react'
import Context from '../../context/Context';
import './Home.css'
import Animatii from '../../animatii/Animatii';
import { Page } from './Page';
export const Home = () => {
  

const context = useContext(Context);
const add = () => {
  window.location.href = '/addproduct'
  }
  return (
    <>
      <Animatii />
      <Page/>
    </>
  )
}
