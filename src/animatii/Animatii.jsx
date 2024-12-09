import './Animatii.css';
import { Environment, Float, Text, Shadow } from '@react-three/drei';
import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Pandantiv } from './modele3d/Pandantiv';
import { Light } from './modele3d/Light';
import { Earrings } from './modele3d/Earrings';
import { Lantisor } from './modele3d/Lantisor';
import { Inel } from './modele3d/Inel';
import { Bracelet } from './modele3d/Bracelet';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import img1 from './img/img1.jpg';
import img2 from './img/img2.jpg';
import img3 from './img/img3.jpg';
import img4 from './img/img4.jpg';
import img5 from './img/img5.jpg';
import { useNavigate } from 'react-router-dom';

function Animatii() {
  const navigate = useNavigate();

  return (
    <>
      <div className="container_animatii ">
        <div className="main_content">
          <div className='text-white text-center text-8xl mt-6 italic'>
            <div className='font-dancing-script'>Glamour</div>
          </div>
          <Canvas>
            <Scene />
          </Canvas>
        </div>
        <div className="bottom-panel ">
          <div className="bottom-panel-section thumbex thumbnail">
            <button onClick={() => navigate('/personalizare')}
              className="image-container"
              style={{ backgroundImage: `url(https://www.stildiamonds.ro/files/product/NECKLACE-PRODUCTIE-NUME-MARIA-aur-alb-20.png)` }}
            >
              <span className='text_animatie'>Bijuterii personalizate</span>
            </button>
          </div>
          <div className="bottom-panel-section thumbex thumbnail">
            <button onClick={() => navigate('/cercei')}
              className="image-container"
              style={{ backgroundImage: `url(${img2})` }}
            >
              <span className='text_animatie'>Cercei</span>
            </button>
          </div>
          <div className="bottom-panel-section thumbex thumbnail">
            <button onClick={() => navigate('/coliere')}
              className="image-container"
              style={{ backgroundImage: `url(${img3})` }}
            >
              <span className='text_animatie'>Coliere</span>
            </button>
          </div>
          <div className="bottom-panel-section thumbex thumbnail">
            <button onClick={() => navigate('/inele')}
              className="image-container"
              style={{ backgroundImage: `url(${img4})` }}
            >
              <span className='text_animatie'>Inele</span>
            </button>
          </div>
          <div className="bottom-panel-section thumbex thumbnail">
            <button onClick={() => navigate('/bratari')}
              className="image-container"
              style={{ backgroundImage: `url(${img1})` }}
            >
              <span className='text_animatie'>Bratari</span>
            </button>
          </div>
          <div className="bottom-panel-section thumbex thumbnail">
            <button onClick={() => navigate('/verighete')}
              className="image-container"
              style={{ backgroundImage: `url(${img5})` }}
            >
              <span className='text_animatie'>Verighete</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}


function Scene() {
  const [currentModel, setCurrentModel] = useState('earrings');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentModel((prevModel) => {
        switch (prevModel) {
          case 'earrings':
            return 'pandantiv';
          case 'pandantiv':
            return 'bratara';
          case 'bratara':
            return 'lantisor';
          case 'lantisor':
            return 'inel';
          case 'inel':
          default:
            return 'earrings';
        }
      });
    }, 5000); // Schimbă modelul la fiecare 5 secunde

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} />
      <Environment preset="forest" />
      <EffectComposer>
        <Bloom
          luminanceThreshold={0}
          luminanceSmoothing={0.9}
          height={300}
          intensity={0.2}
          color="#999999"
        />
      </EffectComposer>
      {currentModel === 'earrings' && (
        <>
          <Earrings scale={8} position={[-0.3, 2, 0]} />
        </>
      )}
      {currentModel === 'pandantiv' && (
        <>
          <Float speed={2} rotationIntensity={2} floatIntensity={0.6} floatingRange={[1, 1]}>
            <Pandantiv scale={0.2} rotation={[-Math.PI / 2, 0, 2]} position={[0.5, 1.5, 0]} />
          </Float>
        </>
      )}
      {currentModel === 'bratara' && (
        <>
          <Float speed={2} rotationIntensity={2} floatIntensity={0.6} floatingRange={[1, 1]}>
            <Bracelet scale={4.5} position={[0, -0.5, 17]} />
          </Float>
        </>
      )}
      {currentModel === 'lantisor' && (
        <>
          <Float speed={2} rotationIntensity={2} floatIntensity={0.6} floatingRange={[1, 1]}>
            <Lantisor scale={0.025} position={[1.3, 4.2, -8]} rotation={[-Math.PI / 8, 2, 4]} />
          </Float>
        </>
      )}
      {currentModel === 'inel' && (
        <>
          <Inel scale={0.4} position={[0, 2.5, 0]} />
        </>
      )}
      <Light position={[0, -1, 0]} scale={1.3} />
    </>
  );
}

export default Animatii;
