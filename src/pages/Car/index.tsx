import {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {FaWhatsapp} from "react-icons/fa";
import { Container } from "../../components/container";
import {getDoc, doc} from "firebase/firestore";
import {db} from "../../services/FirebaseConection";

//Swiper slider
import { Swiper, SwiperSlide } from 'swiper/react';


interface CarsProps{
  id: string;
  name: string;
  year: string;
  uid: string;
  price: string | number;
  city: string;
  km: string | number;
  model: string;
  whatsapp: string;
  description: string;
  created: string;
  owner: string;
  images: ImagesProps[];
}

interface ImagesProps{
  name: string;
  uid: string;
  url: string;
}


export const CarDetail = () => {
  const [car, setCar] = useState<CarsProps>()
  const {id} = useParams()
  const [sliderPreview, setSliderPreview] = useState<number>(2)
  const navigate = useNavigate()

  useEffect( () => {
    async function loadCar() {

      if(!id){return;}

      const docRef = doc(db, "cars", id);
      getDoc(docRef)
      .then( (snapshot) => {

        if(!snapshot.data()){
          navigate("/")
        }

        setCar({
          id: snapshot.id,
          name: snapshot.data()?.name,
          year: snapshot.data()?.year,
          uid: snapshot.data()?.uid,
          price: snapshot.data()?.price,
          city: snapshot.data()?.city,
          km: snapshot.data()?.km,
          model: snapshot.data()?.model,
          whatsapp: snapshot.data()?.whatsapp,
          description: snapshot.data()?.description,
          created: snapshot.data()?.created,
          owner: snapshot.data()?.owner,
          images: snapshot.data()?.images

        })
      })
      .catch( (err) => {
        console.log(err)
      })

    }

    loadCar()

  }, [id] )

  useEffect( () => {

    function handleSlider(){

      if(window.innerWidth < 720){
        setSliderPreview(1)
      }else{
        setSliderPreview(2)
      }

    }

    handleSlider();

    window.addEventListener("resize", handleSlider)

    return () => {
      window.removeEventListener("resize", handleSlider)
    }

  }, [] )
  
  return (
    <Container>
      
      {car && (
        <Swiper
          slidesPerView={sliderPreview}
          pagination={{clickable: true}}
          navigation
        >
          {car?.images.map( image => (
            <SwiperSlide key={image.name}>
              <img src={image.url} className="w-full h-96 object-cover" />
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {car && (
        <main className="w-full bg-white rounded-lg p-6 my-4">
          <div className="flex flex-col sm:flex-row mb-4 items-center justify-between">
            <h1 className="font-bold text-3xl text-black">{car?.name}</h1>
            <h1 className="font-bold text-3xl text-black">R$ {car?.price}</h1>
          </div>
          <p>{car?.model}</p>

          <div className="flex w-full gap-6 my-4">
            <div className="flex flex-col gap-4">
              <div>
                <p>Cidade</p>
                <strong>{car?.city}</strong>
              </div>
              <div>
                <p>Ano</p>
                <strong>{car?.year}</strong>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <p>Km</p>
                <strong>{car?.km}</strong>
              </div>
            </div>
          </div>

          <strong>Descrição</strong>
          <p className="mb-3">{car?.description}</p>

          <strong>Telefone / Whatsapp</strong>
          <p>{car?.whatsapp}</p>

          <a 
            href={`https://api.whatsapp.com/send?phone=${car?.whatsapp}&text=Olá ví esse ${car.name} e fiquei interessado`}
            target="_blank"
            className="cursor-pointer bg-green-500 w-full text-white flex items-center justify-center gap-2 my-6 rounded-lg h-11 text-xl font-medium"
          >
            Conversar com vendedor <FaWhatsapp size={23} color="#fff" />
          </a>
        </main>
      )}
    </Container>
  )
}
