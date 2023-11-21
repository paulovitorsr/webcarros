import {useState, useEffect} from "react";
import { Container } from "../../components/container";
import {Link} from "react-router-dom";

import {
  collection,
  query,
  getDocs,
  orderBy,
  where
} from "firebase/firestore";

import { db } from "../../services/FirebaseConection";

interface CarsProps{
  id: string;
  name: string;
  year: string;
  uid: string;
  price: string | number;
  city: string;
  km: string | number;
  model: string;
  images: ImagesProps[];
}

interface ImagesProps{
  name: string;
  uid: string;
  url: string;
}

export const Home = () => {
  const [cars, setCars] = useState<CarsProps[]>([])
  const [input, setInput] = useState("")
  //const [loadImages, setLoadImages] = useState<string[]>([])

  useEffect( () => {
    loadCars()
  }, [] )

  function loadCars(){
    const carsRef = collection(db, "cars")
    const queryRef = query(carsRef, orderBy("created", "desc"))

    getDocs(queryRef)
    .then( (snapshot) => {
      const listCars = [] as CarsProps[];

      snapshot.forEach( doc => {
        listCars.push({
          id: doc.id,
          name: doc.data().name,
          year: doc.data().year,
          city: doc.data().city,
          uid: doc.data().uid,
          price: doc.data().price,
          km: doc.data().km,
          images: doc.data().images,
          model: doc.data().model
          
        })
      })

      setCars(listCars);


    } )

  }

  /*function handleImageLoad(id: string){
    setLoadImages((prevImageLoaded) => [...prevImageLoaded, id])
  }*/

  async function handleSearchCar(){
    if(input === ''){
      loadCars();
      return;
    }

    setCars([]);
    
    const q = query(collection(db, "cars"),
      where("name", ">=", input.toLocaleUpperCase),
      where("name", "<=", input.toLocaleUpperCase + "\uf8ff")
    )

    const querySnapshot = await getDocs(q)

    const listCars = [] as CarsProps[];

    querySnapshot.forEach((doc) => {
      listCars.push({
        id: doc.id,
        name: doc.data().name,
        year: doc.data().year,
        city: doc.data().city,
        uid: doc.data().uid,
        price: doc.data().price,
        km: doc.data().km,
        images: doc.data().images,
        model: doc.data().model
      })
    })

    setCars(listCars)
  }

  return (
    <Container>
      <section className="bg-white p-4 rounded-lg w-full max-w-3xl mx-auto flex justify-center items-center gap-2">
        <input 
          className="w-full border-2 rounded-lg h-9 px-3 outline-none text-lg" 
          placeholder="Digite o nome do carro..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button 
            className="bg-red-500 h-9 px-8 rounded-lg text-white font-medium"
            onClick={handleSearchCar}
          >
          Buscar
        </button>
      </section>

      <h1 className="font-bold text-center mt-6 text-2xl mb-4">
        Carros novos e usados em todo Brasil
      </h1>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map( car => (
          <Link to={`/car/${car.id}`} key={car.id}>
            <section  className="w-full bg-white rounded-lg">
              <img 
                className="w-full rounded-lg mb-2 max-h-72 hover:scale-105 transition-all"
                src={car.images[0].url} 
                alt="Honda" 
                //style={{ display: loadImages.includes(car.id) ? "none" : "block"}}
                //onload={ () => handleImageLoad(car.id) }
              />

              <p className="font-bold mt-1 mb-2">{car.name}</p>
              <p>{car.model}</p>

              <div className="flex flex-col px-2">
                <span className="text-zinc-700 mb-6">Ano {car.year} | {car.km} KM</span>
                <strong className="text-black font-medium text-xl">R$ {car.price}</strong>

                <div className="w-full h-px bg-slate-200 my-2"></div>

                <div className="px-2 pb-2">
                  <span className="text-black">
                    {car.city}
                  </span>
                </div>
              </div>
            </section>
          </Link>
        ))}
      </main>
    </Container>
  )
}
